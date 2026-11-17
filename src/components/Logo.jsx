/** Wordmark: emerald monogram + "RS INTERNATIONAL" with descriptor line. */
export default function Logo({ compact = false }) {
  return (
    <a
      href="#top"
      className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
      aria-label="RS International — home"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500 font-display text-sm font-extrabold tracking-tight text-obsidian transition-transform duration-300 group-hover:rotate-[-6deg]">
        RS
      </span>
      <span className="leading-none">
        <span className="block font-display text-[15px] font-bold tracking-[0.18em] text-white">RS INTERNATIONAL</span>
        {!compact && (
          <span className="mt-1.5 block text-[10.5px] font-medium tracking-[0.04em] text-slate-400">
            Human Resource &amp; Manpower Consultant
          </span>
        )}
      </span>
    </a>
  );
}
