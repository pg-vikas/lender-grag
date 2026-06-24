import {
  escapeHtml,
  getPublicAppUrl,
  renderCommonEmailLayout,
  renderCommonEmailText,
} from "./commonEmailLayout";

type AdminClientWelcomeEmailOptions = {
  name: string;
  email: string;
  password: string;
  portalUrl?: string;
};

export function renderAdminClientWelcomeEmail({
  name,
  email,
  password,
  portalUrl = `${getPublicAppUrl()}/portal`,
}: AdminClientWelcomeEmailOptions) {
  const safeName = name.trim() ? name.trim() : "there";

  const bodyHtml = `
    <p style="margin:0 0 16px;">Hi ${escapeHtml(safeName)},</p>
    <p style="margin:0 0 16px;">Your Lender Greg client portal account has been created. You can use the login details below to access your portal.</p>
    <div style="margin:22px 0;padding:18px;border:1px solid #dbeae3;border-radius:16px;background:#f8fcfa;">
      <div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#004733;margin-bottom:6px;">Email Address</div>
      <div style="font-size:15px;line-height:1.6;color:#0c1a14;margin-bottom:16px;">${escapeHtml(email)}</div>
      <div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#004733;margin-bottom:6px;">Temporary Password</div>
      <div style="font-size:15px;line-height:1.6;color:#0c1a14;font-family:Consolas,Monaco,monospace;">${escapeHtml(password)}</div>
    </div>
    <p style="margin:0 0 16px;">For security, please log in and update your password after your first sign in.</p>
    <p style="margin:0;font-size:13px;color:#7a857f;">If you were not expecting this account, reply to this email and our team will help.</p>
  `;

  return {
    subject: "Welcome to your Lender Greg client portal",
    html: renderCommonEmailLayout({
      title: "Your client portal is ready",
      preheader: "Your Lender Greg portal login details are ready.",
      bodyHtml,
      button: {
        label: "Open Client Portal",
        url: portalUrl,
      },
    }),
    text: renderCommonEmailText(
      "Your client portal is ready",
      [
        `Hi ${safeName},`,
        "Your Lender Greg client portal account has been created.",
        `Email Address: ${email}`,
        `Temporary Password: ${password}`,
        "For security, please log in and update your password after your first sign in.",
      ],
      {
        label: "Open Client Portal",
        url: portalUrl,
      },
    ),
  };
}
