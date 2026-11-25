import { useCallback, useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, Calendar, MapPin, Users } from "lucide-react";
import { SectionHeader } from "../components/ui.jsx";
import PageBanner from "../components/PageBanner.jsx";
import ImpactMetrics from "../components/ImpactMetrics.jsx";
import ShortlistModal from "../components/ShortlistModal.jsx";
import { EMPLOYERS } from "../content.js";

const PROFILE_ICONS = { age: Calendar, gender: Users, base: MapPin };
const FILTERS = [{ id: "all", title: "All" }, ...EMPLOYERS.sectors];

/** One talent pool: photo with "Verified Pool" badge, profile rows, and "Know More". */
function PoolCard({ sector, index, onRequest }) {
  return (
    <article
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 motion-safe:animate-[fade-up_0.5s_ease-out_both]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={sector.image}
          alt={`${sector.title} workforce`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/70 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm backdrop-blur-md">
          <BadgeCheck className="size-3.5" aria-hidden />
          Verified Pool
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold uppercase tracking-wide text-slate-900">{sector.title}</h3>
        <dl className="mt-4 flex-1">
          {EMPLOYERS.profile.map((p) => {
            const Icon = PROFILE_ICONS[p.id];
            return (
              <div key={p.id} className="flex items-start gap-3 border-b border-slate-100 py-3 last:border-b-0">
                <Icon className="mt-0.5 size-4 shrink-0 text-emerald-600" strokeWidth={1.75} aria-hidden />
                <dt className="w-28 shrink-0 text-sm text-slate-500">{p.label}</dt>
                <dd className="text-sm font-medium text-slate-900">{p.value}</dd>
              </div>
            );
          })}
        </dl>
        <button
          type="button"
          onClick={() => onRequest(sector.id)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-medium text-white transition-colors duration-200 hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          aria-label={`${EMPLOYERS.cta}: request a ${sector.title.toLowerCase()} shortlist`}
        >
          {EMPLOYERS.cta}
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </button>
      </div>
    </article>
  );
}

/**
 * /employers — "Choose Your Employee": banner, filterable talent database (bento cards
 * that open the "Request Talent Shortlist" dialog), then the Proven Impact metrics.
 */
export default function EmployersPage() {
  const [filter, setFilter] = useState("all");
  const [requested, setRequested] = useState(null); // sector id whose dialog is open
  const close = useCallback(() => setRequested(null), []);

  const shown = useMemo(
    () => (filter === "all" ? EMPLOYERS.sectors : EMPLOYERS.sectors.filter((s) => s.id === filter)),
    [filter]
  );

  return (
    <>
      <PageBanner crumb="For Employer" tag={EMPLOYERS.tag} title={EMPLOYERS.title} subtitle={EMPLOYERS.subtitle} image={EMPLOYERS.banner} />

      <section id="database" aria-labelledby="database-title" className="wash-white scroll-mt-20 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeader id="database-title" tag={EMPLOYERS.dbTag} title={EMPLOYERS.dbTitle} align="center" />

          {/* Category filter */}
          <div role="group" aria-label="Filter by sector" className="mt-10 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    on
                      ? "border-slate-900 bg-slate-900 text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-500/50 hover:text-slate-900"
                  }`}
                >
                  {f.title}
                  {f.id === "all" && <span className={`ml-1.5 ${on ? "text-white/60" : "text-slate-400"}`}>{EMPLOYERS.sectors.length}</span>}
                </button>
              );
            })}
          </div>

          {/* key on the filter replays the cards' entrance animation on every change */}
          <div key={filter} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {shown.map((s, i) => (
              <PoolCard key={s.id} sector={s} index={i} onRequest={setRequested} />
            ))}
          </div>
        </div>
      </section>

      <ImpactMetrics />

      <ShortlistModal sectorId={requested} onClose={close} onChangeSector={setRequested} />
    </>
  );
}
