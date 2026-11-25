import { useCallback, useMemo, useState } from "react";
import { ArrowRight, Briefcase, ChevronDown, Clock, MapPin, Search, SearchX, X } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import JobDrawer from "../components/JobDrawer.jsx";
import { JOBS } from "../content.js";

const norm = (s) => s.toLowerCase().trim();
const NONE = { q: "", category: "", type: "", location: "" };

/** Native select styled to match the dock (accessible label, chevron overlay). */
function FilterSelect({ id, value, onChange, filter, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {filter.label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 w-full cursor-pointer appearance-none rounded-xl border bg-white pl-4 pr-10 text-sm font-medium outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 ${
          value ? "border-emerald-500/60 text-slate-900" : "border-slate-200 text-slate-600"
        }`}
      >
        <option value="">{filter.label}</option>
        {filter.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
    </div>
  );
}

/** Horizontal job card: title + metadata pills on the left, "More Details" on the right. */
function JobCard({ job, index, onOpen }) {
  const pill = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide";
  return (
    <li
      className="group flex flex-col justify-between gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-200 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-slate-900/5 md:flex-row md:items-center lg:p-7 motion-safe:animate-[fade-up_0.45s_ease-out_both]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="min-w-0">
        <h3 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-600">{job.title}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`${pill} bg-slate-100 text-slate-700`}>
            <Briefcase className="size-3.5" aria-hidden />
            {job.category}
          </span>
          <span className={`${pill} bg-emerald-50 text-emerald-700`}>
            <MapPin className="size-3.5" aria-hidden />
            {job.location}
          </span>
          <span className={`${pill} bg-sky-50 text-sky-700`}>
            <Clock className="size-3.5" aria-hidden />
            {job.type}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onOpen(job.id)}
        aria-label={`${JOBS.cta}: ${job.title}`}
        className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white shadow-md shadow-emerald-950/10 transition-colors hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 md:self-auto"
      >
        {JOBS.cta}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
      </button>
    </li>
  );
}

/**
 * /jobs — "Job Openings": banner, a floating search + filter dock (instant filtering,
 * active-filter count, clear), job cards, and a slide-over drawer with the full
 * breakdown, licence compliance and an "Apply for Position" form.
 */
export default function JobsPage() {
  const [f, setF] = useState(NONE);
  // ?job=<id> deep-links straight to a job's details (shareable links); kept in sync below
  const [openId, setOpenIdState] = useState(() => {
    const id = new URLSearchParams(window.location.search).get("job");
    return JOBS.listings.some((j) => j.id === id) ? id : null;
  });
  const setOpenId = useCallback((id) => {
    setOpenIdState(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("job", id);
    else url.searchParams.delete("job");
    window.history.replaceState(null, "", url);
  }, []);
  const close = useCallback(() => setOpenId(null), [setOpenId]);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));

  const results = useMemo(() => {
    const q = norm(f.q);
    return JOBS.listings.filter(
      (j) =>
        (!q || norm(`${j.title} ${j.category} ${j.location} ${j.points.join(" ")} ${j.summary || ""}`).includes(q)) &&
        (!f.category || norm(j.category) === norm(f.category)) &&
        (!f.type || norm(j.type) === norm(f.type)) &&
        (!f.location || norm(j.location) === norm(f.location))
    );
  }, [f]);

  const active = ["category", "type", "location"].filter((k) => f[k]).length + (f.q.trim() ? 1 : 0);
  const job = JOBS.listings.find((j) => j.id === openId) || null;

  return (
    <>
      <PageBanner crumb="Jobs" tag={JOBS.tag} title={JOBS.title} subtitle={JOBS.subtitle} image="/media/hero-cities-poster.jpg" />

      <section aria-label="Job board" className="bg-[#F8FAFC] px-6 py-16 lg:px-12 lg:py-20">
        {/* Floating filter dock */}
        <div className="relative z-10 mx-auto -mt-20 mb-12 max-w-6xl rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-slate-900/5">
          <div role="search" className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="relative md:col-span-12 lg:col-span-6">
              <label htmlFor="job-search" className="sr-only">
                Search jobs
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                id="job-search"
                type="search"
                value={f.q}
                onChange={(e) => set("q")(e.target.value)}
                placeholder={JOBS.searchPlaceholder}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/15"
              />
            </div>
            <FilterSelect id="f-category" value={f.category} onChange={set("category")} filter={JOBS.filters.category} className="md:col-span-4 lg:col-span-2" />
            <FilterSelect id="f-type" value={f.type} onChange={set("type")} filter={JOBS.filters.type} className="md:col-span-4 lg:col-span-2" />
            <FilterSelect id="f-location" value={f.location} onChange={set("location")} filter={JOBS.filters.location} className="md:col-span-4 lg:col-span-2" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 px-1 pt-3 text-sm">
            <p className="text-slate-500" aria-live="polite">
              <span className="font-semibold text-slate-900">{results.length}</span> open {results.length === 1 ? "position" : "positions"}
              {active > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  {active} {active === 1 ? "filter" : "filters"} active
                </span>
              )}
            </p>
            {active > 0 && (
              <button
                type="button"
                onClick={() => setF(NONE)}
                className="inline-flex items-center gap-1 font-semibold text-slate-600 transition-colors hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <X className="size-4" aria-hidden />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Listings */}
        {results.length > 0 ? (
          <ul key={JSON.stringify(f)} className="mx-auto max-w-6xl space-y-4">
            {results.map((j, i) => (
              <JobCard key={j.id} job={j} index={i} onOpen={setOpenId} />
            ))}
          </ul>
        ) : (
          <div className="mx-auto flex max-w-6xl flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <SearchX className="size-10 text-slate-400" strokeWidth={1.5} aria-hidden />
            <p className="mt-4 font-semibold text-slate-900">No openings match your search</p>
            <p className="mt-1 text-sm text-slate-500">Try a different keyword or clear the filters.</p>
            <button
              type="button"
              onClick={() => setF(NONE)}
              className="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      <JobDrawer job={job} onClose={close} />
    </>
  );
}
