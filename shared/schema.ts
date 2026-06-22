import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleSchema = z.enum(["admin", "client"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull().default(""),
  role: text("role").notNull().default("client"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  fullName: true,
  phone: true,
  role: true,
  passwordHash: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

const optionalTrimmedString = z.string().trim().optional().default("");

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: optionalTrimmedString,
  message: z.string().trim().min(10, "Message is required"),
});

export const applyFormSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(7, "Phone is required"),
  loanType: z.string().trim().min(1, "Loan type is required"),
  homePrice: optionalTrimmedString,
});

export type ContactFormSubmission = z.infer<typeof contactFormSchema>;
export type ApplyFormSubmission = z.infer<typeof applyFormSchema>;

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z
    .string()
    .trim()
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      const normalizedDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

      return normalizedDigits.length === 10;
    }, "Please enter a valid 10-digit phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  phone: z.string(),
  role: userRoleSchema,
  joined: z.string(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
