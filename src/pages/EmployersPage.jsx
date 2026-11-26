import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Calendar, MapPin, Users } from "lucide-react";
import { BTN_PRIMARY, SectionHeader } from "../components/ui.jsx";
import PageBanner from "../components/PageBanner.jsx";
import ShortlistModal from "../components/ShortlistModal.jsx";
import { EMPLOYERS } from "../content.js";
import { Flip, gsap, reducedMotion } from "../motion.js";

const PROFILE_ICONS = { age: Calendar, gender: Users, base: MapPin };
const FILTERS = [{ id: "all", title: "All" }, ...EMPLOYERS.sectors];

/** Talent-pool card: photo, sector, and a button that opens the shortlist request. */
function PoolCard({ sector, onRequest }) {
  return (
    <article
      data-flip-id={sector.id}
      className="spotlight group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-emerald-600/50"
    >
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={sector.image}
          alt={`${sector.title} workers`}
          loading="lazy"
          width="1200"
          height="800"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm">
          <BadgeCheck className="size-3.5" aria-hidden />
          Pre-screened pool
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold tracking-tight text-slate-900">{sector.title}</h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-700">
          Skilled and semi-skilled {sector.title.toLowerCase()} candidates, screened and ready for interview.
        </p>
        <button type="button" onClick={() => onRequest(sector.id)} className={`${BTN_PRIMARY} mt-5 w-full`}>
          Request {sector.title.toLowerCase()} shortlist
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </button>
      </div>
    </article>
  );
}

export default function EmployersPage() {
  // /employers?sector=hospitality (from the homepage sector cards) opens pre-filtered
  const [filter, setFilter] = useState(() => {
    const s = new URLSearchParams(window.location.search).get("sector");
    return EMPLOYERS.sectors.some((x) => x.id === s) ? s : "all";
  });
  const [requested, setRequested] = useState(null);
  const close = useCallback(() => setRequested(null), []);
  const grid = useRef(null);
  const flipState = useRef(null);

  const shown = useMemo(() => (filter === "all" ? EMPLOYERS.sectors : EMPLOYERS.sectors.filter((s) => s.id === filter)), [filter]);

  // Cards that stay slide to their new place; new ones fade in (no full re-render flash)
  const choose = (id) => {
    if (!reducedMotion() && grid.current) flipState.current = Flip.getState(grid.current.children);
    setFilter(id);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("sector");
    else url.searchParams.set("sector", id);
    window.history.replaceState(null, "", url);
  };
  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      targets: grid.current.children,
      duration: 0.45,
      ease: "power2.inOut",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power1.out" }),
    });
    flipState.current = null;
  }, [filter]);

  return (
    <>
      <PageBanner crumb="For Employer" tag={EMPLOYERS.tag} title={EMPLOYERS.title} subtitle={EMPLOYERS.subtitle} image={EMPLOYERS.banner} />

      <section id="database" aria-labelledby="database-title" className="wash-white scroll-mt-20 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader id="database-title" tag={EMPLOYERS.dbTag} title={EMPLOYERS.dbTitle} align="center" />

          {/* What every pool has in common — shown once instead of on every card */}
          <dl className="mx-auto mt-10 grid max-w-4xl gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
            {EMPLOYERS.profile.map((p) => {
              const Icon = PROFILE_ICONS[p.id];
              return (
                <div key={p.id} className="grid grid-cols-[auto_1fr] items-center gap-x-3 rounded-xl bg-white px-4 py-3">
                  <dt className="contents text-xs font-medium text-slate-600">
                    <Icon className="row-span-2 size-5 shrink-0 text-emerald-700" strokeWidth={1.75} aria-hidden />
                    <span>{p.label}</span>
                  </dt>
                  <dd className="col-start-2 text-sm font-semibold text-slate-900">{p.value}</dd>
                </div>
              );
            })}
          </dl>

          <div role="group" aria-label="Filter by sector" className="mt-10 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(f.id)}
                  className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-all duration-200 ${
                    on ? "border-slate-900 bg-slate-900 text-white shadow-md" : "border-slate-400 bg-white text-slate-700 hover:border-emerald-700 hover:text-slate-900"
                  }`}
                >
                  {f.title}
                  {f.id === "all" && <span className={`ml-1.5 ${on ? "text-white/80" : "text-slate-600"}`}>{EMPLOYERS.sectors.length}</span>}
                </button>
              );
            })}
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {shown.length} {shown.length === 1 ? "talent pool" : "talent pools"}
          </p>

          <div ref={grid} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((s) => (
              <PoolCard key={s.id} sector={s} onRequest={setRequested} />
            ))}
          </div>
        </div>
      </section>

      <ShortlistModal sectorId={requested} onClose={close} />
    </>
  );
}
