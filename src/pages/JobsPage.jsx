import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Briefcase, CalendarDays, Clock, FileText, MapPin, Search, SearchX, Wallet, X } from "lucide-react";
import PageBanner from "../components/PageBanner.jsx";
import JobDrawer from "../components/JobDrawer.jsx";
import { BTN_GHOST, BTN_PRIMARY } from "../components/ui.jsx";
import FilterDropdown from "../components/FilterDropdown.jsx";
import { JOBS } from "../content.js";
import { Flip, gsap, reducedMotion } from "../motion.js";

const norm = (s) => s.toLowerCase().trim();
// Pill text in one consistent case (the old site's data mixes "DUBAI" and "Full Time")
const title = (s) => s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
const NONE = { q: "", category: "", type: "", location: "" };
const STALE_DAYS = 180;
const ageInDays = (posted) => (Date.now() - new Date(posted).getTime()) / 86400000;

/** Newest first */
const LISTINGS = [...JOBS.listings].sort((a, b) => new Date(b.posted) - new Date(a.posted));

/** Horizontal job card: title, soft metadata pills and posted date on the left, "More Details" on the right. */
function JobCard({ job, onOpen }) {
  const pill = "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800";
  const stale = ageInDays(job.posted) > STALE_DAYS;
  return (
    <li
      data-flip-id={job.id}
      className="spotlight group flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-emerald-600/50 hover:shadow-xl hover:shadow-slate-900/5 md:flex-row md:items-center lg:p-7"
    >
      <div className="min-w-0">
        <h3 className="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-emerald-800">{job.title}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={pill}>
            <Briefcase className="size-3.5 text-emerald-700" aria-hidden />
            {title(job.category)}
          </span>
          <span className={pill}>
            <MapPin className="size-3.5 text-emerald-700" aria-hidden />
            {title(job.location)}
          </span>
          <span className={pill}>
            <Clock className="size-3.5 text-emerald-700" aria-hidden />
            {title(job.type)}
          </span>
          {job.salary && (
            <span className={pill}>
              <Wallet className="size-3.5 text-emerald-700" aria-hidden />
              {job.salary}
            </span>
          )}
        </div>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <CalendarDays className="size-4" aria-hidden />
          Posted {job.posted}
          {stale && <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">Older listing — ask us if it’s still open</span>}
        </p>
      </div>
      <button type="button" onClick={() => onOpen(job.id)} aria-label={`${JOBS.cta}: ${job.title}`} className={`${BTN_PRIMARY} shrink-0 self-start md:self-auto`}>
        {JOBS.cta}
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
      </button>
    </li>
  );
}

export default function JobsPage() {
  const [f, setF] = useState(NONE);
  const [openId, setOpenIdState] = useState(() => {
    const id = new URLSearchParams(window.location.search).get("job");
    return LISTINGS.some((j) => j.id === id) ? id : null;
  });
  const setOpenId = useCallback((id) => {
    setOpenIdState(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("job", id);
    else url.searchParams.delete("job");
    window.history.replaceState(null, "", url);
  }, []);
  const close = useCallback(() => setOpenId(null), [setOpenId]);

  const list = useRef(null);
  const flipState = useRef(null);
  // Remaining jobs slide into place, new matches fade in — no full re-render while typing
  const set = (k) => (v) => {
    if (!reducedMotion() && list.current) flipState.current = Flip.getState(list.current.children);
    setF((s) => ({ ...s, [k]: v }));
  };
  const clear = () => {
    if (!reducedMotion() && list.current) flipState.current = Flip.getState(list.current.children);
    setF(NONE);
  };

  const results = useMemo(() => {
    const q = norm(f.q);
    return LISTINGS.filter(
      (j) =>
        (!q || norm(`${j.title} ${j.category} ${j.location} ${j.points.join(" ")} ${j.summary || ""}`).includes(q)) &&
        (!f.category || norm(j.category) === norm(f.category)) &&
        (!f.type || norm(j.type) === norm(f.type)) &&
        (!f.location || norm(j.location) === norm(f.location))
    );
  }, [f]);

  useLayoutEffect(() => {
    if (!flipState.current || !list.current) {
      flipState.current = null;
      return;
    }
    Flip.from(flipState.current, {
      targets: list.current.children,
      duration: 0.4,
      ease: "power2.inOut",
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }),
    });
    flipState.current = null;
  }, [results]);

  const active = ["category", "type", "location"].filter((k) => f[k]).length + (f.q.trim() ? 1 : 0);
  const job = LISTINGS.find((j) => j.id === openId) || null;

  return (
    <>
      <PageBanner crumb="Jobs" tag={JOBS.tag} title={JOBS.title} subtitle={JOBS.subtitle} image="/media/hero-cities-poster.jpg" docked />

      <section aria-labelledby="board-title" className="bg-[#F8FAFC] px-6 py-16 lg:px-12 lg:py-20">
        <h2 id="board-title" className="sr-only">
          Open positions
        </h2>
        {/* Floating filter dock: overlaps the banner's empty lower band (banner is `docked`), clear of the copy */}
        <div className="relative z-20 mx-auto -mt-[8.5rem] mb-12 max-w-6xl rounded-2xl border border-white/60 bg-white/95 p-4 shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/5 backdrop-blur-xl sm:p-5">
          <div role="search" className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="relative md:col-span-12 lg:col-span-6">
              <label htmlFor="job-search" className="sr-only">
                Search jobs
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-600" aria-hidden />
              <input
                id="job-search"
                type="search"
                value={f.q}
                onChange={(e) => set("q")(e.target.value)}
                placeholder={JOBS.searchPlaceholder}
                className="h-12 w-full rounded-xl border border-slate-500 bg-white pl-12 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/50"
              />
            </div>
            <FilterDropdown value={f.category} onChange={set("category")} placeholder={JOBS.filters.category.label} options={JOBS.filters.category.options} className="md:col-span-4 lg:col-span-2" />
            <FilterDropdown value={f.type} onChange={set("type")} placeholder={JOBS.filters.type.label} options={JOBS.filters.type.options} className="md:col-span-4 lg:col-span-2" />
            <FilterDropdown value={f.location} onChange={set("location")} placeholder={JOBS.filters.location.label} options={JOBS.filters.location.options} className="md:col-span-4 lg:col-span-2" />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 px-1 pt-3 text-sm">
            <p className="text-slate-700" aria-live="polite">
              <span className="font-semibold text-slate-900">{results.length}</span> open {results.length === 1 ? "position" : "positions"}
              {active > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                  {active} {active === 1 ? "filter" : "filters"} active
                </span>
              )}
            </p>
            {active > 0 && (
              <button type="button" onClick={clear} className="inline-flex min-h-11 items-center gap-1 font-semibold text-slate-700 transition-colors hover:text-emerald-800">
                <X className="size-4" aria-hidden />
                Clear all
              </button>
            )}
          </div>
        </div>

        {results.length > 0 ? (
          <ul ref={list} className="mx-auto max-w-6xl space-y-4">
            {results.map((j) => (
              <JobCard key={j.id} job={j} onOpen={setOpenId} />
            ))}
          </ul>
        ) : (
          <div className="mx-auto flex max-w-6xl flex-col items-center rounded-2xl border border-dashed border-slate-400 bg-white px-6 py-16 text-center">
            <SearchX className="size-10 text-slate-500" strokeWidth={1.5} aria-hidden />
            <p className="mt-4 font-semibold text-slate-900">No openings match your search</p>
            <p className="mt-1 text-sm text-slate-600">Try a different keyword, clear the filters, or send us your CV for future roles.</p>
            <button type="button" onClick={clear} className={`${BTN_GHOST} mt-6`}>
              Clear all filters
            </button>
          </div>
        )}

        {/* Nothing fits? Keep the candidate */}
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl bg-[#0A0F1D] p-8 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-xl font-bold">Don’t see the right job?</h2>
            <p className="mt-1 text-slate-300">Send us your CV and we’ll contact you when a matching role opens.</p>
          </div>
          <a href="/contact?for=jobseeker" className={`${BTN_PRIMARY} shrink-0`}>
            <FileText className="size-4" aria-hidden />
            Send your CV
          </a>
        </div>
      </section>

      <JobDrawer job={job} onClose={close} />
    </>
  );
}
