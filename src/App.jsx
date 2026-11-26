import { useEffect, useState } from "react";
import UtilityBar from "./components/UtilityBar.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import MobileActionBar from "./components/MobileActionBar.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import HomePage from "./pages/HomePage.jsx";
import EmployersPage from "./pages/EmployersPage.jsx";
import JobsPage from "./pages/JobsPage.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ProcessPage from "./pages/ProcessPage.jsx";
import RegionsPage from "./pages/RegionsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import UpdatesPage from "./pages/UpdatesPage.jsx";
import GlobalPage from "./pages/GlobalPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import useReveal from "./useReveal.js";
import { useSmoothScroll } from "./motion.js";
import { PATH } from "./routes.js";
import { NOT_FOUND, OG_IMAGE, PAGES, SITE_URL } from "./meta.js";

/** Pages by URL. Anything else gets the 404 page. */
const ROUTES = {
  "/employers": EmployersPage,
  "/jobs": JobsPage,
  "/clients": ClientsPage,
  "/about": AboutPage,
  "/how-we-do": ProcessPage,
  "/regions": RegionsPage,
  "/contact": ContactPage,
  "/rs-updates": UpdatesPage,
  "/global": GlobalPage,
  "/privacy": PrivacyPage,
};

/** Feeds the pointer position to cards with the .spotlight hover glow (desktop mice only). */
function useSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (e) => {
      const el = e.target.closest?.(".spotlight");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
}

/** Sets <title>, description, canonical and social tags for the current page. */
function usePageMeta() {
  useEffect(() => {
    const known = PATH === "/" || PATH in ROUTES;
    const meta = known ? PAGES[PATH] : NOT_FOUND;
    document.title = meta.title;
    const tag = (attr, key, value) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };
    tag("name", "description", meta.description);
    tag("property", "og:title", meta.title);
    tag("property", "og:description", meta.description);
    tag("property", "og:url", SITE_URL + PATH);
    tag("property", "og:image", SITE_URL + OG_IMAGE);
    if (!known) tag("name", "robots", "noindex");
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = SITE_URL + (PATH === "/" ? "/" : PATH);
  }, []);
}

/**
 * Shared layout (contact strip, navbar, footer) around one page, chosen by URL.
 * Shared state for the homepage inquiry form:
 *  - intent: "employer" | "candidate" — pre-selects the form toggle
 *  - industry / region: pre-fill the form
 */
export default function App() {
  const [industry, setIndustry] = useState("construction");
  const [region, setRegion] = useState("middle-east");
  const [intent, setIntent] = useState("employer");

  useReveal();
  useSmoothScroll();
  usePageMeta();
  useSpotlight();

  const toForm = () => document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const form = { intent, setIntent, industry, setIndustry, region, setRegion };
  const Page = PATH === "/" ? null : ROUTES[PATH] || NotFoundPage;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-emerald-700 focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      {(PATH === "/how-we-do" || PATH === "/about" || PATH === "/privacy") && <ScrollProgress />}
      <UtilityBar />
      <Navbar />
      {/* Raised layer: on large screens it scrolls up off the sticky footer beneath it */}
      <main id="main" tabIndex={-1} className="relative z-10 bg-white shadow-[0_40px_80px_-24px_rgba(2,6,23,0.55)] outline-none">
        {Page ? <Page /> : <HomePage form={form} setIntent={setIntent} toForm={toForm} />}
      </main>
      <Footer onIntent={setIntent} />
      <BackToTop />
      <MobileActionBar />
    </>
  );
}
