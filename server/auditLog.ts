import { createHash, randomUUID } from "crypto";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { pool } from "./storage";

export type AuditOutcome = "success" | "failure";
export type AuditSeverity = "info" | "warning" | "critical";

export type AuditEventInput = {
  category: string;
  action: string;
  outcome?: AuditOutcome;
  severity?: AuditSeverity;
  actorUserId?: string | number | null;
  actorRole?: string | null;
  actorEmail?: string | null;
  targetType?: string | null;
  targetId?: string | number | null;
  targetLabel?: string | null;
  entityTable?: string | null;
  statusCode?: number | null;
  before?: unknown;
  after?: unknown;
  metadata?: Record<string, unknown>;
};

type AuditRequestContext = {
  requestId: string;
  startedAt: Date;
};

type RequestWithAuditContext = Request & {
  auditContext?: AuditRequestContext;
  sessionID?: string;
  session?: {
    user?: {
      id?: string;
      email?: string;
      role?: string;
    };
  };
};

let auditLogsTableReady: Promise<void> | null = null;

export function ensureAuditLogsTable() {
  if (!auditLogsTableReady) {
    auditLogsTableReady = pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id varchar PRIMARY KEY,
        occurred_at timestamptz NOT NULL DEFAULT now(),
        category text NOT NULL,
        action text NOT NULL,
        outcome text NOT NULL DEFAULT 'success',
        severity text NOT NULL DEFAULT 'info',
        actor_user_id varchar NULL REFERENCES users(id) ON DELETE SET NULL,
        actor_role text NULL,
        actor_email_hash text NULL,
        target_type text NULL,
        target_id text NULL,
        target_label text NULL,
        entity_table text NULL,
        request_id text NULL,
        session_id_hash text NULL,
        ip_address_hash text NULL,
        user_agent_hash text NULL,
        http_method text NULL,
        route text NULL,
        status_code integer NULL,
        before_data jsonb NOT NULL DEFAULT '{}'::jsonb,
        after_data jsonb NOT NULL DEFAULT '{}'::jsonb,
        metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      ALTER TABLE audit_logs
        ADD COLUMN IF NOT EXISTS occurred_at timestamptz NOT NULL DEFAULT now(),
        ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'system',
        ADD COLUMN IF NOT EXISTS action text NOT NULL DEFAULT 'unknown',
        ADD COLUMN IF NOT EXISTS outcome text NOT NULL DEFAULT 'success',
        ADD COLUMN IF NOT EXISTS severity text NOT NULL DEFAULT 'info',
        ADD COLUMN IF NOT EXISTS actor_user_id varchar NULL REFERENCES users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS actor_role text NULL,
        ADD COLUMN IF NOT EXISTS actor_email_hash text NULL,
        ADD COLUMN IF NOT EXISTS target_type text NULL,
        ADD COLUMN IF NOT EXISTS target_id text NULL,
        ADD COLUMN IF NOT EXISTS target_label text NULL,
        ADD COLUMN IF NOT EXISTS entity_table text NULL,
        ADD COLUMN IF NOT EXISTS request_id text NULL,
        ADD COLUMN IF NOT EXISTS session_id_hash text NULL,
        ADD COLUMN IF NOT EXISTS ip_address_hash text NULL,
        ADD COLUMN IF NOT EXISTS user_agent_hash text NULL,
        ADD COLUMN IF NOT EXISTS http_method text NULL,
        ADD COLUMN IF NOT EXISTS route text NULL,
        ADD COLUMN IF NOT EXISTS status_code integer NULL,
        ADD COLUMN IF NOT EXISTS before_data jsonb NOT NULL DEFAULT '{}'::jsonb,
        ADD COLUMN IF NOT EXISTS after_data jsonb NOT NULL DEFAULT '{}'::jsonb,
        ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
        ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'audit_logs_outcome_check'
        ) THEN
          ALTER TABLE audit_logs
            ADD CONSTRAINT audit_logs_outcome_check
            CHECK (outcome IN ('success', 'failure'));
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'audit_logs_severity_check'
        ) THEN
          ALTER TABLE audit_logs
            ADD CONSTRAINT audit_logs_severity_check
            CHECK (severity IN ('info', 'warning', 'critical'));
        END IF;
      END $$;

      CREATE INDEX IF NOT EXISTS audit_logs_occurred_at_idx
        ON audit_logs(occurred_at);

      CREATE INDEX IF NOT EXISTS audit_logs_actor_user_id_idx
        ON audit_logs(actor_user_id);

      CREATE INDEX IF NOT EXISTS audit_logs_action_idx
        ON audit_logs(action);

      CREATE INDEX IF NOT EXISTS audit_logs_category_idx
        ON audit_logs(category);

      CREATE INDEX IF NOT EXISTS audit_logs_target_idx
        ON audit_logs(target_type, target_id);

      CREATE INDEX IF NOT EXISTS audit_logs_request_id_idx
        ON audit_logs(request_id);
    `).then(() => undefined);
  }

  return auditLogsTableReady;
}

export const auditRequestContext: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  const request = req as RequestWithAuditContext;
  const incomingRequestId = req.get("x-request-id")?.trim();

  request.auditContext = {
    requestId: incomingRequestId || randomUUID(),
    startedAt: new Date(),
  };

  next();
};

function hashValue(value?: string | null) {
  if (!value) {
    return null;
  }

  return createHash("sha256").update(value).digest("hex");
}

function getIpAddress(req: Request) {
  const forwardedFor = req.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || req.ip || req.socket.remoteAddress || null;
}

function isSensitiveKey(key: string) {
  return /password|passwordHash|token|tokenHash|secret|authorization|cookie|photoDataUrl|base64|rawBody/i.test(key);
}

function sanitizeAuditPayload(value: unknown): unknown {
  if (value === null || value === undefined) {
    return {};
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeAuditPayload(item));
  }

  if (typeof value === "object") {
    const cleaned: Record<string, unknown> = {};

    for (const [key, itemValue] of Object.entries(value as Record<string, unknown>)) {
      if (isSensitiveKey(key)) {
        cleaned[key] = "[REDACTED]";
        continue;
      }

      cleaned[key] = sanitizeAuditPayload(itemValue);
    }

    return cleaned;
  }

  return value;
}

function getAuthenticatedActor(req: RequestWithAuditContext) {
  const actor = req.session?.user;

  if (!actor?.id) {
    return {
      actorUserId: null,
      actorRole: null,
      actorEmailHash: null,
    };
  }

  return {
    actorUserId: actor.id,
    actorRole: actor.role || null,
    actorEmailHash: hashValue(actor.email?.trim().toLowerCase()),
  };
}

export function hashAuditIdentifier(value?: string | null) {
  return hashValue(value?.trim().toLowerCase() || null);
}

export async function recordAuditEvent(req: Request, input: AuditEventInput) {
  try {
    await ensureAuditLogsTable();

    const request = req as RequestWithAuditContext;
    const authenticatedActor = getAuthenticatedActor(request);
    const actorEmailHash = input.actorEmail
      ? hashValue(input.actorEmail.trim().toLowerCase())
      : authenticatedActor.actorEmailHash;

    await pool.query(
      `INSERT INTO audit_logs (
        id,
        category,
        action,
        outcome,
        severity,
        actor_user_id,
        actor_role,
        actor_email_hash,
        target_type,
        target_id,
        target_label,
        entity_table,
        request_id,
        session_id_hash,
        ip_address_hash,
        user_agent_hash,
        http_method,
        route,
        status_code,
        before_data,
        after_data,
        metadata
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19, $20::jsonb, $21::jsonb, $22::jsonb
      )`,
      [
        randomUUID(),
        input.category,
        input.action,
        input.outcome || "success",
        input.severity || (input.outcome === "failure" ? "warning" : "info"),
        input.actorUserId !== undefined
          ? input.actorUserId === null
            ? null
            : String(input.actorUserId)
          : authenticatedActor.actorUserId,
        input.actorRole !== undefined ? input.actorRole : authenticatedActor.actorRole,
        actorEmailHash,
        input.targetType || null,
        input.targetId !== undefined && input.targetId !== null ? String(input.targetId) : null,
        input.targetLabel || null,
        input.entityTable || null,
        request.auditContext?.requestId || null,
        hashValue(request.sessionID || null),
        hashValue(getIpAddress(req)),
        hashValue(req.get("user-agent") || null),
        req.method,
        req.originalUrl || req.path,
        input.statusCode ?? null,
        JSON.stringify(sanitizeAuditPayload(input.before)),
        JSON.stringify(sanitizeAuditPayload(input.after)),
        JSON.stringify(sanitizeAuditPayload(input.metadata || {})),
      ],
    );
  } catch (error) {
    console.error("Audit log write failed:", error);
  }
}

export async function listAuditLogs(limit = 100) {
  await ensureAuditLogsTable();

  const safeLimit = Math.min(Math.max(Number.isFinite(limit) ? Math.trunc(limit) : 100, 1), 500);
  const result = await pool.query(
    `SELECT
      id,
      occurred_at AS "occurredAt",
      category,
      action,
      outcome,
      severity,
      actor_user_id AS "actorUserId",
      actor_role AS "actorRole",
      actor_email_hash AS "actorEmailHash",
      target_type AS "targetType",
      target_id AS "targetId",
      target_label AS "targetLabel",
      entity_table AS "entityTable",
      request_id AS "requestId",
      session_id_hash AS "sessionIdHash",
      ip_address_hash AS "ipAddressHash",
      user_agent_hash AS "userAgentHash",
      http_method AS "httpMethod",
      route,
      status_code AS "statusCode",
      before_data AS "before",
      after_data AS "after",
      metadata,
      created_at AS "createdAt"
    FROM audit_logs
    ORDER BY occurred_at DESC
    LIMIT $1`,
    [safeLimit],
  );

  return result.rows;
}

export function getAuditErrorMetadata(error: unknown) {
  const status = typeof error === "object" && error && "status" in error
    ? Number((error as { status?: unknown }).status)
    : typeof error === "object" && error && "statusCode" in error
      ? Number((error as { statusCode?: unknown }).statusCode)
      : 500;

  return {
    statusCode: Number.isFinite(status) ? status : 500,
    message: error instanceof Error ? error.message : "Unknown error",
  };
}
