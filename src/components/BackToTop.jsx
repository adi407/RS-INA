import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating "Back to top" link, shown once the visitor is past the first screen. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-900 shadow-lg shadow-slate-900/10 backdrop-blur transition-all duration-300 hover:border-emerald-500/50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:bottom-8 sm:right-8 ${
        show ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
      }`}
    >
      Back to top
      <ArrowUp className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden />
    </a>
  );
}
