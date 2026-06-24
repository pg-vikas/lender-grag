import express, { type Express } from "express";
import fs from "fs";
import { promises as fsPromises } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

const CLIENT_PHOTO_PUBLIC_PATH = "/uploads/client-photos";
const CLIENT_PHOTO_UPLOAD_DIR = process.env.CLIENT_PHOTO_UPLOAD_DIR || path.resolve(process.cwd(), "uploads", "client-photos");
const MAX_CLIENT_PHOTO_BYTES = 3 * 1024 * 1024;
const MAX_CLIENT_PHOTO_DIMENSION = 8000;
const OUTPUT_CLIENT_PHOTO_SIZE = 512;
const allowedClientPhotoMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedClientPhotoFormats = new Set(["jpeg", "jpg", "png", "webp"]);

function createClientPhotoError(message: string) {
  const error = new Error(message) as Error & { status?: number };
  error.status = 400;
  return error;
}

function ensureClientPhotoUploadDirSync() {
  fs.mkdirSync(CLIENT_PHOTO_UPLOAD_DIR, { recursive: true });
}

function getSafeClientPhotoFilename(photoUrl?: string | null) {
  if (!photoUrl || !photoUrl.startsWith(`${CLIENT_PHOTO_PUBLIC_PATH}/`)) {
    return "";
  }

  const filename = path.basename(photoUrl);

  if (!/^client-[a-f0-9-]+\.webp$/i.test(filename)) {
    return "";
  }

  return filename;
}

export function registerClientPhotoStaticRoute(app: Express) {
  ensureClientPhotoUploadDirSync();

  app.use(
    CLIENT_PHOTO_PUBLIC_PATH,
    express.static(CLIENT_PHOTO_UPLOAD_DIR, {
      dotfiles: "deny",
      etag: true,
      fallthrough: false,
      immutable: true,
      index: false,
      maxAge: "1y",
      setHeaders: (res) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      },
    }),
  );
}

export async function saveClientPhotoFromDataUrl(photoDataUrl: string) {
  const match = photoDataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/i);

  if (!match) {
    throw createClientPhotoError("Please upload a JPG, PNG, or WebP image file.");
  }

  const mimeType = match[1].toLowerCase().replace("image/jpg", "image/jpeg");

  if (!allowedClientPhotoMimeTypes.has(mimeType)) {
    throw createClientPhotoError("Please upload a JPG, PNG, or WebP image file.");
  }

  const base64Payload = match[2].replace(/\s/g, "");
  const imageBuffer = Buffer.from(base64Payload, "base64");

  if (!imageBuffer.length) {
    throw createClientPhotoError("Please choose a valid client photo.");
  }

  if (imageBuffer.length > MAX_CLIENT_PHOTO_BYTES) {
    throw createClientPhotoError("Client photo must be 3 MB or less.");
  }

  try {
    const metadata = await sharp(imageBuffer, { failOn: "error" }).metadata();

    if (!metadata.format || !allowedClientPhotoFormats.has(metadata.format)) {
      throw createClientPhotoError("Please upload a JPG, PNG, or WebP image file.");
    }

    if (!metadata.width || !metadata.height) {
      throw createClientPhotoError("Please choose a valid client photo.");
    }

    if (metadata.width > MAX_CLIENT_PHOTO_DIMENSION || metadata.height > MAX_CLIENT_PHOTO_DIMENSION) {
      throw createClientPhotoError("Client photo dimensions are too large. Please upload a smaller image.");
    }

    const optimizedImage = await sharp(imageBuffer, { failOn: "error" })
      .rotate()
      .resize(OUTPUT_CLIENT_PHOTO_SIZE, OUTPUT_CLIENT_PHOTO_SIZE, {
        fit: "cover",
        position: "center",
        withoutEnlargement: false,
      })
      .webp({ quality: 82 })
      .toBuffer();

    await fsPromises.mkdir(CLIENT_PHOTO_UPLOAD_DIR, { recursive: true });

    const filename = `client-${randomUUID()}.webp`;
    await fsPromises.writeFile(path.join(CLIENT_PHOTO_UPLOAD_DIR, filename), optimizedImage, { flag: "wx" });

    return `${CLIENT_PHOTO_PUBLIC_PATH}/${filename}`;
  } catch (error) {
    if (error instanceof Error && "status" in error) {
      throw error;
    }

    throw createClientPhotoError("Please choose a valid client photo.");
  }
}

export async function deleteClientPhotoFile(photoUrl?: string | null) {
  const filename = getSafeClientPhotoFilename(photoUrl);

  if (!filename) {
    return;
  }

  try {
    await fsPromises.unlink(path.join(CLIENT_PHOTO_UPLOAD_DIR, filename));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.warn("Could not delete old client photo:", error);
    }
  }
}
