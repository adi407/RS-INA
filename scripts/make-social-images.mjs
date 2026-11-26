// Builds the social preview image (1200×630) and PNG favicons from existing artwork.
// Run once after changing the source images: node scripts/make-social-images.mjs
import sharp from "sharp";

const svg = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${body}</svg>`);

// Social preview: hero photo, darkened, with the company name and promise
const overlay = svg(
  1200,
  630,
  `<rect width="1200" height="630" fill="#0A0F1D" fill-opacity="0.62"/>
   <rect x="72" y="380" width="72" height="6" rx="3" fill="#34d399"/>
   <text x="72" y="300" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#ffffff">RS International</text>
   <text x="72" y="360" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#d1fae5">Overseas manpower recruitment · Govt. of India approved</text>
   <text x="72" y="450" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#cbd5e1">rsina.in</text>`
);
await sharp("public/media/hero-cities-poster.jpg")
  .resize(1200, 630, { fit: "cover" })
  .composite([{ input: overlay }])
  .jpeg({ quality: 82 })
  .toFile("public/media/og-image.jpg");

// PNG icons for browsers/devices that don't use the SVG favicon
for (const size of [32, 180, 512]) {
  await sharp("public/favicon.svg", { density: 300 }).resize(size, size).png().toFile(`public/${size === 180 ? "apple-touch-icon" : `icon-${size}`}.png`);
}
console.log("social images written");
