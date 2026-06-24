import crypto from "crypto";
import { promisify } from "util";
import type { Express, Request, Response } from "express";
import { getPublicAppUrl } from "../emails/commonEmailLayout";
import { renderPasswordResetEmail } from "../emails/passwordResetEmail";
import { hashAuditIdentifier, recordAuditEvent } from "../auditLog";

const scryptAsync = promisify(crypto.scrypt);

export type PasswordResetUser = {
  id: string | number;
  email: string;
  name?: string | null;
  fullName?: string | null;
};

export type PasswordResetTokenRecord = {
  userId: string | number;
  tokenHash: string;
  expiresAt: Date | string;
  usedAt?: Date | string | null;
};

export type PasswordResetStorage = {
  getUserByEmail(email: string): Promise<PasswordResetUser | null | undefined>;
  createPasswordResetToken(data: {
    userId: string | number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;
  getPasswordResetToken(tokenHash: string): Promise<PasswordResetTokenRecord | null | undefined>;
  deletePasswordResetToken(tokenHash: string): Promise<void>;
  deletePasswordResetTokensForUser?(userId: string | number): Promise<void>;
  updateUserPassword(userId: string | number, passwordHash: string): Promise<void>;
};

export type PasswordResetMailer = {
  sendMail(message: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<unknown>;
};

export type RegisterPasswordResetRoutesOptions = {
  storage: PasswordResetStorage;
  mailer: PasswordResetMailer;
  baseUrl?: string;
  tokenTtlMinutes?: number;
};

const genericForgotPasswordMessage = {
  message: "If an account exists for this email, a password reset link has been sent.",
};

function normalizeEmail(email: unknown) {
  return String(email ?? "").trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const buffer = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${buffer.toString("hex")}`;
}

function buildResetUrl(baseUrl: string, token: string) {
  return `${baseUrl.replace(/\/$/, "")}/reset-password/${encodeURIComponent(token)}`;
}

function sendJsonError(res: Response, status: number, message: string) {
  return res.status(status).json({ message });
}

export function registerPasswordResetRoutes(
  app: Express,
  { storage, mailer, baseUrl = getPublicAppUrl(), tokenTtlMinutes = 30 }: RegisterPasswordResetRoutesOptions,
) {
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    const email = normalizeEmail(req.body?.email);

    if (!isValidEmail(email)) {
      await recordAuditEvent(req, {
        category: "authentication",
        action: "auth.password_reset.request",
        outcome: "failure",
        severity: "warning",
        statusCode: 200,
        metadata: {
          reason: "invalid_email_format",
        },
      });
      return res.json(genericForgotPasswordMessage);
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      await recordAuditEvent(req, {
        category: "authentication",
        action: "auth.password_reset.request",
        outcome: "success",
        actorEmail: email,
        targetType: "user",
        entityTable: "users",
        statusCode: 200,
        metadata: {
          emailHash: hashAuditIdentifier(email),
          accountFound: false,
        },
      });
      return res.json(genericForgotPasswordMessage);
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashResetToken(token);
    const expiresAt = new Date(Date.now() + tokenTtlMinutes * 60 * 1000);

    if (storage.deletePasswordResetTokensForUser) {
      await storage.deletePasswordResetTokensForUser(user.id);
    }

    await storage.createPasswordResetToken({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    const resetUrl = buildResetUrl(baseUrl, token);
    const emailMessage = renderPasswordResetEmail({
      name: user.name || user.fullName,
      resetUrl,
      expiresInMinutes: tokenTtlMinutes,
    });

    await mailer.sendMail({
      to: user.email,
      ...emailMessage,
    });

    await recordAuditEvent(req, {
      category: "authentication",
      action: "auth.password_reset.request",
      outcome: "success",
      actorEmail: email,
      targetType: "user",
      targetId: user.id,
      targetLabel: user.email,
      entityTable: "password_reset_tokens",
      statusCode: 200,
      metadata: {
        emailHash: hashAuditIdentifier(email),
        accountFound: true,
        tokenTtlMinutes,
      },
    });

    return res.json(genericForgotPasswordMessage);
  });

  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    const token = String(req.body?.token ?? "").trim();
    const password = String(req.body?.password ?? "");

    if (!token) {
      await recordAuditEvent(req, {
        category: "authentication",
        action: "auth.password_reset.complete",
        outcome: "failure",
        severity: "warning",
        statusCode: 400,
        metadata: {
          reason: "missing_token",
        },
      });
      return sendJsonError(res, 400, "Reset token is required");
    }

    if (password.length < 8) {
      await recordAuditEvent(req, {
        category: "authentication",
        action: "auth.password_reset.complete",
        outcome: "failure",
        severity: "warning",
        statusCode: 400,
        metadata: {
          reason: "password_too_short",
        },
      });
      return sendJsonError(res, 400, "Password must be at least 8 characters");
    }

    const tokenHash = hashResetToken(token);
    const resetToken = await storage.getPasswordResetToken(tokenHash);

    const expiresAtTime = new Date(resetToken?.expiresAt ?? 0).getTime();

    if (!resetToken || resetToken.usedAt || Number.isNaN(expiresAtTime) || expiresAtTime < Date.now()) {
      await recordAuditEvent(req, {
        category: "authentication",
        action: "auth.password_reset.complete",
        outcome: "failure",
        severity: "warning",
        targetType: "password_reset_token",
        entityTable: "password_reset_tokens",
        statusCode: 400,
        metadata: {
          reason: "invalid_or_expired_token",
        },
      });
      return sendJsonError(res, 400, "This reset link is invalid or has expired");
    }

    const passwordHash = await hashPassword(password);
    await storage.updateUserPassword(resetToken.userId, passwordHash);
    await storage.deletePasswordResetToken(tokenHash);

    await recordAuditEvent(req, {
      category: "authentication",
      action: "auth.password_reset.complete",
      outcome: "success",
      targetType: "user",
      targetId: resetToken.userId,
      entityTable: "users",
      statusCode: 200,
      metadata: {
        resetTokenDeleted: true,
      },
    });

    return res.json({ message: "Password has been reset successfully." });
  });
}
