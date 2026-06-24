import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  adminClientCreateSchema,
  adminClientPasswordUpdateSchema,
  adminClientUpdateSchema,
  applyFormSchema,
  contactFormSchema,
  type ApplyFormSubmission,
  type ContactFormSubmission,
} from "@shared/schema";
import { sendNotificationEmail } from "./mailer";
import { renderEmailTemplate, renderTextFields } from "./emailTemplates";
import { hashPassword, requireRole } from "./auth";
import { registerPasswordResetRoutes } from "./auth/passwordReset";
import { renderAdminClientWelcomeEmail } from "./emails/adminClientWelcomeEmail";
import { renderAdminClientPasswordChangedEmail } from "./emails/adminClientPasswordChangedEmail";
import { listAuditLogs, recordAuditEvent } from "./auditLog";

async function sendContactSubmissionEmail(submission: ContactFormSubmission) {
  const fields = [
    { label: "Name", value: submission.name },
    { label: "Email", value: submission.email },
    { label: "Phone", value: submission.phone },
    { label: "Message", value: submission.message },
  ];

  await sendNotificationEmail({
    subject: `New contact message from ${submission.name}`,
    replyTo: submission.email,
    text: `A new contact message was submitted.\n\n${renderTextFields(fields)}`,
    html: renderEmailTemplate({
      eyebrow: "New Contact Inquiry",
      title: `New message from ${submission.name}`,
      intro: "A visitor submitted the contact form on the website and is looking to connect.",
      fields,
      body: [
        "This came in through the main contact flow and should be treated like a live website inquiry.",
      ],
      button: {
        label: "Reply to Client",
        href: `mailto:${submission.email}`,
      },
      closing: "Follow up while the inquiry is fresh.",
      signature: "Website Intake\nLender Greg",
    }),
  });
}


function formatAdminPhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const normalizedDigits = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (normalizedDigits.length !== 10) {
    return phone.trim();
  }

  return `(${normalizedDigits.slice(0, 3)}) ${normalizedDigits.slice(3, 6)}-${normalizedDigits.slice(6)}`;
}

