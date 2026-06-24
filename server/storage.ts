import "./env";
import { createHash, randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";
import { deleteClientPhotoFile, saveClientPhotoFromDataUrl } from "./clientPhotos";
import {
  passwordResetTokens,
  users,
  type AdminClientCreateInput,
  type AdminClientUpdateInput,
  type ApplyFormSubmission,
  type InsertUser,
  type PasswordResetToken,
  type User,
} from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool);
export { pool };

export type AdminClientCreateStorageInput = Omit<AdminClientCreateInput, "password" | "sendWelcomeEmail"> & {
  passwordHash: string;
};

export type AdminClientUser = User & {
  industry: string;
  status: string;
  assigned: string;
  revenue: string;
  billing: string;
  compliance: boolean;
  photoUrl: string;
  background: string;
  currentAddress: string;
  loanPurpose: string;
  propertyType: string;
  estimatedValue: string;
  downPayment: string;
  targetLoanAmount: string;
};

let passwordResetTableReady: Promise<void> | null = null;
let clientProfilesTableReady: Promise<void> | null = null;
let loanApplicationTablesReady: Promise<void> | null = null;

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

function ensureClientProfilesTable() {
  if (!clientProfilesTableReady) {
    clientProfilesTableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS client_profiles (
        user_id varchar PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        industry text NOT NULL DEFAULT 'Mortgage Client',
        status text NOT NULL DEFAULT 'Brand New',
        assigned_to text NOT NULL DEFAULT 'Greg Wynn',
        revenue text NOT NULL DEFAULT '$0.00',
        billing text NOT NULL DEFAULT '---',
        compliance boolean NOT NULL DEFAULT false,
        photo_url text NOT NULL DEFAULT '',
        background text NOT NULL DEFAULT '',
        current_address text NOT NULL DEFAULT '',
        loan_purpose text NOT NULL DEFAULT 'Purchase',
        property_type text NOT NULL DEFAULT 'Single Family',
        estimated_value text NOT NULL DEFAULT '',
        down_payment text NOT NULL DEFAULT '',
        target_loan_amount text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      ALTER TABLE client_profiles
        ADD COLUMN IF NOT EXISTS photo_url text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS background text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS current_address text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS loan_purpose text NOT NULL DEFAULT 'Purchase',
        ADD COLUMN IF NOT EXISTS property_type text NOT NULL DEFAULT 'Single Family',
        ADD COLUMN IF NOT EXISTS estimated_value text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS down_payment text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS target_loan_amount text NOT NULL DEFAULT '';

      UPDATE client_profiles
      SET status = 'Brand New'
      WHERE status NOT IN ('Active', 'Brand New', 'Lead', 'Nurture', 'Suspended', 'Hot', 'Inactive');

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'client_profiles_status_check'
        ) THEN
          ALTER TABLE client_profiles
            ADD CONSTRAINT client_profiles_status_check
            CHECK (status IN ('Active', 'Brand New', 'Lead', 'Nurture', 'Suspended', 'Hot', 'Inactive'));
        END IF;
      END $$;

      CREATE INDEX IF NOT EXISTS client_profiles_status_idx
        ON client_profiles(status);

      CREATE INDEX IF NOT EXISTS client_profiles_updated_at_idx
        ON client_profiles(updated_at DESC);
    `).then(() => undefined);
  }

  return clientProfilesTableReady;
}

function ensureLoanApplicationTables() {
  if (!loanApplicationTablesReady) {
    loanApplicationTablesReady = pool.query(`
      CREATE TABLE IF NOT EXISTS loan_applications (
        id varchar PRIMARY KEY,
        client_user_id varchar NULL REFERENCES users(id) ON DELETE SET NULL,
        applicant_name text NOT NULL,
        applicant_email text NOT NULL,
        applicant_phone text NOT NULL DEFAULT '',
        loan_type text NOT NULL DEFAULT '',
        loan_purpose text NOT NULL DEFAULT '',
        home_price text NOT NULL DEFAULT '',
        requested_amount text NOT NULL DEFAULT '',
        property_type text NOT NULL DEFAULT '',
        application_status text NOT NULL DEFAULT 'new',
        source text NOT NULL DEFAULT 'website',
        ip_address_hash text NULL,
        user_agent_hash text NULL,
        submitted_at timestamptz NOT NULL DEFAULT now(),
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS loan_application_sensitive_data (
        application_id varchar PRIMARY KEY REFERENCES loan_applications(id) ON DELETE CASCADE,
        encrypted_payload text NOT NULL DEFAULT '',
        payload_hash text NULL,
        encryption_key_version text NOT NULL DEFAULT 'v1',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS loan_application_audit_events (
        id varchar PRIMARY KEY,
        application_id varchar NOT NULL REFERENCES loan_applications(id) ON DELETE CASCADE,
        actor_user_id varchar NULL REFERENCES users(id) ON DELETE SET NULL,
        action text NOT NULL,
        metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      UPDATE loan_applications
      SET application_status = 'new'
      WHERE application_status NOT IN ('new', 'in_review', 'needs_docs', 'pre_approved', 'approved', 'declined', 'withdrawn');

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'loan_applications_status_check'
        ) THEN
          ALTER TABLE loan_applications
            ADD CONSTRAINT loan_applications_status_check
            CHECK (application_status IN ('new', 'in_review', 'needs_docs', 'pre_approved', 'approved', 'declined', 'withdrawn'));
        END IF;
      END $$;

      CREATE INDEX IF NOT EXISTS loan_applications_client_user_id_idx
        ON loan_applications(client_user_id);

      CREATE INDEX IF NOT EXISTS loan_applications_applicant_email_idx
        ON loan_applications(lower(applicant_email));

      CREATE INDEX IF NOT EXISTS loan_applications_status_idx
        ON loan_applications(application_status);

      CREATE INDEX IF NOT EXISTS loan_applications_submitted_at_idx
        ON loan_applications(submitted_at DESC);

      CREATE INDEX IF NOT EXISTS loan_application_audit_events_application_id_idx
        ON loan_application_audit_events(application_id, created_at DESC);
    `).then(() => undefined);
  }

  return loanApplicationTablesReady;
}

const clientSelectSql = `
  SELECT
    u.id,
    u.email,
    u.full_name AS "fullName",
    u.phone,
    u.role,
    u.password_hash AS "passwordHash",
    u.created_at AS "createdAt",
    COALESCE(cp.industry, 'Mortgage Client') AS industry,
    COALESCE(cp.status, 'Brand New') AS status,
    COALESCE(cp.assigned_to, 'Greg Wynn') AS assigned,
    COALESCE(cp.revenue, '$0.00') AS revenue,
    COALESCE(cp.billing, '---') AS billing,
    COALESCE(cp.compliance, false) AS compliance,
    COALESCE(cp.photo_url, '') AS "photoUrl",
    COALESCE(cp.background, '') AS background,
    COALESCE(cp.current_address, '') AS "currentAddress",
    COALESCE(cp.loan_purpose, 'Purchase') AS "loanPurpose",
    COALESCE(cp.property_type, 'Single Family') AS "propertyType",
    COALESCE(cp.estimated_value, '') AS "estimatedValue",
    COALESCE(cp.down_payment, '') AS "downPayment",
    COALESCE(cp.target_loan_amount, '') AS "targetLoanAmount"
  FROM users u
  LEFT JOIN client_profiles cp ON cp.user_id = u.id
`;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashOptional(value?: string | null) {
  if (!value) {
    return null;
  }

  return createHash("sha256").update(value).digest("hex");
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  listClientUsers(): Promise<AdminClientUser[]>;
  getClientUser(id: string | number): Promise<AdminClientUser | undefined>;
  createClientUser(data: AdminClientCreateStorageInput): Promise<AdminClientUser>;
  updateClientUser(id: string | number, data: AdminClientUpdateInput): Promise<AdminClientUser | undefined>;
  deleteClientUser(id: string | number): Promise<AdminClientUser | undefined>;
  createLoanApplication(submission: ApplyFormSubmission, metadata?: { ipAddress?: string; userAgent?: string }): Promise<string>;
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
    const normalizedEmail = normalizeEmail(email);
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
        email: normalizeEmail(insertUser.email),
      })
      .returning();

    return user;
  }

  async listClientUsers(): Promise<AdminClientUser[]> {
    await ensureClientProfilesTable();

    const result = await pool.query<AdminClientUser>(`
      ${clientSelectSql}
      WHERE u.role = 'client'
      ORDER BY u.created_at DESC
    `);

    return result.rows;
  }

  async getClientUser(id: string | number): Promise<AdminClientUser | undefined> {
    await ensureClientProfilesTable();

    const result = await pool.query<AdminClientUser>(`
      ${clientSelectSql}
      WHERE u.id = $1 AND u.role = 'client'
      LIMIT 1
    `, [String(id)]);

    return result.rows[0];
  }

  async createClientUser(data: AdminClientCreateStorageInput): Promise<AdminClientUser> {
    await ensureClientProfilesTable();

    const client = await pool.connect();
    let createdPhotoUrl = "";

    try {
      await client.query("BEGIN");

      const duplicateEmail = await client.query<{ id: string }>(
        "SELECT id FROM users WHERE lower(email) = lower($1) LIMIT 1",
        [data.email],
      );

      if (duplicateEmail.rows[0]) {
        const error = new Error("An account with that email already exists") as Error & { status?: number };
        error.status = 409;
        throw error;
      }

      const userId = randomUUID();

      if (data.photoDataUrl) {
        createdPhotoUrl = await saveClientPhotoFromDataUrl(data.photoDataUrl);
      }

      await client.query(
        `INSERT INTO users (id, email, full_name, phone, role, password_hash)
         VALUES ($1, $2, $3, $4, 'client', $5)`,
        [
          userId,
          normalizeEmail(data.email),
          data.name.trim(),
          data.phone.trim(),
          data.passwordHash,
        ],
      );

      await client.query(
        `INSERT INTO client_profiles (
           user_id,
           industry,
           status,
           assigned_to,
           revenue,
           billing,
           compliance,
           photo_url,
           background,
           current_address,
           loan_purpose,
           property_type,
           estimated_value,
           down_payment,
           target_loan_amount,
           updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, now())`,
        [
          userId,
          data.industry.trim() || "Mortgage Client",
          data.status.trim() || "Brand New",
          data.assigned.trim() || "Greg Wynn",
          data.revenue.trim() || "$0.00",
          data.billing.trim() || "---",
          data.compliance,
          createdPhotoUrl,
          data.background.trim(),
          data.currentAddress.trim(),
          data.loanPurpose.trim() || "Purchase",
          data.propertyType.trim() || "Single Family",
          data.estimatedValue.trim(),
          data.downPayment.trim(),
          data.targetLoanAmount.trim(),
        ],
      );

      const created = await client.query<AdminClientUser>(`
        ${clientSelectSql}
        WHERE u.id = $1 AND u.role = 'client'
        LIMIT 1
      `, [userId]);

      await client.query("COMMIT");

      return created.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");

      if (createdPhotoUrl) {
        await deleteClientPhotoFile(createdPhotoUrl);
      }

      throw error;
    } finally {
      client.release();
    }
  }

  async updateClientUser(id: string | number, data: AdminClientUpdateInput): Promise<AdminClientUser | undefined> {
    await ensureClientProfilesTable();

    const client = await pool.connect();
    let createdPhotoUrl = "";

    try {
      await client.query("BEGIN");

      const existing = await client.query<{ id: string }>(
        "SELECT id FROM users WHERE id = $1 AND role = 'client' LIMIT 1",
        [String(id)],
      );

      if (!existing.rows[0]) {
        await client.query("ROLLBACK");
        return undefined;
      }

      if (data.email) {
        const duplicateEmail = await client.query<{ id: string }>(
          "SELECT id FROM users WHERE lower(email) = lower($1) AND id <> $2 LIMIT 1",
          [data.email, String(id)],
        );

        if (duplicateEmail.rows[0]) {
          const error = new Error("An account with that email already exists") as Error & { status?: number };
          error.status = 409;
          throw error;
        }
      }

      let previousPhotoUrl = "";
      let updatedPhotoUrl: string | null = null;

      if (data.photoDataUrl !== undefined || data.removePhoto !== undefined) {
        const existingProfile = await client.query<{ photoUrl: string }>(
          `SELECT COALESCE(photo_url, '') AS "photoUrl"
           FROM client_profiles
           WHERE user_id = $1
           LIMIT 1`,
          [String(id)],
        );

        previousPhotoUrl = existingProfile.rows[0]?.photoUrl || "";

        if (data.photoDataUrl) {
          updatedPhotoUrl = await saveClientPhotoFromDataUrl(data.photoDataUrl);
          createdPhotoUrl = updatedPhotoUrl;
        } else if (data.removePhoto) {
          updatedPhotoUrl = "";
        }
      }

      if (data.name !== undefined || data.email !== undefined || data.phone !== undefined) {
        await client.query(
          `UPDATE users
           SET
             full_name = COALESCE($2, full_name),
             email = COALESCE($3, email),
             phone = COALESCE($4, phone)
           WHERE id = $1 AND role = 'client'`,
          [
            String(id),
            data.name?.trim() || null,
            data.email ? normalizeEmail(data.email) : null,
            data.phone !== undefined ? data.phone.trim() : null,
          ],
        );
      }

      if (
        data.industry !== undefined ||
        data.status !== undefined ||
        data.assigned !== undefined ||
        data.revenue !== undefined ||
        data.billing !== undefined ||
        data.compliance !== undefined ||
        data.photoDataUrl !== undefined ||
        data.removePhoto !== undefined ||
        data.background !== undefined ||
        data.currentAddress !== undefined ||
        data.loanPurpose !== undefined ||
        data.propertyType !== undefined ||
        data.estimatedValue !== undefined ||
        data.downPayment !== undefined ||
        data.targetLoanAmount !== undefined
      ) {
        await client.query(
          `INSERT INTO client_profiles (
             user_id,
             industry,
             status,
             assigned_to,
             revenue,
             billing,
             compliance,
             photo_url,
             background,
             current_address,
             loan_purpose,
             property_type,
             estimated_value,
             down_payment,
             target_loan_amount,
             updated_at
           ) VALUES (
             $1,
             COALESCE($2, 'Mortgage Client'),
             COALESCE($3, 'Brand New'),
             COALESCE($4, 'Greg Wynn'),
             COALESCE($5, '$0.00'),
             COALESCE($6, '---'),
             COALESCE($7, false),
             COALESCE($8, ''),
             COALESCE($9, ''),
             COALESCE($10, ''),
             COALESCE($11, 'Purchase'),
             COALESCE($12, 'Single Family'),
             COALESCE($13, ''),
             COALESCE($14, ''),
             COALESCE($15, ''),
             now()
           )
           ON CONFLICT (user_id) DO UPDATE SET
             industry = COALESCE($2, client_profiles.industry),
             status = COALESCE($3, client_profiles.status),
             assigned_to = COALESCE($4, client_profiles.assigned_to),
             revenue = COALESCE($5, client_profiles.revenue),
             billing = COALESCE($6, client_profiles.billing),
             compliance = COALESCE($7, client_profiles.compliance),
             photo_url = COALESCE($8, client_profiles.photo_url),
             background = COALESCE($9, client_profiles.background),
             current_address = COALESCE($10, client_profiles.current_address),
             loan_purpose = COALESCE($11, client_profiles.loan_purpose),
             property_type = COALESCE($12, client_profiles.property_type),
             estimated_value = COALESCE($13, client_profiles.estimated_value),
             down_payment = COALESCE($14, client_profiles.down_payment),
             target_loan_amount = COALESCE($15, client_profiles.target_loan_amount),
             updated_at = now()`,
          [
            String(id),
            data.industry !== undefined ? data.industry.trim() : null,
            data.status !== undefined ? data.status.trim() : null,
            data.assigned !== undefined ? data.assigned.trim() : null,
            data.revenue !== undefined ? data.revenue.trim() : null,
            data.billing !== undefined ? data.billing.trim() : null,
            data.compliance ?? null,
            updatedPhotoUrl,
            data.background !== undefined ? data.background.trim() : null,
            data.currentAddress !== undefined ? data.currentAddress.trim() : null,
            data.loanPurpose !== undefined ? data.loanPurpose.trim() : null,
            data.propertyType !== undefined ? data.propertyType.trim() : null,
            data.estimatedValue !== undefined ? data.estimatedValue.trim() : null,
            data.downPayment !== undefined ? data.downPayment.trim() : null,
            data.targetLoanAmount !== undefined ? data.targetLoanAmount.trim() : null,
          ],
        );
      }

      const updated = await client.query<AdminClientUser>(`
        ${clientSelectSql}
        WHERE u.id = $1 AND u.role = 'client'
        LIMIT 1
      `, [String(id)]);

      await client.query("COMMIT");

      if (previousPhotoUrl && updatedPhotoUrl !== null && previousPhotoUrl !== updatedPhotoUrl) {
        void deleteClientPhotoFile(previousPhotoUrl);
      }

      return updated.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");

      if (createdPhotoUrl) {
        await deleteClientPhotoFile(createdPhotoUrl);
      }

      throw error;
    } finally {
      client.release();
    }
  }

  async deleteClientUser(id: string | number): Promise<AdminClientUser | undefined> {
    await ensureClientProfilesTable();

    const client = await pool.connect();
    let deletedClient: AdminClientUser | undefined;

    try {
      await client.query("BEGIN");

      const existing = await client.query<AdminClientUser>(`
        ${clientSelectSql}
        WHERE u.id = $1 AND u.role = 'client'
        LIMIT 1
      `, [String(id)]);

      deletedClient = existing.rows[0];
      if (!deletedClient) {
        await client.query("ROLLBACK");
        return undefined;
      }

      await client.query("DELETE FROM users WHERE id = $1 AND role = 'client'", [String(id)]);
      await client.query("COMMIT");

      if (deletedClient.photoUrl) {
        void deleteClientPhotoFile(deletedClient.photoUrl);
      }

      return deletedClient;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async createLoanApplication(
    submission: ApplyFormSubmission,
    metadata: { ipAddress?: string; userAgent?: string } = {},
  ): Promise<string> {
    await ensureLoanApplicationTables();

    const applicationId = randomUUID();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        `INSERT INTO loan_applications (
          id,
          applicant_name,
          applicant_email,
          applicant_phone,
          loan_type,
          loan_purpose,
          home_price,
          source,
          ip_address_hash,
          user_agent_hash
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'website', $8, $9)`,
        [
          applicationId,
          submission.name.trim(),
          normalizeEmail(submission.email),
          submission.phone.trim(),
          submission.loanType.trim(),
          submission.loanType.trim(),
          submission.homePrice.trim(),
          hashOptional(metadata.ipAddress),
          hashOptional(metadata.userAgent),
        ],
      );

      await client.query(
        `INSERT INTO loan_application_audit_events (id, application_id, action, metadata)
         VALUES ($1, $2, 'application_submitted', $3::jsonb)`,
        [
          randomUUID(),
          applicationId,
          JSON.stringify({ source: "website" }),
        ],
      );

      await client.query("COMMIT");
      return applicationId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
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
