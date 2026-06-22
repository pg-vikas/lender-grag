import "./env";
import crypto from "crypto";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import type { Express, NextFunction, Request, RequestHandler, Response } from "express";
import {
  loginSchema,
  sessionUserSchema,
  signupSchema,
  type SessionUser,
  type UserRole,
} from "@shared/schema";
import { pool, storage } from "./storage";
import { sendNotificationEmail } from "./mailer";
import { renderEmailTemplate } from "./emailTemplates";

declare module "express-session" {
  interface SessionData {
    user?: SessionUser;
  }
}

const PgStore = connectPgSimple(session);
const HASH_KEYLEN = 64;
const HASH_DIGEST = "sha256";

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getPhoneDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const normalizedDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  return normalizedDigits.slice(0, 10);
}

function formatPhoneNumber(phone: string) {
  const digits = getPhoneDigits(phone);

  if (digits.length !== 10) {
    return phone.trim();
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function scryptAsync(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, HASH_KEYLEN, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt);
  return `${salt}:${hash.toString("hex")}`;
}

async function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHashHex] = passwordHash.split(":");
  if (!salt || !storedHashHex) {
    return false;
  }

  const calculatedHash = await scryptAsync(password, salt);
  const storedHash = Buffer.from(storedHashHex, "hex");

  if (storedHash.length !== calculatedHash.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedHash, calculatedHash);
}

function toSessionUser(user: {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  createdAt: Date;
}): SessionUser {
  return sessionUserSchema.parse({
    id: user.id,
    email: user.email,
    name: user.fullName,
    phone: user.phone,
    role: user.role,
    joined: user.createdAt.toISOString(),
  });
}

export function configureSessions(app: Express) {
  const sessionSecret = getRequiredEnv("SESSION_SECRET");
  const isProduction = process.env.NODE_ENV === "production";

  app.set("trust proxy", 1);
  app.use(
    session({
      name: process.env.SESSION_COOKIE_NAME?.trim() || "lg.sid",
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      proxy: true,
      store: new PgStore({
        pool,
        tableName: process.env.SESSION_TABLE_NAME?.trim() || "user_sessions",
        createTableIfMissing: true,
      }),
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction,
        maxAge: Number.parseInt(process.env.SESSION_TTL_MS ?? `${1000 * 60 * 60 * 8}`, 10),
      },
    }),
  );
}

export async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    return;
  }

  const existingAdmin = await storage.getUserByEmail(adminEmail);
  if (existingAdmin) {
    return;
  }

  const passwordHash = await hashPassword(adminPassword);
  await storage.createUser({
    email: adminEmail,
    fullName: process.env.ADMIN_NAME?.trim() || "System Admin",
    phone: process.env.ADMIN_PHONE?.trim() || "",
    role: "admin",
    passwordHash,
  });
}

export function requireRole(role: UserRole): RequestHandler {
  return (req, res, next) => {
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}

async function sendWelcomeEmail(user: SessionUser) {
  const appUrl = process.env.APP_URL?.trim() || "http://localhost:5002";

  await sendNotificationEmail({
    to: user.email,
    subject: "Welcome to your Lender Greg client portal",
    text: [
      `Hi ${user.name},`,
      "",
      "Welcome to Lender Greg. Your client portal is ready.",
      "",
      "What happens next:",
      "- Log in anytime to track your loan progress",
      "- Upload documents securely in one place",
      "- Review updates from Greg's team as your file moves forward",
      "",
      `Portal: ${appUrl}/portal`,
      "",
      "If you need anything, just reply to this email.",
      "",
      "Greg Wynn",
      "Lender Greg",
    ].join("\n"),
    html: renderEmailTemplate({
      eyebrow: "Welcome",
      title: "Your client portal is ready",
      intro: `Hi ${user.name}, welcome to Lender Greg. We’ve set up your secure client portal so you can follow your mortgage journey in one place.`,
      body: [
        "From pre-approval through closing, the portal is designed to keep everything clear, fast, and easy to manage.",
      ],
      bullets: [
        "Track your loan progress in real time",
        "Upload documents securely whenever you need to",
        "Review updates and next steps from Greg’s team",
      ],
      button: {
        label: "Open Your Portal",
        href: `${appUrl}/portal`,
      },
      closing: "We’re excited to help you move forward with confidence.",
      signature: "Greg Wynn\nLender Greg",
    }),
  });
}

export function registerAuthRoutes(app: Express) {
  const saveSessionAndSendUser = (statusCode: number, req: Request, res: Response, next: NextFunction) => {
    req.session.save((error) => {
      if (error) {
        next(error);
        return;
      }

      res.status(statusCode).json({ user: req.session.user ?? null });
    });
  };

  app.get("/api/auth/me", (req, res) => {
    res.status(200).json({ user: req.session.user ?? null });
  });

  app.post("/api/auth/signup", async (req, res, next) => {
    try {
      const input = signupSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(input.email);

      if (existingUser) {
        return res.status(409).json({ message: "An account with that email already exists" });
      }

      const passwordHash = await hashPassword(input.password);
      const user = await storage.createUser({
        email: normalizeEmail(input.email),
        fullName: input.name.trim(),
        phone: formatPhoneNumber(input.phone),
        role: "client",
        passwordHash,
      });

      req.session.user = toSessionUser(user);
      try {
        await sendWelcomeEmail(req.session.user);
      } catch (mailError) {
        console.error("Welcome email failed:", mailError);
      }

      saveSessionAndSendUser(201, req, res, next);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/login", async (req, res, next) => {
    try {
      const input = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(input.email);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const passwordMatches = await verifyPassword(input.password, user.passwordHash);
      if (!passwordMatches) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.user = toSessionUser(user);
      saveSessionAndSendUser(200, req, res, next);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/auth/logout", (req, res, next) => {
    req.session.destroy((error) => {
      if (error) {
        next(error);
        return;
      }

      res.clearCookie(process.env.SESSION_COOKIE_NAME?.trim() || "lg.sid");
      res.status(200).json({ ok: true });
    });
  });
}
