type EmailButton = {
  label: string;
  href: string;
};

type RenderEmailOptions = {
  eyebrow: string;
  title: string;
  intro: string;
  body?: string[];
  fields?: Array<{ label: string; value: string }>;
  bullets?: string[];
  button?: EmailButton;
  closing?: string;
  signature?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getAppUrl() {
  return process.env.APP_URL?.trim() || "http://localhost:5002";
}

function renderParagraphs(paragraphs: string[]) {
  return paragraphs
    .map(
      (paragraph) =>
        `<p style="margin:0 0 16px;color:#4b5563;font-size:16px;line-height:1.7;">${escapeHtml(paragraph)}</p>`,
    )
    .join("");
}

function renderFields(fields: Array<{ label: string; value: string }>) {
  if (fields.length === 0) {
    return "";
  }

  return `
    <div style="margin:28px 0;padding:24px;border:1px solid #d9e8e1;border-radius:20px;background:#f7fbf9;">
      ${fields
        .map(
          ({ label, value }) => `
            <div style="margin:0 0 14px;">
              <div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#05a270;margin-bottom:6px;">${escapeHtml(label)}</div>
              <div style="font-size:15px;line-height:1.6;color:#0c1a14;">${escapeHtml(value || "-")}</div>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderBullets(bullets: string[]) {
  if (bullets.length === 0) {
    return "";
  }

  return `
    <div style="margin:28px 0;padding:24px;border-radius:20px;background:linear-gradient(180deg,#f9fcfb 0%,#eef7f2 100%);border:1px solid #d9e8e1;">
      <div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#004733;margin-bottom:16px;">What Happens Next</div>
      <ul style="margin:0;padding:0;list-style:none;">
        ${bullets
          .map(
            (bullet) => `
              <li style="margin:0 0 12px;padding-left:28px;position:relative;color:#374151;font-size:15px;line-height:1.6;">
                <span style="position:absolute;left:0;top:2px;width:18px;height:18px;border-radius:999px;background:#05a270;color:#ffffff;font-size:12px;line-height:18px;text-align:center;">✓</span>
                ${escapeHtml(bullet)}
              </li>
            `,
          )
          .join("")}
      </ul>
    </div>
  `;
}

function renderButton(button?: EmailButton) {
  if (!button) {
    return "";
  }

  return `
    <div style="margin:32px 0 20px;">
      <a href="${escapeHtml(button.href)}" style="display:inline-block;padding:14px 24px;border-radius:14px;background:#004733;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;box-shadow:0 10px 30px rgba(0,71,51,0.18);">
        ${escapeHtml(button.label)}
      </a>
    </div>
  `;
}

export function renderEmailTemplate(options: RenderEmailOptions) {
  const appUrl = getAppUrl();
  const signature = options.signature || "Greg Wynn\nLender Greg";

  return `
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#eef4f1;font-family:Arial,sans-serif;">
        <div style="padding:32px 16px;">
          <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:28px;overflow:hidden;box-shadow:0 18px 60px rgba(8,20,16,0.08);">
            <div style="padding:20px 28px;background:linear-gradient(135deg,#0c1a14 0%,#004733 55%,#05a270 100%);">
              <div style="font-size:12px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;color:#d7f7ea;margin-bottom:10px;">Lender Greg</div>
              <div style="font-size:28px;line-height:1.2;font-weight:800;color:#ffffff;max-width:420px;">Smart mortgage guidance, responsive service, and a smoother path home.</div>
            </div>

            <div style="padding:36px 28px 20px;">
              <div style="display:inline-block;margin-bottom:14px;padding:8px 12px;border-radius:999px;background:#edf8f3;color:#05a270;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">
                ${escapeHtml(options.eyebrow)}
              </div>
              <h1 style="margin:0 0 14px;color:#0c1a14;font-size:32px;line-height:1.15;font-weight:800;">${escapeHtml(options.title)}</h1>
              <p style="margin:0 0 20px;color:#4b5563;font-size:16px;line-height:1.7;">${escapeHtml(options.intro)}</p>
              ${renderParagraphs(options.body || [])}
              ${renderFields(options.fields || [])}
              ${renderBullets(options.bullets || [])}
              ${renderButton(options.button)}
              <p style="margin:28px 0 0;color:#4b5563;font-size:15px;line-height:1.7;">${escapeHtml(options.closing || "We’re here when you’re ready.")}</p>
              <p style="margin:16px 0 0;color:#0c1a14;font-size:15px;line-height:1.7;font-weight:700;white-space:pre-line;">${escapeHtml(signature)}</p>
            </div>

            <div style="padding:24px 28px;background:#f7fbf9;border-top:1px solid #e3eee9;">
              <div style="font-size:14px;font-weight:700;color:#0c1a14;margin-bottom:8px;">Need anything sooner?</div>
              <div style="font-size:14px;line-height:1.7;color:#4b5563;">
                Visit <a href="${escapeHtml(appUrl)}" style="color:#004733;font-weight:700;text-decoration:none;">${escapeHtml(appUrl)}</a>
                or reply to this email and the team will help you out.
              </div>
              <div style="margin-top:14px;font-size:12px;line-height:1.6;color:#6b7280;">
                This message was sent by Lender Greg. If you did not expect this email, you can safely ignore it.
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function renderTextFields(fields: Array<{ label: string; value: string }>) {
  return fields.map(({ label, value }) => `${label}: ${value || "-"}`).join("\n");
}

