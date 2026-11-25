const RESEND_ENDPOINT = "https://api.resend.com/emails";

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#039;";
    }
  });

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async (req) => {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL || "koteswararaobotchu007@gmail.com";
  const from = process.env.RESEND_FROM_EMAIL || "Portfolio Notifications <onboarding@resend.dev>";

  if (!apiKey) {
    return json(503, { error: "Email notifications are not configured." });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  const { name, email, phone, message, website } = payload || {};

  // Hidden honeypot field: real visitors leave it empty.
  if (website) {
    return json(200, { ok: true });
  }

  if (!name || !email || !message) {
    return json(400, { error: "Name, email and message are required." });
  }

  const safeName = String(name).trim();
  const safeEmail = String(email).trim();
  const safePhone = String(phone || "").trim();
  const safeMessage = String(message).trim();

  if (safeName.length > 100 || safeEmail.length > 200 || safePhone.length > 40 || safeMessage.length > 5000) {
    return json(400, { error: "One or more fields exceed the allowed length." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail)) {
    return json(400, { error: "Please provide a valid email address." });
  }

  const receivedAt = new Date().toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;background:#050508;color:#e4e4e7;padding:32px;border-radius:18px;max-width:640px;margin:0 auto;border:1px solid #27272a">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#818cf8;font-weight:800">New portfolio transmission</p>
      <h1 style="margin:0 0 24px;font-size:24px;color:#ffffff">Message from ${escapeHtml(safeName)}</h1>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr>
          <td style="padding:10px 0;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:2px;width:110px">Email</td>
          <td style="padding:10px 0;color:#ffffff;font-size:14px"><a href="mailto:${escapeHtml(safeEmail)}" style="color:#818cf8;text-decoration:none">${escapeHtml(safeEmail)}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:2px">Phone</td>
          <td style="padding:10px 0;color:#ffffff;font-size:14px">${safePhone ? escapeHtml(safePhone) : "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:2px">Received</td>
          <td style="padding:10px 0;color:#ffffff;font-size:14px">${escapeHtml(receivedAt)} IST</td>
        </tr>
      </table>
      <div style="background:#09090b;border:1px solid #27272a;border-radius:14px;padding:20px">
        <p style="margin:0 0 8px;color:#71717a;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:800">Message</p>
        <p style="margin:0;color:#d4d4d8;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(safeMessage)}</p>
      </div>
      <p style="margin:24px 0 0;color:#52525b;font-size:11px">Reply directly to this email to answer ${escapeHtml(safeName)}.</p>
    </div>
  `;

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: safeEmail,
      subject: `New portfolio message from ${safeName}`,
      html,
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("Resend email failed:", result);
    return json(502, { error: "Email delivery failed." });
  }

  return json(200, { ok: true, id: result.id });
};
