/**
 * POST /api/send — delivers every website form to the inbox through Zoho Mail SMTP.
 *
 * Vercel environment variables (Project → Settings → Environment Variables):
 *   ZOHO_SMTP_USER  the Zoho mailbox that sends, e.g. recruit@rsina.in
 *   ZOHO_SMTP_PASS  an app-specific password for that mailbox (Zoho → My Account → Security → App Passwords)
 *   ZOHO_SMTP_HOST  optional, default smtp.zoho.in (India data centre; use smtp.zoho.com for .com accounts)
 *   MAIL_TO         optional, default recruit@rsina.in — where enquiries are delivered
 *
 * Body (JSON): { form, subject, fields: [[label, value], …], replyTo?, attachment?: { name, type, data(base64) }, website? }
 * `website` is a honeypot: real visitors never fill it.
 */
import nodemailer from "nodemailer";

const MAX_FILE = 3 * 1024 * 1024; // keeps the JSON body under Vercel's 4.5 MB request limit
const FILE_TYPES = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};
const FORMS = new Set(["home-inquiry", "shortlist", "job-application", "contact-company", "contact-jobseeker"]);

const clean = (s, max = 2000) => String(s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
const escape = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { ZOHO_SMTP_USER: user, ZOHO_SMTP_PASS: pass } = process.env;
  if (!user || !pass) return res.status(503).json({ error: "Email sending is not configured yet." });

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid request." });
    }
  }
  const { form, subject, fields, replyTo, attachment, website } = body || {};

  if (website) return res.status(200).json({ ok: true }); // bot filled the honeypot: pretend success
  if (!FORMS.has(form) || !Array.isArray(fields) || fields.length === 0 || fields.length > 30) {
    return res.status(400).json({ error: "Invalid request." });
  }

  const rows = fields
    .filter((f) => Array.isArray(f) && f.length === 2 && String(f[1] ?? "").trim())
    .map(([label, value]) => [clean(label, 80), String(value).trim().slice(0, 5000)]);

  const attachments = [];
  if (attachment) {
    const ext = FILE_TYPES[attachment.type];
    const data = Buffer.from(String(attachment.data || ""), "base64");
    if (!ext || data.length === 0) return res.status(400).json({ error: "Résumé must be a PDF, DOC or DOCX file." });
    if (data.length > MAX_FILE) return res.status(413).json({ error: "Résumé must be 3 MB or smaller." });
    const name = clean(attachment.name, 120).replace(/[^\w.\- ]+/g, "_") || `resume${ext}`;
    attachments.push({ filename: name.toLowerCase().endsWith(ext) ? name : name + ext, content: data, contentType: attachment.type });
  }

  const text = rows.map(([l, v]) => `${l}: ${v}`).join("\n");
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
    .map(
      ([l, v]) =>
        `<tr><th align="left" valign="top" style="background:#f1f5f9;border:1px solid #e2e8f0">${escape(l)}</th><td style="border:1px solid #e2e8f0;white-space:pre-wrap">${escape(v)}</td></tr>`
    )
    .join("")}</table><p style="color:#64748b;font-size:12px">Sent from the website form “${escape(form)}”.</p>`;

  const transport = nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  try {
    await transport.sendMail({
      from: { name: "RS International Website", address: user },
      to: process.env.MAIL_TO || "recruit@rsina.in",
      replyTo: replyTo && isEmail(String(replyTo).trim()) ? String(replyTo).trim() : undefined,
      subject: clean(subject, 160) || "Website enquiry",
      text,
      html,
      attachments,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("send failed", err?.code, err?.response || err?.message);
    return res.status(502).json({ error: "We couldn't send your message right now." });
  }
}
