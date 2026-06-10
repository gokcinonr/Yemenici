import { Router } from "express";
import nodemailer from "nodemailer";
import { db, contactSubmissionsTable, siteContentTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

async function getSmtpConfig() {
  const rows = await db
    .select()
    .from(siteContentTable)
    .where(eq(siteContentTable.section, "contact_settings"));
  const get = (key: string) => rows.find((r) => r.key === key)?.value || "";
  return {
    host: get("smtp_host"),
    port: parseInt(get("smtp_port") || "587", 10),
    user: get("smtp_user"),
    pass: get("smtp_pass"),
    from: get("smtp_from") || "noreply@yemenici.com",
    fromName: get("smtp_from_name") || "Yemenici",
    recipient: get("recipient_email"),
  };
}

function buildEmailHtml(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  position?: string | null;
  companyName: string;
  message: string;
  lang: string;
}) {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const fields: [string, string][] = [
    ["Name", `${data.firstName} ${data.lastName}`],
    ["Email", data.email],
    ...(data.phone ? [["Phone", data.phone] as [string, string]] : []),
    ...(data.position ? [["Position", data.position] as [string, string]] : []),
    ["Company", data.companyName],
    ["Language", data.lang.toUpperCase()],
  ];
  const rows = fields
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:8px 14px;background:#f8f9fb;border:1px solid #e5e7eb;font-weight:600;font-size:13px;color:#374151;width:130px;white-space:nowrap">${esc(k)}</td>
          <td style="padding:8px 14px;border:1px solid #e5e7eb;font-size:13px;color:#111827">${esc(v)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html><body style="font-family:Arial,Helvetica,sans-serif;background:#f5f5f7;padding:32px;margin:0">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
  <div style="background:#004FA3;padding:24px 32px">
    <p style="margin:0;color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.12em;text-transform:uppercase">Yemenici Contact Form</p>
    <h2 style="margin:6px 0 0;color:#fff;font-size:20px;font-weight:700">New Submission</h2>
  </div>
  <div style="padding:28px 32px">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${rows}</table>
    <div style="padding:16px;background:#f8f9fb;border-radius:8px;border:1px solid #e5e7eb">
      <p style="margin:0 0 8px;font-weight:600;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em">Message</p>
      <p style="margin:0;font-size:13px;color:#111827;line-height:1.7;white-space:pre-wrap">${esc(data.message)}</p>
    </div>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #e5e7eb;background:#fafafa">
    <p style="margin:0;font-size:11px;color:#9ca3af">Sent automatically by the Yemenici website contact form &bull; ${new Date().toUTCString()}</p>
  </div>
</div>
</body></html>`;
}

router.post("/contact", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, companyName, message, lang, consent } =
      req.body as {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        position?: string;
        companyName?: string;
        message?: string;
        lang?: string;
        consent?: boolean;
      };

    if (!firstName?.trim() || !lastName?.trim()) {
      res.status(400).json({ error: "First name and last name are required." });
      return;
    }
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ error: "A valid email address is required." });
      return;
    }
    if (!companyName?.trim()) {
      res.status(400).json({ error: "Company name is required." });
      return;
    }
    if (!message?.trim()) {
      res.status(400).json({ error: "Message is required." });
      return;
    }
    if (!consent) {
      res
        .status(400)
        .json({ error: "You must accept the Terms & Conditions and Privacy Policy." });
      return;
    }

    const [submission] = await db
      .insert(contactSubmissionsTable)
      .values({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        position: position?.trim() || null,
        companyName: companyName.trim(),
        message: message.trim(),
        lang: lang || "en",
        consentGiven: true,
      })
      .returning();

    req.log.info({ submissionId: submission.id, email: submission.email }, "Contact form saved");

    try {
      const smtp = await getSmtpConfig();
      if (smtp.host && smtp.user && smtp.pass && smtp.recipient) {
        const transporter = nodemailer.createTransport({
          host: smtp.host,
          port: smtp.port,
          secure: smtp.port === 465,
          auth: { user: smtp.user, pass: smtp.pass },
        });
        await transporter.sendMail({
          from: `"${smtp.fromName}" <${smtp.from}>`,
          to: smtp.recipient,
          subject: `New Contact: ${firstName.trim()} ${lastName.trim()} — ${companyName.trim()}`,
          html: buildEmailHtml({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone?.trim() || null,
            position: position?.trim() || null,
            companyName: companyName.trim(),
            message: message.trim(),
            lang: lang || "en",
          }),
        });
        req.log.info({ submissionId: submission.id }, "Email notification sent");
      } else {
        req.log.warn("SMTP not configured — email skipped");
      }
    } catch (emailErr) {
      req.log.error(emailErr, "Email send failed (submission already saved)");
    }

    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
