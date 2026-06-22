import nodemailer from "nodemailer";

type MailPayload = {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  to?: string;
};

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getSmtpConfig() {
  const host = getRequiredEnv("SMTP_HOST");
  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);

  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT must be a valid number");
  }

  const secure = (process.env.SMTP_SECURE ?? "false").toLowerCase() === "true";
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");
  const fromEmail = getRequiredEnv("SMTP_FROM_EMAIL");
  const fromName = process.env.SMTP_FROM_NAME?.trim() || "Lender Greg";
  const toEmail = getRequiredEnv("SMTP_TO_EMAIL");

  return {
    host,
    port,
    secure,
    auth: { user, pass },
    from: `${fromName} <${fromEmail}>`,
    toEmail,
  };
}

export async function sendNotificationEmail(payload: MailPayload) {
  const smtp = getSmtpConfig();
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: smtp.auth,
  });

  await transporter.sendMail({
    from: smtp.from,
    to: payload.to || smtp.toEmail,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}
