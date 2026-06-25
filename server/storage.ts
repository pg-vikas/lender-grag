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
  type AdminLoanRecordCreateInput,
  type AdminLoanRecordUpdateInput,
  type ApplyFormSubmission,
  type InsertUser,
  type LoanRecord,
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
let loanRecordsTableReady: Promise<void> | null = null;

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
    clientProfilesTableReady = ensureLoanRecordsTable().then(() => pool.query(`
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
    `).then(() => undefined));
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

function ensureLoanRecordsTable() {
  if (!loanRecordsTableReady) {
    loanRecordsTableReady = pool.query(`
      CREATE SEQUENCE IF NOT EXISTS loan_number_seq START WITH 10001 INCREMENT BY 1 NO MAXVALUE;

      CREATE TABLE IF NOT EXISTS loan_records (
        id varchar PRIMARY KEY,
        client_user_id varchar NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        loan_number text NOT NULL UNIQUE,
        stage text NOT NULL DEFAULT 'application',
        loan_type text NOT NULL DEFAULT '',
        loan_purpose text NOT NULL DEFAULT 'Purchase',
        loan_amount text NOT NULL DEFAULT '',
        property_type text NOT NULL DEFAULT '',
        property_address text NOT NULL DEFAULT '',
        ltv text NOT NULL DEFAULT '',
        interest_rate text NOT NULL DEFAULT '',
        rate_type text NOT NULL DEFAULT '',
        rate_lock_expires_at timestamptz NULL,
        application_submitted_at timestamptz NOT NULL DEFAULT now(),
        documents_received_at timestamptz NULL,
        processing_started_at timestamptz NULL,
        underwriting_started_at timestamptz NULL,
        conditional_approval_at timestamptz NULL,
        clear_to_close_at timestamptz NULL,
        funded_at timestamptz NULL,
        assigned_to text NOT NULL DEFAULT 'Greg Wynn',
        source text NOT NULL DEFAULT 'signup',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      ALTER TABLE loan_records
        ADD COLUMN IF NOT EXISTS fico_score text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS co_borrower_name text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS estimated_value text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS down_payment text NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS loan_status text NOT NULL DEFAULT 'active';

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'loan_records_stage_check'
        ) THEN
          ALTER TABLE loan_records
            ADD CONSTRAINT loan_records_stage_check
            CHECK (stage IN (
              'application',
              'processing',
              'underwriting',
              'conditional_approval',
              'clear_to_close',
              'funded'
            ));
        END IF;
      END $$;

      CREATE INDEX IF NOT EXISTS loan_records_client_user_id_idx ON loan_records(client_user_id);
      CREATE INDEX IF NOT EXISTS loan_records_stage_idx ON loan_records(stage);
      CREATE INDEX IF NOT EXISTS loan_records_created_at_idx ON loan_records(created_at DESC);
    `).then(() => undefined);
  }

  return loanRecordsTableReady;
}

const loanRecordSelectSql = `
  SELECT
    id,
    client_user_id AS "clientUserId",
    loan_number AS "loanNumber",
    stage,
    loan_type AS "loanType",
    loan_purpose AS "loanPurpose",
    loan_amount AS "loanAmount",
    property_type AS "propertyType",
    property_address AS "propertyAddress",
    ltv,
    estimated_value AS "estimatedValue",
    down_payment AS "downPayment",
    loan_status AS "loanStatus",
    fico_score AS "ficoScore",
    co_borrower_name AS "coBorrowerName",
    interest_rate AS "interestRate",
    rate_type AS "rateType",
    rate_lock_expires_at AS "rateLockExpiresAt",
    application_submitted_at AS "applicationSubmittedAt",
    documents_received_at AS "documentsReceivedAt",
    processing_started_at AS "processingStartedAt",
    underwriting_started_at AS "underwritingStartedAt",
    conditional_approval_at AS "conditionalApprovalAt",
    clear_to_close_at AS "clearToCloseAt",
    funded_at AS "fundedAt",
    assigned_to AS "assignedTo",
    source,
    created_at AS "createdAt",
    updated_at AS "updatedAt"
  FROM loan_records
`;

export type AdminLoanRecord = LoanRecord & {
  borrowerName: string;
  borrowerEmail: string;
  borrowerPhone: string;
};

