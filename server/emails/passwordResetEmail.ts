import { escapeHtml, renderCommonEmailLayout, renderCommonEmailText } from "./commonEmailLayout";

type PasswordResetEmailOptions = {
  name?: string | null;
  resetUrl: string;
  expiresInMinutes?: number;
};

export function renderPasswordResetEmail({ name, resetUrl, expiresInMinutes = 30 }: PasswordResetEmailOptions) {
  const greeting = name?.trim() ? `Hi ${escapeHtml(name.trim())},` : "Hi,";
  const expiryText = `This link will expire in ${expiresInMinutes} minutes.`;

  const bodyHtml = `
    <p style="margin:0 0 16px;">${greeting}</p>
    <p style="margin:0 0 16px;">We received a request to reset the password for your Lender Greg portal account.</p>
    <p style="margin:0 0 16px;">Click the button below to create a new password. ${escapeHtml(expiryText)}</p>
    <p style="margin:22px 0 0;font-size:13px;color:#7a857f;">If you did not request this, you can safely ignore this email and your password will stay the same.</p>
  `;

  return {
    subject: "Reset your Lender Greg password",
    html: renderCommonEmailLayout({
      title: "Reset your password",
      preheader: "Use this secure link to reset your Lender Greg portal password.",
      bodyHtml,
      button: {
        label: "Reset Password",
        url: resetUrl,
      },
    }),
    text: renderCommonEmailText(
      "Reset your password",
      [
        name?.trim() ? `Hi ${name.trim()},` : "Hi,",
        "We received a request to reset the password for your Lender Greg portal account.",
        expiryText,
        "If you did not request this, you can safely ignore this email and your password will stay the same.",
      ],
      {
        label: "Reset Password",
        url: resetUrl,
      },
    ),
  };
}
