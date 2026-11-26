import { useLayoutEffect, useRef } from "react";
import { Megaphone, MessageSquareHeart, MessagesSquare, PlaneLanding, Presentation, Stamp, Stethoscope, UserCheck } from "lucide-react";
import { SectionHeader } from "../components/ui.jsx";
import PageBanner from "../components/PageBanner.jsx";
import { gsap, ScrollTrigger, reducedMotion } from "../motion.js";
import { PROCESS_PAGE } from "../content.js";

const ICONS = {
  consulting: MessagesSquare,
  advertising: Megaphone,
  interview: UserCheck,
  medical: Stethoscope,
  visa: Stamp,
  orientation: Presentation,
  arrival: PlaneLanding,
  feedback: MessageSquareHeart,
};

const pad = (n) => String(n).padStart(2, "0");

/**
 * One milestone. Desktop: card and photo trade sides each step around the centre spine.
 * Phone: the spine runs down the left, with the photo inside the card.
 */
function Step({ step, index }) {
  const Icon = ICONS[step.id];
  const flip = index % 2 === 1; // odd steps: photo left, card right
  const num = pad(index + 1);

  return (
    <li id={`step-${step.id}`} className="relative scroll-mt-28 grid grid-cols-[3rem_1fr] gap-x-5 lg:grid-cols-[1fr_5rem_1fr] lg:gap-x-0">
      {/* Node on the spine: lights up (data-on) as the progress line reaches it */}
      <div className="col-start-1 row-start-1 flex justify-center lg:col-start-2">
        <span
          data-node
          className="sticky top-32 z-10 grid size-12 place-items-center rounded-full border border-slate-200 bg-white font-display text-sm font-extrabold text-slate-600 shadow-sm transition-all duration-500 data-[on=true]:border-emerald-500 data-[on=true]:bg-emerald-700 data-[on=true]:text-white data-[on=true]:shadow-[0_0_0_6px_rgba(16,185,129,0.15),0_10px_30px_-6px_rgba(16,185,129,0.6)] lg:size-14 lg:text-base"
        >
          {num}
        </span>
      </div>

      {/* Card */}
      <article
        data-reveal
        className={`group col-start-2 row-start-1 overflow-hidden rounded-3xl lg:self-center border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 ${
          flip ? "lg:col-start-3" : "lg:col-start-1"
        }`}
      >
        <img src={step.image} alt="" loading="lazy" className="h-48 w-full object-cover sm:h-56 lg:hidden" />
        <div className="p-7 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <span className="grid size-12 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 transition-colors duration-300 group-hover:bg-emerald-700 group-hover:text-white">
              <Icon className="size-[22px]" strokeWidth={1.5} aria-hidden />
            </span>
            <span className="font-display text-2xl font-extrabold text-emerald-700 [text-shadow:0_0_24px_rgba(16,185,129,0.35)]" aria-hidden>
              {num}
            </span>
          </div>
          <h3 className="mt-6 font-display text-xl font-bold leading-snug tracking-tight text-slate-900 lg:text-2xl">
            <span className="sr-only">Step {index + 1}: </span>
            {step.title}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{step.body}</p>
        </div>
      </article>

      {/* Photo (desktop only — on phones it sits inside the card) */}
      <div
        data-reveal
        style={{ "--d": "120ms" }}
        className={`row-start-1 hidden self-center lg:block ${flip ? "lg:col-start-1" : "lg:col-start-3"}`}
      >
        <div className={`overflow-hidden rounded-3xl shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 ${flip ? "mr-4 xl:mr-8" : "ml-4 xl:ml-8"}`}>
          <img src={step.image} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out hover:scale-105" />
        </div>
      </div>
    </li>
  );
}

/**
 * /how-we-do — "How We Do It?": banner, the eight-step methodology as a zigzag timeline
 * whose spine fills emerald with the scroll (each step's node lights as it's reached),
 * then the 2022-2023 recruitment figures.
 */
export default function ProcessPage() {
  const listRef = useRef(null);
  const fillRef = useRef(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const nodes = list.querySelectorAll("[data-node]");
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 0.4 } }
      );
      nodes.forEach((node) =>
        ScrollTrigger.create({
          trigger: node,
          start: "top 60%",
          onEnter: () => (node.dataset.on = "true"),
          onLeaveBack: () => (node.dataset.on = "false"),
        })
      );
    });
    // Reduced motion: the finished state, no scroll effects
    if (reducedMotion()) {
      gsap.set(fillRef.current, { scaleY: 1 });
      nodes.forEach((n) => (n.dataset.on = "true"));
    }
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(fillRef.current, { scaleY: 1 });
      nodes.forEach((n) => (n.dataset.on = "true"));
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <PageBanner crumb="How We Do" tag={PROCESS_PAGE.tag} title={PROCESS_PAGE.title} image={PROCESS_PAGE.banner} />

      <section id="methodology" aria-labelledby="method-title" className="scroll-mt-20 bg-[#F8FAFC] px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            id="method-title"
            tag={PROCESS_PAGE.sectionTag}
            title={PROCESS_PAGE.sectionTitle}
            split={1}
            subtitle={PROCESS_PAGE.subtitle}
            align="center"
          />
          {/* Overview: all 8 steps at a glance, each jumping to its detail */}
          <nav aria-label="Steps" className="mx-auto mt-10 max-w-5xl">
            <ol className="flex flex-wrap justify-center gap-2">
              {PROCESS_PAGE.steps.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#step-${s.id}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition-colors hover:border-emerald-700 hover:text-emerald-900"
                  >
                    <span className="text-emerald-700">{pad(i + 1)}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>


          <div className="relative mt-14 lg:mt-20">
            {/* Spine: grey track + emerald fill driven by the scroll */}
            <div aria-hidden className="absolute bottom-6 left-6 top-6 w-0.5 -translate-x-1/2 rounded-full bg-slate-200 lg:left-1/2">
              <div ref={fillRef} className="size-full origin-top rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600" />
            </div>
            <ol ref={listRef} className="relative space-y-10 lg:space-y-20">
              {PROCESS_PAGE.steps.map((s, i) => (
                <Step key={s.id} step={s} index={i} />
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
