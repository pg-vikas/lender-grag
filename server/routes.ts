import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  applyFormSchema,
  contactFormSchema,
  type ApplyFormSubmission,
  type ContactFormSubmission,
} from "@shared/schema";
import { sendNotificationEmail } from "./mailer";
import { renderEmailTemplate, renderTextFields } from "./emailTemplates";
import { registerPasswordResetRoutes } from "./auth/passwordReset";

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

  app.post("/api/contact", async (req, res, next) => {
    try {
      const submission = contactFormSchema.parse(req.body);
      await sendContactSubmissionEmail(submission);

      res.status(200).json({ message: "Contact message sent successfully" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/apply", async (req, res, next) => {
    try {
      const submission = applyFormSchema.parse(req.body);
      await sendApplySubmissionEmail(submission);

      res.status(200).json({ message: "Application submitted successfully" });
    } catch (error) {
      next(error);
    }
  });

  return httpServer;
}
