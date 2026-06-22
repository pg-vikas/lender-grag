import "./env";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";
import { passwordResetTokens, users, type InsertUser, type PasswordResetToken, type User } from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool);
export { pool };

let passwordResetTableReady: Promise<void> | null = null;

function ensurePasswordResetTable() {
  if (!passwordResetTableReady) {
    passwordResetTableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id varchar PRIMARY KEY,
        user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash text NOT NULL UNIQUE,
        expires_at timestamptz NOT NULL,
        used_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx
        ON password_reset_tokens(user_id);

      CREATE INDEX IF NOT EXISTS password_reset_tokens_expires_at_idx
        ON password_reset_tokens(expires_at);
    `).then(() => undefined);
  }

  return passwordResetTableReady;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPasswordResetToken(data: {
    userId: string | number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;
  getPasswordResetToken(tokenHash: string): Promise<PasswordResetToken | undefined>;
  deletePasswordResetToken(tokenHash: string): Promise<void>;
  deletePasswordResetTokensForUser(userId: string | number): Promise<void>;
  updateUserPassword(userId: string | number, passwordHash: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const normalizedEmail = email.trim().toLowerCase();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        ...insertUser,
        email: insertUser.email.trim().toLowerCase(),
      })
      .returning();

    return user;
  }

  async createPasswordResetToken(data: {
    userId: string | number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    await ensurePasswordResetTable();

    await db.insert(passwordResetTokens).values({
      id: randomUUID(),
      userId: String(data.userId),
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
    });
  }

  async getPasswordResetToken(tokenHash: string): Promise<PasswordResetToken | undefined> {
    await ensurePasswordResetTable();

    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.tokenHash, tokenHash))
      .limit(1);

    return resetToken;
  }

  async deletePasswordResetToken(tokenHash: string): Promise<void> {
    await ensurePasswordResetTable();
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.tokenHash, tokenHash));
  }

  async deletePasswordResetTokensForUser(userId: string | number): Promise<void> {
    await ensurePasswordResetTable();
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, String(userId)));
  }

  async updateUserPassword(userId: string | number, passwordHash: string): Promise<void> {
    await db.update(users).set({ passwordHash }).where(eq(users.id, String(userId)));
  }
}

export const storage = new DatabaseStorage();
