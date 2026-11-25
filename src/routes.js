/**
 * Minimal routing for a few static pages (no router library needed).
 * Each page is a real URL (e.g. /employers); Vite's dev server and the Vercel
 * rewrite in vercel.json both serve index.html for it.
 */
export const PATH = window.location.pathname.replace(/\/+$/, "") || "/";
export const isHome = PATH === "/";

/**
 * In-page anchors ("#clients", "#contact"…) live on the homepage. From an inner
 * page they need the homepage prefix ("/#clients") so the click goes back home.
 */
export const linkTo = (href) => (href && href.startsWith("#") && !isHome ? `/${href}` : href);
