import { BadgeCheck, Eye, FileText, Landmark, Quote, ShieldCheck, Target } from "lucide-react";
import { SectionHeader, SlashBreak } from "../components/ui.jsx";
import PageBanner from "../components/PageBanner.jsx";
import MetricsSection from "../components/MetricsSection.jsx";
import { ABOUT, ABOUT_PAGE, LICENSE } from "../content.js";

const SECTION = "scroll-mt-20 px-6 py-16 lg:px-12 lg:py-24";
const PILLAR_ICONS = { vision: Eye, mission: Target, values: ShieldCheck };

/** Frosted compliance card: MEA licence with a verified badge and the brochure link. */
function LicenceCard({ className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur-xl sm:p-8 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
          <Landmark className="size-6" strokeWidth={1.5} aria-hidden />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
          <BadgeCheck className="size-3.5" aria-hidden />
          Govt. of India Approved
        </span>
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-slate-500">Our License No</p>
      <p className="mt-1.5 font-display text-lg font-bold tracking-tight text-slate-900">
        <SlashBreak text={LICENSE} />
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{ABOUT.approval}</p>
      <a
        href={ABOUT_PAGE.brochure}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
      >
        <FileText className="size-4" aria-hidden />
        View Brochure
        <span className="sr-only">(PDF, opens in a new tab)</span>
      </a>
    </div>
  );
}

/**
 * /about — "About Company": banner, Our Story (with "Read More" for the rest of the
 * story) beside the team photo and licence card, the Managing Director's message,
 * Vision / Mission / Values cards, then the 2022-2023 recruitment figures.
 */
export default function AboutPage() {
  const { director } = ABOUT_PAGE;

  return (
    <>
      <PageBanner crumb={ABOUT_PAGE.title} tag={ABOUT_PAGE.tag} title={ABOUT_PAGE.title} image={ABOUT_PAGE.banner} />

      {/* Our Story */}
      <section id="story" aria-labelledby="story-title" className={`${SECTION} bg-[#F8FAFC]`}>
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeader id="story-title" tag={ABOUT_PAGE.storyTag} title={ABOUT_PAGE.storyTitle} split={1} />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-600 lg:text-[17px]">
              {ABOUT_PAGE.story.map((p, i) => (
                <p key={p.slice(0, 24)} className={i === 0 ? "text-lg font-medium leading-relaxed text-slate-900 lg:text-xl" : ""}>
                  {p}
                </p>
              ))}
              {ABOUT_PAGE.storyMore.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>

          {/* Photo with the licence card floating over its lower edge */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div data-reveal className="overflow-hidden rounded-3xl bg-slate-200 shadow-xl shadow-slate-900/10">
                <img src={ABOUT_PAGE.photo} alt="R.S. International engineers reviewing site plans" className="aspect-[4/3] w-full object-cover" />
              </div>
              <LicenceCard className="relative mx-4 -mt-20 sm:mx-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Managing Director's message */}
      <section id="director" aria-labelledby="director-title" className={`${SECTION} bg-white`}>
        <figure
          data-reveal
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-2xl sm:p-10 lg:p-12"
        >
          {/* Soft emerald glow + oversized quote mark for depth */}
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-emerald-500/15 blur-3xl" />
          <Quote aria-hidden className="pointer-events-none absolute right-8 top-8 size-28 text-white/[0.04] lg:size-40" strokeWidth={1} />

          <div className="relative grid gap-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14">
            <div className="mx-auto w-48 shrink-0 sm:w-56 lg:mx-0 lg:w-64">
              <div className="overflow-hidden rounded-2xl ring-1 ring-white/10">
                <img src={director.photo} alt={`${director.name}, ${director.role}`} loading="lazy" className="aspect-[578/470] w-full object-cover object-top" /* crops the red band at the photo's foot */ />
              </div>
            </div>
            <div>
              <h2 id="director-title" className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                {director.tag}
              </h2>
              <blockquote className="mt-5">
                <Quote aria-hidden className="mb-3 size-8 text-emerald-400" strokeWidth={1.5} />
                <p className="text-lg italic leading-relaxed text-slate-200 lg:text-xl lg:leading-relaxed">{director.quote}</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                <span className="h-px w-8 bg-emerald-400" aria-hidden />
                <span>
                  <span className="block font-display text-lg font-bold tracking-wide text-white">{director.name}</span>
                  <span className="text-sm text-slate-300">{director.role}, R.S. International</span>
                </span>
              </figcaption>
            </div>
          </div>
        </figure>
      </section>

      {/* Vision, Mission & Values */}
      <section id="values" aria-labelledby="values-title" className={`${SECTION} bg-[#F8FAFC]`}>
        <div className="mx-auto max-w-7xl">
          <SectionHeader id="values-title" tag={ABOUT_PAGE.valuesTag} title={ABOUT_PAGE.valuesTitle} split={2} align="center" />
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8">
            {ABOUT_PAGE.pillars.map((p, i) => {
              const Icon = PILLAR_ICONS[p.id];
              return (
                <article
                  key={p.id}
                  data-reveal
                  style={{ "--d": `${i * 110}ms` }}
                  className="group rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition-colors duration-300 group-hover:bg-emerald-700 group-hover:text-white">
                    <Icon className="size-[22px]" strokeWidth={1.5} aria-hidden />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-slate-900">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{p.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <MetricsSection className="bg-white" />
    </>
  );
}
