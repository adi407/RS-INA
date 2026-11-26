import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "../components/ui.jsx";
import PageBanner from "../components/PageBanner.jsx";
import StoryReader from "../components/StoryReader.jsx";
import MetricsSection from "../components/MetricsSection.jsx";
import { CLIENTS_PAGE } from "../content.js";

const SECTION = "scroll-mt-20 px-6 py-16 lg:px-12 lg:py-24";

/** Bento case-study card: photo, client, opening paragraph and "Read More →". */
function CaseCard({ study, index, onOpen }) {
  return (
    <article
      data-reveal
      style={{ "--d": `${(index % 2) * 120}ms` }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50"
    >
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={study.image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-slate-900 lg:text-2xl">{study.client}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-slate-600">{study.body[0]}</p>
        <button
          type="button"
          onClick={() => onOpen(study.id)}
          aria-label={`${CLIENTS_PAGE.cta}: ${study.client} case study`}
          className="mt-6 inline-flex items-center gap-2 self-start rounded-full font-semibold text-emerald-800 transition-transform duration-300 group-hover:translate-x-1"
        >
          {CLIENTS_PAGE.cta}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </article>
  );
}

/** Partner logo in a frosted card — grayscale and dimmed until hovered. */
function LogoCard({ name, logo, index, className = "" }) {
  return (
    <li
      data-reveal
      style={{ "--d": `${index * 70}ms` }}
      className={`group flex h-28 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-slate-900/5 ${className}`}
    >
      <img
        src={logo}
        alt={name}
        loading="lazy"
        className="max-h-14 w-auto max-w-full transition-transform duration-300 group-hover:scale-105"
      />
    </li>
  );
}

/**
 * /clients — "Our Clients": banner, the four case studies as a 2×2 bento grid (each
 * opens the full story in a reader; ?case=<id> links straight to one), the partner
 * logo wall, and the 2022-2023 recruitment figures.
 */
export default function ClientsPage() {
  const { caseStudies, logos } = CLIENTS_PAGE;
  const [openId, setOpenIdState] = useState(() => {
    const id = new URLSearchParams(window.location.search).get("case");
    return caseStudies.some((c) => c.id === id) ? id : null;
  });
  const setOpenId = useCallback((id) => {
    setOpenIdState(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("case", id);
    else url.searchParams.delete("case");
    window.history.replaceState(null, "", url);
  }, []);
  const close = useCallback(() => setOpenId(null), [setOpenId]);
  const study = caseStudies.find((c) => c.id === openId) || null;

  return (
    <>
      <PageBanner crumb={CLIENTS_PAGE.title} tag={CLIENTS_PAGE.tag} title={CLIENTS_PAGE.title} image={CLIENTS_PAGE.banner} />

      {/* Case studies */}
      <section id="case-studies" aria-labelledby="cases-title" className={`${SECTION} bg-[#F8FAFC]`}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader id="cases-title" tag={CLIENTS_PAGE.caseTag} title={CLIENTS_PAGE.caseTitle} split={2} align="center" />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8">
            {caseStudies.map((c, i) => (
              <CaseCard key={c.id} study={c} index={i} onOpen={setOpenId} />
            ))}
          </div>
        </div>
      </section>

      {/* Partner logos */}
      <section id="partners" aria-labelledby="partners-title" className={`${SECTION} bg-white`}>
        <SectionHeader id="partners-title" tag={CLIENTS_PAGE.logosTag} title={CLIENTS_PAGE.logosTitle} split={1} align="center" />
        <ul aria-label="Our clients" className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4 lg:mt-16 lg:grid-cols-7">
          {logos.map((l, i) => (
            // The odd seventh card spans both columns on phones so the grid stays balanced
            <LogoCard key={l.name} {...l} index={i} className={i === logos.length - 1 ? "col-span-2 md:col-span-1" : ""} />
          ))}
        </ul>
      </section>

      <MetricsSection className="bg-[#F8FAFC]" />

      <StoryReader item={study} list={caseStudies} tag={CLIENTS_PAGE.caseTag} onClose={close} onOpen={setOpenId} />
    </>
  );
}