const adminLoanRecordSelectSql = `
  SELECT
    lr.id,
    lr.client_user_id AS "clientUserId",
    lr.loan_number AS "loanNumber",
    lr.stage,
    lr.loan_type AS "loanType",
    lr.loan_purpose AS "loanPurpose",
    lr.loan_amount AS "loanAmount",
    lr.property_type AS "propertyType",
    lr.property_address AS "propertyAddress",
    lr.ltv,
    lr.estimated_value AS "estimatedValue",
    lr.down_payment AS "downPayment",
    lr.loan_status AS "loanStatus",
    lr.fico_score AS "ficoScore",
    lr.co_borrower_name AS "coBorrowerName",
    lr.interest_rate AS "interestRate",
    lr.rate_type AS "rateType",
    lr.rate_lock_expires_at AS "rateLockExpiresAt",
    lr.application_submitted_at AS "applicationSubmittedAt",
    lr.documents_received_at AS "documentsReceivedAt",
    lr.processing_started_at AS "processingStartedAt",
    lr.underwriting_started_at AS "underwritingStartedAt",
    lr.conditional_approval_at AS "conditionalApprovalAt",
    lr.clear_to_close_at AS "clearToCloseAt",
    lr.funded_at AS "fundedAt",
    lr.assigned_to AS "assignedTo",
    lr.source,
    lr.created_at AS "createdAt",
    lr.updated_at AS "updatedAt",
    u.full_name AS "borrowerName",
    u.email AS "borrowerEmail",
    u.phone AS "borrowerPhone"
  FROM loan_records lr
  JOIN users u ON u.id = lr.client_user_id
`;

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
    COALESCE(lr.loan_purpose, 'Purchase') AS "loanPurpose",
    COALESCE(lr.property_type, '') AS "propertyType",
    COALESCE(lr.estimated_value, '') AS "estimatedValue",
    COALESCE(lr.down_payment, '') AS "downPayment",
    COALESCE(lr.loan_amount, '') AS "targetLoanAmount"
  FROM users u
  LEFT JOIN client_profiles cp ON cp.user_id = u.id
  LEFT JOIN LATERAL (
    SELECT loan_purpose, property_type, estimated_value, down_payment, loan_amount
    FROM loan_records
    WHERE client_user_id = u.id
    ORDER BY created_at DESC
    LIMIT 1
  ) lr ON true
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
  listAdminUsers(): Promise<{ id: string; fullName: string; email: string }[]>;
  listClientUsers(): Promise<AdminClientUser[]>;
  getClientUser(id: string | number): Promise<AdminClientUser | undefined>;
  createClientUser(data: AdminClientCreateStorageInput): Promise<AdminClientUser>;
  updateClientUser(id: string | number, data: AdminClientUpdateInput): Promise<AdminClientUser | undefined>;
  deleteClientUser(id: string | number): Promise<AdminClientUser | undefined>;
  createDefaultLoanRecord(userId: string): Promise<void>;
  getLoanRecordForClient(userId: string): Promise<LoanRecord | undefined>;
  listLoanRecordsForAdmin(): Promise<AdminLoanRecord[]>;
  getLoanRecordById(id: string): Promise<AdminLoanRecord | undefined>;
  createLoanRecordForAdmin(data: AdminLoanRecordCreateInput): Promise<AdminLoanRecord>;
  updateLoanRecord(id: string, data: AdminLoanRecordUpdateInput): Promise<AdminLoanRecord | undefined>;
  deleteLoanRecord(id: string): Promise<AdminLoanRecord | undefined>;
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

  async listAdminUsers(): Promise<{ id: string; fullName: string; email: string }[]> {
    const result = await db
      .select({ id: users.id, fullName: users.fullName, email: users.email })
      .from(users)
      .where(eq(users.role, "admin"));
    return result;
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
           updated_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now())`,
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
        data.currentAddress !== undefined
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

  async createDefaultLoanRecord(userId: string): Promise<void> {
    await ensureLoanRecordsTable();
    const id = randomUUID();
    await pool.query(
      `INSERT INTO loan_records (id, client_user_id, loan_number, source)
       VALUES ($1, $2, nextval('loan_number_seq')::text, 'signup')`,
      [id, userId],
    );
  }

  async getLoanRecordForClient(userId: string): Promise<LoanRecord | undefined> {
    await ensureLoanRecordsTable();
    const result = await pool.query<LoanRecord>(
      `${loanRecordSelectSql}
       WHERE client_user_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId],
    );
    return result.rows[0];
  }

  async listLoanRecordsForAdmin(): Promise<AdminLoanRecord[]> {
    await ensureLoanRecordsTable();
    const result = await pool.query<AdminLoanRecord>(
      `${adminLoanRecordSelectSql}
       ORDER BY lr.created_at DESC`,
    );
    return result.rows;
  }

  async getLoanRecordById(id: string): Promise<AdminLoanRecord | undefined> {
    await ensureLoanRecordsTable();
    const result = await pool.query<AdminLoanRecord>(
      `${adminLoanRecordSelectSql}
       WHERE lr.id = $1
       LIMIT 1`,
      [id],
    );
    return result.rows[0];
  }

  async createLoanRecordForAdmin(data: AdminLoanRecordCreateInput): Promise<AdminLoanRecord> {
    await ensureLoanRecordsTable();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const userCheck = await client.query<{ id: string }>(
        "SELECT id FROM users WHERE id = $1 AND role = 'client' LIMIT 1",
        [data.clientUserId],
      );
      if (!userCheck.rows[0]) {
        const err = new Error("Client not found") as Error & { status?: number };
        err.status = 404;
        throw err;
      }

      const id = randomUUID();
      await client.query(
        `INSERT INTO loan_records (
           id, client_user_id, loan_number, stage,
           loan_type, loan_purpose, loan_amount, property_type, property_address,
           estimated_value, down_payment,
           loan_status,
           ltv, fico_score, co_borrower_name,
           interest_rate, rate_type, rate_lock_expires_at,
           assigned_to, source
         ) VALUES (
           $1, $2, nextval('loan_number_seq')::text, $3,
           $4, $5, $6, $7, $8,
           $9, $10,
           $11,
           $12, $13, $14,
           $15, $16, $17,
           $18, 'admin'
         )`,
        [
          id,
          data.clientUserId,
          data.stage ?? "application",
          data.loanType?.trim() ?? "",
          data.loanPurpose?.trim() ?? "Purchase",
          data.loanAmount?.trim() ?? "",
          data.propertyType?.trim() ?? "",
          data.propertyAddress?.trim() ?? "",
          data.estimatedValue?.trim() ?? "",
          data.downPayment?.trim() ?? "",
          data.loanStatus ?? "active",
          data.ltv?.trim() ?? "",
          data.ficoScore?.trim() ?? "",
          data.coBorrowerName?.trim() ?? "",
          data.interestRate?.trim() ?? "",
          data.rateType?.trim() ?? "",
          data.rateLockExpiresAt ?? null,
          data.assignedTo?.trim() ?? "Greg Wynn",
        ],
      );

      const created = await client.query<AdminLoanRecord>(
        `${adminLoanRecordSelectSql} WHERE lr.id = $1 LIMIT 1`,
        [id],
      );
      await client.query("COMMIT");
      return created.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateLoanRecord(id: string, data: AdminLoanRecordUpdateInput): Promise<AdminLoanRecord | undefined> {
    await ensureLoanRecordsTable();

    const existing = await pool.query<{ id: string; stage: string }>(
      "SELECT id, stage FROM loan_records WHERE id = $1 LIMIT 1",
      [id],
    );
    if (!existing.rows[0]) return undefined;

    const prevStage = existing.rows[0].stage;
    const newStage = data.stage;

    // Build dynamic SET clause
    const sets: string[] = ["updated_at = now()"];
    const params: unknown[] = [id];
    let idx = 2;

    const addField = (col: string, val: unknown) => {
      sets.push(`${col} = $${idx++}`);
      params.push(val);
    };

    if (data.stage !== undefined) addField("stage", data.stage);
    if (data.coBorrowerName !== undefined) addField("co_borrower_name", data.coBorrowerName.trim());
    if (data.loanType !== undefined) addField("loan_type", data.loanType.trim());
    if (data.loanPurpose !== undefined) addField("loan_purpose", data.loanPurpose.trim());
    if (data.loanAmount !== undefined) addField("loan_amount", data.loanAmount.trim());
    if (data.propertyType !== undefined) addField("property_type", data.propertyType.trim());
    if (data.estimatedValue !== undefined) addField("estimated_value", data.estimatedValue.trim());
    if (data.downPayment !== undefined) addField("down_payment", data.downPayment.trim());
    if (data.loanStatus !== undefined) addField("loan_status", data.loanStatus);
    if (data.propertyAddress !== undefined) addField("property_address", data.propertyAddress.trim());
    if (data.ltv !== undefined) addField("ltv", data.ltv.trim());
    if (data.ficoScore !== undefined) addField("fico_score", data.ficoScore.trim());
    if (data.interestRate !== undefined) addField("interest_rate", data.interestRate.trim());
    if (data.rateType !== undefined) addField("rate_type", data.rateType.trim());
    if ("rateLockExpiresAt" in data) addField("rate_lock_expires_at", data.rateLockExpiresAt ?? null);
    if (data.assignedTo !== undefined) addField("assigned_to", data.assignedTo.trim());

    // SOC2: set stage transition timestamps once, never overwrite
    if (newStage && newStage !== prevStage) {
      const stageTimestampMap: Record<string, string> = {
        processing: "processing_started_at",
        underwriting: "underwriting_started_at",
        conditional_approval: "conditional_approval_at",
        clear_to_close: "clear_to_close_at",
        funded: "funded_at",
      };
      const tsCol = stageTimestampMap[newStage];
      if (tsCol) {
        sets.push(`${tsCol} = COALESCE(${tsCol}, now())`);
      }
      if (newStage === "processing") {
        sets.push("documents_received_at = COALESCE(documents_received_at, now())");
      }
    }

    await pool.query(
      `UPDATE loan_records SET ${sets.join(", ")} WHERE id = $1`,
      params,
    );

    return this.getLoanRecordById(id);
  }

  async deleteLoanRecord(id: string): Promise<AdminLoanRecord | undefined> {
    await ensureLoanRecordsTable();
    const record = await this.getLoanRecordById(id);
    if (!record) return undefined;
    await pool.query("DELETE FROM loan_records WHERE id = $1", [id]);
    return record;
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
