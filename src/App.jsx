import { useState } from "react";
import UtilityBar from "./components/UtilityBar.jsx";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Sectors from "./components/Sectors.jsx";
import Platform from "./components/Platform.jsx";
import Advantages from "./components/Advantages.jsx";
import Solution from "./components/Solution.jsx";
import Workflow from "./components/Workflow.jsx";
import Clients from "./components/Clients.jsx";
import CaseStudies from "./components/CaseStudies.jsx";
import StrategicAdvantage from "./components/StrategicAdvantage.jsx";
import ImpactMetrics from "./components/ImpactMetrics.jsx";
import BigStatement from "./components/BigStatement.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Cursor from "./components/Cursor.jsx";
import useReveal from "./useReveal.js";
import { useSmoothScroll } from "./motion.js";

/**
 * Page layout (RemotePeople-style rhythm):
 *   dark anchor (utility bar, nav, hero) → white / slate-50 alternating sections → dark footer.
 *
 * Shared state:
 *  - intent: "employer" | "candidate" — set by links, CTAs and sector cards; pre-selects the form toggle
 *  - industry / region: chosen in the hero search; pre-fill the inquiry form
 */
export default function App() {
  const [industry, setIndustry] = useState("construction");
  const [region, setRegion] = useState("middle-east");
  const [intent, setIntent] = useState("employer");

  useReveal();
  useSmoothScroll();

  const toForm =() => document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const hireFromSector = (id) => {
    setIndustry(id);
    setIntent("employer");
  };

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
        <Hero
          onSearch={() => {
            setIntent("employer");
            toForm();
          }}
        />
        <Sectors onHire={hireFromSector} />
        <Platform onConsult={() => setIntent("employer")} />
        <Advantages onSearch={() => setIntent("employer")} />
        <Solution onSearch={() => setIntent("employer")} />
        <Workflow onContact={() => setIntent("employer")} />
        <Clients />
        <CaseStudies onConsult={() => setIntent("employer")} />
        <StrategicAdvantage />
        <ImpactMetrics />
        <BigStatement />
        <Contact intent={intent} setIntent={setIntent} industry={industry} setIndustry={setIndustry} region={region} setRegion={setRegion} />
      </main>
      <Footer onIntent={setIntent} />
      <BackToTop />
      <Cursor />
    </>
  );
}
