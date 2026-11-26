import { useCallback, useState } from "react";
import { ArrowRight, Globe2, MapPin } from "lucide-react";
import { SectionHeader } from "../components/ui.jsx";
import PageBanner from "../components/PageBanner.jsx";
import StoryReader from "../components/StoryReader.jsx";
import { REGIONS_PAGE } from "../content.js";

const SECTION = "scroll-mt-20 px-6 py-16 lg:px-12 lg:py-24";
const regionName = (title) => title.replace(/^Recruitment in /i, "");

/** Region card: photo with a region pill, title, opening paragraph, places and "Read More". */
function RegionCard({ region, index, onOpen }) {
  const places = region.places.slice(0, 4);
  const more = region.places.length - places.length;
  return (
    <article
      data-reveal
      style={{ "--d": `${(index % 2) * 120}ms` }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50"
    >
      <div className="relative h-56 overflow-hidden bg-slate-100">
        <img
          src={region.image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-md">
          <MapPin className="size-3.5 text-emerald-700" aria-hidden />
          {regionName(region.title)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 lg:p-8">
        <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-slate-900 lg:text-2xl">{region.title}</h3>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-slate-600">{region.body[0]}</p>
        {places.length > 0 && (
          <ul aria-label="Places" className="mt-5 flex flex-wrap gap-2">
            {places.map((p) => (
              <li key={p} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {p}
              </li>
            ))}
            {more > 0 && (
              <li>
                <button
                  type="button"
                  onClick={() => onOpen(region.id)}
                  aria-label={`Show all ${region.places.length} places in ${regionName(region.title)}`}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                >
                  +{more} more
                </button>
              </li>
            )}
          </ul>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => onOpen(region.id)}
          aria-label={`${REGIONS_PAGE.cta}: ${region.title}`}
          className="mt-6 inline-flex items-center gap-2 self-start rounded-full font-semibold text-emerald-800 transition-transform duration-300 group-hover:translate-x-1"
        >
          {REGIONS_PAGE.cta}
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>
    </article>
  );
}

/**
 * /regions — "Region We Serve": world-map banner, the intro statement, the four regions
 * (each opens its full story; ?region=<id> links straight to one), then the figures.
 */
export default function RegionsPage() {
  const { regions } = REGIONS_PAGE;
  const [openId, setOpenIdState] = useState(() => {
    const id = new URLSearchParams(window.location.search).get("region");
    return regions.some((r) => r.id === id) ? id : null;
  });
  const setOpenId = useCallback((id) => {
    setOpenIdState(id);
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("region", id);
    else url.searchParams.delete("region");
    window.history.replaceState(null, "", url);
  }, []);
  const close = useCallback(() => setOpenId(null), [setOpenId]);
  const region = regions.find((r) => r.id === openId) || null;

  return (
    <>
      <PageBanner crumb="Region We Serve" tag={REGIONS_PAGE.tag} title={REGIONS_PAGE.title} image={REGIONS_PAGE.banner} />

      <section id="regions" aria-labelledby="regions-title" className={`${SECTION} bg-[#F8FAFC]`}>
        <div className="mx-auto max-w-7xl">
          {/* Intro statement (replaces the old red box) */}
          <div
            data-reveal
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10 lg:p-12"
          >
            <div aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-400 to-emerald-600" />
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <Globe2 className="size-6" strokeWidth={1.5} aria-hidden />
              </span>
              <p className="font-display text-lg font-medium leading-relaxed text-slate-900 sm:text-xl lg:text-2xl lg:leading-relaxed">
                {REGIONS_PAGE.intro}
              </p>
            </div>
          </div>

          <SectionHeader
            id="regions-title"
            tag={REGIONS_PAGE.sectionTag}
            title={REGIONS_PAGE.sectionTitle}
            split={2}
            align="center"
            className="mt-20 lg:mt-24"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:gap-8">
            {regions.map((r, i) => (
              <RegionCard key={r.id} region={r} index={i} onOpen={setOpenId} />
            ))}
          </div>
        </div>
      </section>

      <StoryReader item={region} list={regions} tag="Region We Serve" onClose={close} onOpen={setOpenId} />
    </>
  );
}
