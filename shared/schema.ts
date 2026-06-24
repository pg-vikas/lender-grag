import { sql } from "drizzle-orm";
import { boolean, index, integer, json, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
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

export const userSessions = pgTable(
  "user_sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire", { precision: 6 }).notNull(),
  },
  (table) => ({
    expireIdx: index("IDX_session_expire").on(table.expire),
  }),
);

export const clientProfiles = pgTable("client_profiles", {
  userId: varchar("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  industry: text("industry").notNull().default("Mortgage Client"),
  status: text("status").notNull().default("Brand New"),
  assignedTo: text("assigned_to").notNull().default("Greg Wynn"),
  revenue: text("revenue").notNull().default("$0.00"),
  billing: text("billing").notNull().default("---"),
  compliance: boolean("compliance").notNull().default(false),
  photoUrl: text("photo_url").notNull().default(""),
  background: text("background").notNull().default(""),
  currentAddress: text("current_address").notNull().default(""),
  loanPurpose: text("loan_purpose").notNull().default("Purchase"),
  propertyType: text("property_type").notNull().default("Single Family"),
  estimatedValue: text("estimated_value").notNull().default(""),
  downPayment: text("down_payment").notNull().default(""),
  targetLoanAmount: text("target_loan_amount").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const loanApplications = pgTable("loan_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientUserId: varchar("client_user_id").references(() => users.id, { onDelete: "set null" }),
  applicantName: text("applicant_name").notNull(),
  applicantEmail: text("applicant_email").notNull(),
  applicantPhone: text("applicant_phone").notNull().default(""),
  loanType: text("loan_type").notNull().default(""),
  loanPurpose: text("loan_purpose").notNull().default(""),
  homePrice: text("home_price").notNull().default(""),
  requestedAmount: text("requested_amount").notNull().default(""),
  propertyType: text("property_type").notNull().default(""),
  applicationStatus: text("application_status").notNull().default("new"),
  source: text("source").notNull().default("website"),
  ipAddressHash: text("ip_address_hash"),
  userAgentHash: text("user_agent_hash"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const loanApplicationSensitiveData = pgTable("loan_application_sensitive_data", {
  applicationId: varchar("application_id")
    .primaryKey()
    .references(() => loanApplications.id, { onDelete: "cascade" }),
  encryptedPayload: text("encrypted_payload").notNull().default(""),
  payloadHash: text("payload_hash"),
  encryptionKeyVersion: text("encryption_key_version").notNull().default("v1"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const loanApplicationAuditEvents = pgTable("loan_application_audit_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id")
    .notNull()
    .references(() => loanApplications.id, { onDelete: "cascade" }),
  actorUserId: varchar("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    category: text("category").notNull(),
    action: text("action").notNull(),
    outcome: text("outcome").notNull().default("success"),
    severity: text("severity").notNull().default("info"),
    actorUserId: varchar("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    actorRole: text("actor_role"),
    actorEmailHash: text("actor_email_hash"),
    targetType: text("target_type"),
    targetId: text("target_id"),
    targetLabel: text("target_label"),
    entityTable: text("entity_table"),
    requestId: text("request_id"),
    sessionIdHash: text("session_id_hash"),
    ipAddressHash: text("ip_address_hash"),
    userAgentHash: text("user_agent_hash"),
    httpMethod: text("http_method"),
    route: text("route"),
    statusCode: integer("status_code"),
    before: jsonb("before_data").notNull().default(sql`'{}'::jsonb`),
    after: jsonb("after_data").notNull().default(sql`'{}'::jsonb`),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    occurredAtIdx: index("audit_logs_occurred_at_idx").on(table.occurredAt),
    actorIdx: index("audit_logs_actor_user_id_idx").on(table.actorUserId),
    actionIdx: index("audit_logs_action_idx").on(table.action),
    categoryIdx: index("audit_logs_category_idx").on(table.category),
    targetIdx: index("audit_logs_target_idx").on(table.targetType, table.targetId),
    requestIdx: index("audit_logs_request_id_idx").on(table.requestId),
  }),
);

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  fullName: true,
  phone: true,
  role: true,
  passwordHash: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ClientProfile = typeof clientProfiles.$inferSelect;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type LoanApplicationSensitiveData = typeof loanApplicationSensitiveData.$inferSelect;
export type LoanApplicationAuditEvent = typeof loanApplicationAuditEvents.$inferSelect;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;

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

export const adminClientStatusSchema = z.enum([
  "Active",
  "Brand New",
  "Lead",
  "Nurture",
  "Suspended",
  "Hot",
  "Inactive",
], {
  errorMap: () => ({ message: "Please choose a valid client status" }),
});

const adminClientPhoneSchema = z
  .string()
  .trim()
  .refine((value) => {
    const digits = value.replace(/\D/g, "");
    const normalizedDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

    return normalizedDigits.length === 10;
  }, "Please enter a valid 10-digit phone number");

export const adminClientUpdateSchema = z.object({
  name: z.string().trim().min(2, "Please enter the client name").optional(),
  email: z.string().trim().email("Please enter a valid email address").optional(),
  phone: adminClientPhoneSchema.optional(),
  industry: z.string().trim().min(1, "Industry is required").max(120, "Industry is too long").optional(),
  status: adminClientStatusSchema.optional(),
  assigned: z.string().trim().max(120, "Assigned user is too long").optional(),
  revenue: z.string().trim().max(80, "Revenue is too long").optional(),
  billing: z.string().trim().max(80, "Billing is too long").optional(),
  compliance: z.boolean().optional(),
  photoDataUrl: z.string().trim().max(4_500_000, "Client photo must be 3 MB or less").optional(),
  removePhoto: z.boolean().optional(),
  background: z.string().trim().max(5000, "Background must be 5,000 characters or less").optional(),
  currentAddress: z.string().trim().max(250, "Current address is too long").optional(),
  loanPurpose: z.string().trim().max(120, "Loan purpose is too long").optional(),
  propertyType: z.string().trim().max(120, "Property type is too long").optional(),
  estimatedValue: z.string().trim().max(80, "Estimated value is too long").optional(),
  downPayment: z.string().trim().max(80, "Down payment is too long").optional(),
  targetLoanAmount: z.string().trim().max(80, "Target loan amount is too long").optional(),
}).refine((value) => Object.keys(value).length > 0, "No client fields were provided");

export const adminClientPasswordUpdateSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  sendPasswordEmail: z.boolean().optional().default(false),
});

export const adminClientCreateSchema = z.object({
  name: z.string().trim().min(2, "Please enter the client name"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: adminClientPhoneSchema,
  password: z.string().min(8, "Password must be at least 8 characters"),
  sendWelcomeEmail: z.boolean().optional().default(false),
  industry: z.string().trim().min(1, "Industry is required").max(120, "Industry is too long").optional().default("Mortgage Client"),
  status: adminClientStatusSchema.optional().default("Brand New"),
  assigned: z.string().trim().max(120, "Assigned user is too long").optional().default("Greg Wynn"),
  revenue: z.string().trim().max(80, "Revenue is too long").optional().default("$0.00"),
  billing: z.string().trim().max(80, "Billing is too long").optional().default("---"),
  compliance: z.boolean().optional().default(false),
  photoDataUrl: z.string().trim().max(4_500_000, "Client photo must be 3 MB or less").optional(),
  background: z.string().trim().max(5000, "Background must be 5,000 characters or less").optional().default(""),
  currentAddress: z.string().trim().max(250, "Current address is too long").optional().default(""),
  loanPurpose: z.string().trim().max(120, "Loan purpose is too long").optional().default("Purchase"),
  propertyType: z.string().trim().max(120, "Property type is too long").optional().default("Single Family"),
  estimatedValue: z.string().trim().max(80, "Estimated value is too long").optional().default(""),
  downPayment: z.string().trim().max(80, "Down payment is too long").optional().default(""),
  targetLoanAmount: z.string().trim().max(80, "Target loan amount is too long").optional().default(""),
});

export type AdminClientStatus = z.infer<typeof adminClientStatusSchema>;
export type AdminClientUpdateInput = z.infer<typeof adminClientUpdateSchema>;
export type AdminClientCreateInput = z.infer<typeof adminClientCreateSchema>;
export type AdminClientPasswordUpdateInput = z.infer<typeof adminClientPasswordUpdateSchema>;
export type SessionUser = z.infer<typeof sessionUserSchema>;
