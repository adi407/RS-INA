import { useEffect } from "react";

/**
 * Scroll reveal for every [data-reveal] element on the page (see index.css).
 * Call once from App after the sections have mounted.
 */
export default function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const done = (e) => {
      // Ignore animations bubbling up from children (e.g. the Advantages fade-up)
      if (e.target === e.currentTarget) e.currentTarget.dataset.reveal = "done";
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.addEventListener("animationend", done);
          el.dataset.reveal = "in";
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const els = document.querySelectorAll("[data-reveal]");
    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      els.forEach((el) => el.removeEventListener("animationend", done));
      root.classList.remove("reveal-ready");
    };
  }, []);
}
