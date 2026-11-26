// Runs after `vite build`. Writes one HTML file per page (dist/jobs.html, dist/about.html …)
// with that page's own <title>, description, canonical URL and social tags already in the
// HTML, so search engines and link previews (WhatsApp, LinkedIn) see them without running
// JavaScript. Also writes sitemap.xml and JobPosting structured data for current jobs.
import fs from "node:fs/promises";
import { NOT_FOUND, OG_IMAGE, PAGES, SITE_NAME, SITE_URL } from "../src/meta.js";
import { CONTACT, JOBS } from "../src/content.js";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const template = await fs.readFile("dist/index.html", "utf8");

const JOB_MAX_AGE_DAYS = 180;
const jobPostings = () => {
  const now = Date.now();
  return JOBS.listings
    .filter((j) => now - new Date(j.posted).getTime() < JOB_MAX_AGE_DAYS * 86400000)
    .map((j) => ({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: j.title,
      description: [j.summary, ...j.points].filter(Boolean).join(" "),
      datePosted: new Date(j.posted).toISOString().slice(0, 10),
      validThrough: new Date(new Date(j.posted).getTime() + JOB_MAX_AGE_DAYS * 86400000).toISOString().slice(0, 10),
      employmentType: j.type.toUpperCase().replace(/\s+/g, "_"),
      hiringOrganization: { "@type": "Organization", name: SITE_NAME, sameAs: SITE_URL },
      jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: j.location } },
      url: `${SITE_URL}/jobs?job=${j.id}`,
    }));
};

function render(path, meta, extraHead = "", robots = "") {
  const url = SITE_URL + (path === "/" ? "/" : path);
  const head = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    robots,
    extraHead,
  ]
    .filter(Boolean)
    .join("\n    ");
  return template
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, "")
    .replace("<!--page-meta-->", head);
}

const routes = Object.entries(PAGES);
for (const [path, meta] of routes) {
  const extra = path === "/jobs" ? jobPostings().map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join("\n    ") : "";
  const file = path === "/" ? "dist/index.html" : `dist${path}.html`;
  await fs.writeFile(file, render(path, meta, extra));
}
await fs.writeFile("dist/404.html", render("/404", NOT_FOUND, "", `<meta name="robots" content="noindex" />`));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(([p]) => `  <url><loc>${SITE_URL}${p === "/" ? "/" : p}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
await fs.writeFile("dist/sitemap.xml", sitemap);
console.log(`prerendered ${routes.length} pages + 404, sitemap.xml (${CONTACT.emails[0]} receives forms)`);
