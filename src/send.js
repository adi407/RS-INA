import { CONTACT } from "./content.js";

/** Reads a File as base64 (no data: prefix). */
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

/**
 * Sends a form to /api/send (Zoho Mail). `fields` is a list of [label, value] pairs,
 * in the order they should appear in the email. Resolves on success; rejects with an
 * Error whose message is safe to show. `onProgress(0..1)` reports upload progress.
 */
export async function sendForm({ form, subject, fields, replyTo, file, website, onProgress }) {
  const attachment = file ? { name: file.name, type: file.type, data: await toBase64(file) } : undefined;
  const body = JSON.stringify({ form, subject, fields, replyTo, attachment, website });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/send");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.timeout = 30000;
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(e.loaded / e.total);
    xhr.onload = () => {
      let data = {};
      try {
        data = JSON.parse(xhr.responseText || "{}");
      } catch {
        /* non-JSON (e.g. local dev without the API) */
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.ok) resolve();
      else reject(new Error(data.error || "We couldn't send your message right now."));
    };
    xhr.onerror = () => reject(new Error("You seem to be offline. Please check your connection and try again."));
    xhr.ontimeout = () => reject(new Error("Sending took too long. Please try again."));
    xhr.send(body);
  });
}

/** A mailto: link carrying the same content — the fallback when sending fails. */
export function mailtoFallback(subject, fields) {
  const body = fields
    .filter(([, v]) => String(v ?? "").trim())
    .map(([l, v]) => `${l}: ${v}`)
    .join("\n");
  return `mailto:${CONTACT.emails[0]}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