function mapAdminClient(client: Awaited<ReturnType<typeof storage.getClientUser>>) {
  if (!client) {
    return null;
  }

  return {
    id: client.id,
    name: client.fullName,
    email: client.email,
    phone: client.phone,
    industry: client.industry,
    compliance: client.compliance,
    photoUrl: client.photoUrl,
    revenue: client.revenue,
    billing: client.billing,
    contacted: new Date(client.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    assigned: client.assigned,
    status: client.status,
    background: client.background,
    currentAddress: client.currentAddress,
    loanPurpose: client.loanPurpose,
    propertyType: client.propertyType,
    estimatedValue: client.estimatedValue,
    downPayment: client.downPayment,
    targetLoanAmount: client.targetLoanAmount,
    createdAt: client.createdAt.toISOString(),
  };
}

function getChangedClientFields(input: Record<string, unknown>) {
  return Object.keys(input).map((key) => {
    if (key === "photoDataUrl") {
      return "photo";
    }

    return key;
  });
}

async function sendApplySubmissionEmail(submission: ApplyFormSubmission) {
  const fields = [
    { label: "Name", value: submission.name },
    { label: "Email", value: submission.email },
    { label: "Phone", value: submission.phone },
    { label: "Loan Type", value: submission.loanType },
    { label: "Target Home Price", value: submission.homePrice },
  ];

  await sendNotificationEmail({
    subject: `New pre-approval request from ${submission.name}`,
    replyTo: submission.email,
    text: `A new pre-approval request was submitted.\n\n${renderTextFields(fields)}`,
    html: renderEmailTemplate({
      eyebrow: "New Application Lead",
      title: `Pre-approval request from ${submission.name}`,
      intro: "A borrower started the apply flow and submitted their information for follow-up.",
      fields,
      body: [
        "This request came through the website application flow and is ready for outreach.",
      ],
      button: {
        label: "Email Borrower",
        href: `mailto:${submission.email}`,
      },
      closing: "Reach out quickly to keep momentum high.",
      signature: "Website Intake\nLender Greg",
    }),
  });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  registerPasswordResetRoutes(app, {
    storage,
    mailer: {
      sendMail: sendNotificationEmail,
    },
  });

  app.get("/api/admin/audit-logs", requireRole("admin"), async (req, res, next) => {
    try {
      const limit = Number.parseInt(String(req.query.limit || "100"), 10);
      const auditLogs = await listAuditLogs(limit);

      await recordAuditEvent(req, {
        category: "audit",
        action: "audit_log.view",
        outcome: "success",
        targetType: "audit_log",
        entityTable: "audit_logs",
        statusCode: 200,
        metadata: {
          count: auditLogs.length,
          limit: Number.isFinite(limit) ? limit : 100,
        },
      });

      res.status(200).json({ auditLogs });
    } catch (error) {
      next(error);
    }
  });


  app.post("/api/admin/clients", requireRole("admin"), async (req, res, next) => {
    try {
      const input = adminClientCreateSchema.parse(req.body);
      const passwordHash = await hashPassword(input.password);
      const client = await storage.createClientUser({
        ...input,
        phone: formatAdminPhoneNumber(input.phone),
        passwordHash,
      });
      const mappedClient = mapAdminClient(client);

      let welcomeEmailSent = false;
      let warning: string | undefined;

      if (input.sendWelcomeEmail) {
        try {
          await sendNotificationEmail({
            to: client.email,
            ...renderAdminClientWelcomeEmail({
              name: client.fullName,
              email: client.email,
              password: input.password,
            }),
          });
          welcomeEmailSent = true;
        } catch (mailError) {
          console.error("Admin client welcome email failed:", mailError);
          warning = "Client was created, but the welcome email could not be sent. Please check the email settings and try again.";
        }
      }

      await recordAuditEvent(req, {
        category: "client_management",
        action: "client.create",
        outcome: "success",
        targetType: "client",
        targetId: client.id,
        targetLabel: client.email,
        entityTable: "users,client_profiles",
        statusCode: 201,
        after: mappedClient,
        metadata: {
          createdBy: "admin",
          sendWelcomeEmail: input.sendWelcomeEmail,
          welcomeEmailSent,
          warning: warning || null,
        },
      });

      res.status(201).json({
        client: mappedClient,
        welcomeEmailSent,
        warning,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/clients", requireRole("admin"), async (_req, res, next) => {
    try {
      const clients = await storage.listClientUsers();

      res.status(200).json({
        clients: clients.map((client) => mapAdminClient(client)).filter(Boolean),
      });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/clients/:id", requireRole("admin"), async (req, res, next) => {
    try {
      const client = await storage.getClientUser(req.params.id);
      const mappedClient = mapAdminClient(client);

      if (!mappedClient) {
        return res.status(404).json({ message: "Client not found" });
      }

      res.status(200).json({ client: mappedClient });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/clients/:id", requireRole("admin"), async (req, res, next) => {
    try {
      const input = adminClientUpdateSchema.parse(req.body);
      const beforeClient = await storage.getClientUser(req.params.id);
      const beforeMappedClient = mapAdminClient(beforeClient);

      if (!beforeMappedClient) {
        await recordAuditEvent(req, {
          category: "client_management",
          action: "client.update",
          outcome: "failure",
          severity: "warning",
          targetType: "client",
          targetId: req.params.id,
          entityTable: "users,client_profiles",
          statusCode: 404,
          metadata: {
            reason: "client_not_found",
            changedFields: getChangedClientFields(input),
          },
        });
        return res.status(404).json({ message: "Client not found" });
      }

      const client = await storage.updateClientUser(req.params.id, {
        ...input,
        phone: input.phone !== undefined ? formatAdminPhoneNumber(input.phone) : undefined,
      });
      const mappedClient = mapAdminClient(client);

      if (!mappedClient) {
        return res.status(404).json({ message: "Client not found" });
      }

      await recordAuditEvent(req, {
        category: "client_management",
        action: "client.update",
        outcome: "success",
        targetType: "client",
        targetId: mappedClient.id,
        targetLabel: mappedClient.email,
        entityTable: "users,client_profiles",
        statusCode: 200,
        before: beforeMappedClient,
        after: mappedClient,
        metadata: {
          changedFields: getChangedClientFields(input),
        },
      });

      res.status(200).json({ client: mappedClient });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/admin/clients/:id/password", requireRole("admin"), async (req, res, next) => {
    try {
      const input = adminClientPasswordUpdateSchema.parse(req.body);
      const client = await storage.getClientUser(req.params.id);

      if (!client) {
        await recordAuditEvent(req, {
          category: "client_management",
          action: "client.password.update",
          outcome: "failure",
          severity: "warning",
          targetType: "client",
          targetId: req.params.id,
          entityTable: "users",
          statusCode: 404,
          metadata: {
            reason: "client_not_found",
          },
        });
        return res.status(404).json({ message: "Client not found" });
      }

      const passwordHash = await hashPassword(input.password);
      await storage.updateUserPassword(client.id, passwordHash);
      await storage.deletePasswordResetTokensForUser(client.id);

      let passwordEmailSent = false;
      let warning: string | undefined;

      if (input.sendPasswordEmail) {
        try {
          await sendNotificationEmail({
            to: client.email,
            ...renderAdminClientPasswordChangedEmail({
              name: client.fullName,
              email: client.email,
              password: input.password,
            }),
          });
          passwordEmailSent = true;
        } catch (mailError) {
          console.error("Admin client password email failed:", mailError);
          warning = "Password was updated, but the email could not be sent. Please check the email settings and try again.";
        }
      }

      await recordAuditEvent(req, {
        category: "client_management",
        action: "client.password.update",
        outcome: "success",
        targetType: "client",
        targetId: client.id,
        targetLabel: client.email,
        entityTable: "users,password_reset_tokens",
        statusCode: 200,
        metadata: {
          resetTokensCleared: true,
          sendPasswordEmail: input.sendPasswordEmail,
          passwordEmailSent,
          warning: warning || null,
        },
      });

      res.status(200).json({
        message: "Client password updated successfully",
        passwordEmailSent,
        warning,
      });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/clients/:id", requireRole("admin"), async (req, res, next) => {
    try {
      const deletedClient = await storage.deleteClientUser(req.params.id);

      if (!deletedClient) {
        await recordAuditEvent(req, {
          category: "client_management",
          action: "client.delete",
          outcome: "failure",
          severity: "warning",
          targetType: "client",
          targetId: req.params.id,
          entityTable: "users,client_profiles",
          statusCode: 404,
          metadata: {
            reason: "client_not_found",
          },
        });
        return res.status(404).json({ message: "Client not found" });
      }

      await recordAuditEvent(req, {
        category: "client_management",
        action: "client.delete",
        outcome: "success",
        severity: "warning",
        targetType: "client",
        targetId: deletedClient.id,
        targetLabel: deletedClient.email,
        entityTable: "users,client_profiles",
        statusCode: 200,
        before: mapAdminClient(deletedClient),
        metadata: {
          deletedPhoto: Boolean(deletedClient.photoUrl),
        },
      });

      res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/contact", async (req, res, next) => {
    try {
      const submission = contactFormSchema.parse(req.body);
      await sendContactSubmissionEmail(submission);

      await recordAuditEvent(req, {
        category: "lead_intake",
        action: "contact.create",
        outcome: "success",
        targetType: "contact_submission",
        targetLabel: submission.email,
        statusCode: 200,
        after: {
          name: submission.name,
          email: submission.email,
          phone: submission.phone,
        },
        metadata: {
          source: "website_contact_form",
          messageLength: submission.message.length,
        },
      });

      res.status(200).json({ message: "Contact message sent successfully" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/apply", async (req, res, next) => {
    try {
      const submission = applyFormSchema.parse(req.body);
      const applicationId = await storage.createLoanApplication(submission, {
        ipAddress: req.ip,
        userAgent: req.get("user-agent") || undefined,
      });
      await sendApplySubmissionEmail(submission);

      await recordAuditEvent(req, {
        category: "lead_intake",
        action: "loan_application.create",
        outcome: "success",
        targetType: "loan_application",
        targetId: applicationId,
        targetLabel: submission.email,
        entityTable: "loan_applications",
        statusCode: 200,
        after: {
          applicantName: submission.name,
          applicantEmail: submission.email,
          applicantPhone: submission.phone,
          loanType: submission.loanType,
          homePrice: submission.homePrice,
        },
        metadata: {
          source: "website_apply_form",
        },
      });

      res.status(200).json({ message: "Application submitted successfully" });
    } catch (error) {
      next(error);
    }
  });

  return httpServer;
}
