export type EmailButton = {
  label: string;
  url: string;
};

export type CommonEmailLayoutOptions = {
  title: string;
  preheader?: string;
  bodyHtml: string;
  button?: EmailButton;
};

const BRAND_GREEN = "#004733";
const BRAND_GOLD = "#d4a94c";
const SOFT_GREEN = "#f0faf6";
const TEXT_DARK = "#0c1a14";
const TEXT_MUTED = "#5d6b63";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function currentYear() {
  return new Date().getFullYear();
}

export function getPublicAppUrl() {
  return (
    process.env.PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5002"
  ).replace(/\/$/, "");
}

export function renderCommonEmailLayout({ title, preheader, bodyHtml, button }: CommonEmailLayoutOptions) {
  const safeTitle = escapeHtml(title);
  const safePreheader = preheader ? escapeHtml(preheader) : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;padding:0;background:${SOFT_GREEN};font-family:Arial,Helvetica,sans-serif;color:${TEXT_DARK};">
    ${safePreheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safePreheader}</div>` : ""}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${SOFT_GREEN};margin:0;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e9f1ed;box-shadow:0 16px 40px rgba(0,71,51,0.08);">
            <tr>
              <td style="background:${BRAND_GREEN};padding:28px 32px;text-align:center;">
                <div style="font-size:24px;font-weight:800;letter-spacing:-0.3px;color:#ffffff;">Lender Greg</div>
                <div style="font-size:13px;color:rgba(255,255,255,0.78);margin-top:6px;">Secure Client Portal</div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 32px 24px;">
                <h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;color:${TEXT_DARK};font-weight:800;">${safeTitle}</h1>
                <div style="font-size:15px;line-height:1.7;color:${TEXT_MUTED};">${bodyHtml}</div>
                ${button ? `
                  <table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0 10px;">
                    <tr>
                      <td style="border-radius:14px;background:${BRAND_GREEN};">
                        <a href="${escapeHtml(button.url)}" style="display:inline-block;padding:14px 22px;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;border-radius:14px;">${escapeHtml(button.label)}</a>
                      </td>
                    </tr>
                  </table>
                ` : ""}
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 30px;">
                <div style="height:1px;background:#edf3f0;margin-bottom:22px;"></div>
                <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#7a857f;">Need help? Reply to this email and the Lender Greg team will assist you.</p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#9aa39d;">© ${currentYear()} Lender Greg. All rights reserved.</p>
                <div style="margin-top:14px;width:46px;height:3px;background:${BRAND_GOLD};border-radius:999px;"></div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderCommonEmailText(title: string, lines: string[], button?: EmailButton) {
  return [
    "Lender Greg",
    "Secure Client Portal",
    "",
    title,
    "",
    ...lines,
    ...(button ? ["", `${button.label}: ${button.url}`] : []),
    "",
    "Need help? Reply to this email and the Lender Greg team will assist you.",
  ].join("\n");
}
