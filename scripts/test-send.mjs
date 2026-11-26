// Local smoke test for api/send.js without sending real mail.
import handler from "../api/send.js";
const call = (body, env = {}) =>
  new Promise((resolve) => {
    Object.assign(process.env, env);
    const res = { code: 0, headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(d) { resolve([this.code, d]); } };
    handler({ method: "POST", body }, res);
  });
const ok = { form: "home-inquiry", subject: "Test", fields: [["Name", "A"], ["Phone", "123"]] };
delete process.env.ZOHO_SMTP_USER; delete process.env.ZOHO_SMTP_PASS;
console.log("no credentials:", await call(ok));
const env = { ZOHO_SMTP_USER: "x@example.com", ZOHO_SMTP_PASS: "x", ZOHO_SMTP_HOST: "127.0.0.1" };
console.log("bad form name:", await call({ ...ok, form: "nope" }, env));
console.log("honeypot:", await call({ ...ok, website: "spam" }, env));
console.log("bad file type:", await call({ ...ok, attachment: { name: "a.exe", type: "application/x-msdownload", data: "AA==" } }, env));
console.log("smtp unreachable:", await call(ok, env));
