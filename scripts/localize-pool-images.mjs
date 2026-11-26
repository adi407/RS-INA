import fs from "node:fs/promises";
import sharp from "sharp";
const f = "src/content.js";
let s = await fs.readFile(f, "utf8");
for (const m of [...s.matchAll(/`\$\{EMP\}([^`]+)`/g)]) {
  const url = "https://rsinternationalagency.com/wp-content/uploads/2023/02/" + m[1];
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status + " " + url);
  const name = "pool-" + m[1].replace(/\.[a-z]+$/i, "").toLowerCase() + ".webp";
  await sharp(Buffer.from(await res.arrayBuffer())).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 78 }).toFile("public/media/site/" + name);
  s = s.split(m[0]).join(`"/media/site/${name}"`);
  console.log(url, "->", name);
}
s = s.replace("const EMP = `${UP}2023/02/`;\n", "");
await fs.writeFile(f, s);
