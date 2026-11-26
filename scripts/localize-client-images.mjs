// One-off: the client-logo and case-study images referenced as `${CL}name` in content.js
import fs from "node:fs/promises";
import sharp from "sharp";

const f = "src/content.js";
let s = await fs.readFile(f, "utf8");
const seen = new Map();
for (const m of [...s.matchAll(/`\$\{CL\}([^`]+)`/g)]) {
  if (!seen.has(m[1])) {
    const url = "https://rsinternationalagency.com/wp-content/uploads/2023/02/" + m[1];
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status + " " + url);
    const name = "client-" + m[1].replace(/\.[a-z]+$/i, "").toLowerCase() + ".webp";
    const logo = /\.png$/i.test(m[1]);
    await sharp(Buffer.from(await res.arrayBuffer()))
      .resize({ width: logo ? 480 : 1200, withoutEnlargement: true })
      .webp({ quality: logo ? 90 : 78 })
      .toFile("public/media/site/" + name);
    seen.set(m[1], name);
    console.log(url, "->", name);
  }
  s = s.split(m[0]).join(`"/media/site/${seen.get(m[1])}"`);
}
s = s.replace("const CL = `${UP}2023/02/`;\n", "");
await fs.writeFile(f, s);
