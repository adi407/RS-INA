// One-off: download every asset content.js loads from the old WordPress site,
// save photos as resized WebP (and PDFs as-is) under public/media/site, and
// rewrite content.js to point at the local copies.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "..");
const contentPath = path.join(root, "src", "content.js");
const outDir = path.join(root, "public", "media", "site");
await fs.mkdir(outDir, { recursive: true });

let src = await fs.readFile(contentPath, "utf8");
const bases = {};
for (const m of src.matchAll(/^const (IMG|UP|LOGO) = "([^"]+)";$/gm)) bases[m[1]] = m[2];

// Every reference: ${IMG}path, ${UP}path, ${LOGO}path or a full URL
const refRe = /\$\{(IMG|UP|LOGO)\}([^`"]+)|https:\/\/rsinternationalagency\.com\/wp-content\/uploads\/[^"`\s]+/g;
const refs = new Map();
for (const m of src.matchAll(refRe)) if (!m[0].endsWith("/")) refs.set(m[0], m[1] ? bases[m[1]] + m[2] : m[0]);

const used = new Set();
for (const [token, url] of refs) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  let base = path.basename(new URL(url).pathname, ext).replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-").toLowerCase();
  while (used.has(base)) base += "-x";
  used.add(base);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  let file;
  if (ext === ".pdf") {
    file = `${base}.pdf`;
    await fs.writeFile(path.join(outDir, file), buf);
  } else if (ext === ".png" && /logo|client|partner/i.test(url + token)) {
    file = `${base}.webp`; // logos keep transparency, lossless-ish
    await sharp(buf).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 90 }).toFile(path.join(outDir, file));
  } else {
    file = `${base}.webp`;
    await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(outDir, file));
  }
  const local = `/media/site/${file}`;
  src = src.split(token).join(token.startsWith("$") ? local : local);
  console.log(`${(buf.length / 1024).toFixed(0).padStart(5)} KB  ${url}  ->  ${local}`);
}
src = src.replace(/^const (IMG|UP|LOGO) = "[^"]+";\n/gm, "");
await fs.writeFile(contentPath, src);
