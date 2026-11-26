import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * Small round "Back to top" button, shown once past the first screen and hidden again
 * near the footer so it never covers content there. Desktop and tablet only (phones
 * have the bottom action bar).
 */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearEnd = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 600;
      setShow(window.scrollY > window.innerHeight && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#main"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0 });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      aria-label="Back to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`group fixed bottom-8 right-8 z-40 hidden size-12 place-items-center rounded-full border border-slate-300 bg-white/95 text-slate-900 shadow-lg shadow-slate-900/10 backdrop-blur transition-all duration-300 hover:border-emerald-700 hover:text-emerald-800 md:grid ${
        show ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5" aria-hidden />
    </a>
  );
}
