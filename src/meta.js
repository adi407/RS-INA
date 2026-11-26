/**
 * Per-page title and description. Used at runtime (App sets <title> and meta tags)
 * and at build time (scripts/prerender-meta.mjs writes them into each page's HTML,
 * so search engines and link previews see them without running JavaScript).
 */
export const SITE_URL = "https://rsina.in";
export const SITE_NAME = "RS International";
export const OG_IMAGE = "/media/og-image.jpg";

export const PAGES = {
  "/": {
    title: "RS International — Overseas Manpower Recruitment Agency",
    description:
      "Government of India (MEA) approved manpower recruitment agency. We recruit skilled and semi-skilled workers for hospitality, construction, railway and agriculture projects overseas.",
  },
  "/employers": {
    title: "Hire Workers Overseas — Talent Pools | RS International",
    description: "Request a shortlist of pre-screened candidates from our hospitality, construction, railway, agriculture and other talent pools.",
  },
  "/jobs": {
    title: "Overseas Job Openings | RS International",
    description: "Current overseas job openings with visa processing and mobilization support from a Government of India approved recruitment agency.",
  },
  "/clients": {
    title: "Our Clients & Case Studies | RS International",
    description: "Companies across the Middle East, Malaysia and Europe that hire through RS International, and how we delivered for them.",
  },
  "/about": {
    title: "About Us — Licensed Recruitment Agency | RS International",
    description: "Our story, MEA licence, Managing Director’s message, and the vision and values behind RS International.",
  },
  "/how-we-do": {
    title: "Our Recruitment Process in 8 Steps | RS International",
    description: "From consulting and advertising to interviews, medicals, visa, orientation, arrival and feedback: how we recruit for you.",
  },
  "/regions": {
    title: "Regions We Serve | RS International",
    description: "Recruitment for the Middle East, Europe, South East Asia and Russia, with local know-how for every region.",
  },
  "/contact": {
    title: "Contact Us | RS International",
    description: "Call, WhatsApp or email RS International, send an enquiry or upload your résumé. Offices in India, UAE, Malaysia and Bahrain.",
  },
  "/rs-updates": {
    title: "Company News | RS International",
    description: "News and updates from RS International.",
  },
  "/global": {
    title: "Global Industry Updates | RS International",
    description: "Industry news about the overseas projects and markets we recruit for.",
  },
  "/privacy": {
    title: "Privacy Policy | RS International",
    description: "How RS International collects, uses and protects the personal data you share through this website.",
  },
};

export const NOT_FOUND = {
  title: "Page not found | RS International",
  description: "The page you were looking for doesn’t exist.",
};
