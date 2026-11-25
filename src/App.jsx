import { useState } from "react";
import UtilityBar from "./components/UtilityBar.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Cursor from "./components/Cursor.jsx";
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
import useReveal from "./useReveal.js";
import { useSmoothScroll } from "./motion.js";
import { PATH } from "./routes.js";

/**
 * Shared layout (utility bar, navbar, footer) around one page, chosen by URL:
 *   /           → homepage (RemotePeople-style rhythm: dark hero → light sections → dark footer)
 *   /employers  → "Choose Your Employee" talent database
 *   /jobs       → "Job Openings" board
 *   /clients    → "Our Clients": case studies, partner logos, recruitment metrics
 *   /about      → "About Company": story, licence, director's message, vision/mission/values
 *   /how-we-do  → "How We Do It?": the 8-step recruitment methodology timeline
 *   /regions    → "Region We Serve": the four regions, each opening its full story
 *   /contact    → "Contact Us": company / job-seeker forms, offices, figures
 *   /rs-updates → "RS Updates": company news stories
 *   /global     → "Global Updates": industry news stories
 *
 * Shared state:
 *  - intent: "employer" | "candidate" — set by links, CTAs and sector cards; pre-selects the form toggle
 *  - industry / region: pre-fill the homepage inquiry form
 */
export default function App() {
  const [industry, setIndustry] = useState("construction");
  const [region, setRegion] = useState("middle-east");
  const [intent, setIntent] = useState("employer");

  useReveal();
  useSmoothScroll();

  const toForm = () => document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const hireFromSector = (id) => {
    setIndustry(id);
    setIntent("employer");
  };

  const form = { intent, setIntent, industry, setIndustry, region, setRegion };

  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <UtilityBar />
      <Navbar onIntent={setIntent} />
      {/* Raised layer: on large screens it scrolls up off the sticky footer beneath it */}
      <main className="relative z-10 bg-white shadow-[0_40px_80px_-24px_rgba(2,6,23,0.55)]">
        {PATH === "/employers" ? (
          <EmployersPage />
        ) : PATH === "/jobs" ? (
          <JobsPage />
        ) : PATH === "/clients" ? (
          <ClientsPage />
        ) : PATH === "/about" ? (
          <AboutPage />
        ) : PATH === "/how-we-do" ? (
          <ProcessPage />
        ) : PATH === "/regions" ? (
          <RegionsPage />
        ) : PATH === "/contact" ? (
          <ContactPage />
        ) : PATH === "/rs-updates" ? (
          <UpdatesPage />
        ) : PATH === "/global" ? (
          <GlobalPage />
        ) : (
          <HomePage form={form} setIntent={setIntent} hireFromSector={hireFromSector} toForm={toForm} />
        )}
      </main>
      <Footer onIntent={setIntent} />
      <BackToTop />
      <Cursor />
    </>
  );
}
