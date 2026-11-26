import { useEffect } from "react";
import Hero from "../components/Hero.jsx";
import Sectors from "../components/Sectors.jsx";
import Platform from "../components/Platform.jsx";
import Advantages from "../components/Advantages.jsx";
import Solution from "../components/Solution.jsx";
import Workflow from "../components/Workflow.jsx";
import Clients from "../components/Clients.jsx";
import CaseStudies from "../components/CaseStudies.jsx";
import StrategicAdvantage from "../components/StrategicAdvantage.jsx";
import ImpactMetrics from "../components/ImpactMetrics.jsx";
import Contact from "../components/Contact.jsx";

/**
 * Homepage sections. `form` carries the shared inquiry state (intent, industry, region).
 * Arriving from another page with a hash (e.g. /#clients), wait for fonts and layout
 * to settle, then scroll to that section.
 */
export default function HomePage({ form, setIntent, toForm }) {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    let cancelled = false;
    document.fonts.ready.then(() =>
      setTimeout(() => {
        if (!cancelled) document.getElementById(id)?.scrollIntoView({ block: "start" });
      }, 300)
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const employer = () => setIntent("employer");

  return (
    <>
      <Hero
        onSearch={() => {
          employer();
          toForm();
        }}
      />
      <Sectors onSearch={employer} />
      <Platform onConsult={employer} />
      <Advantages onSearch={employer} />
      <Solution onSearch={employer} />
      <Workflow onContact={employer} />
      <Clients />
      <CaseStudies onConsult={employer} />
      <StrategicAdvantage />
      <ImpactMetrics />
      <Contact {...form} />
    </>
  );
}
