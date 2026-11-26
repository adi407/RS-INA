import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

/**
 * Smooth scrolling used to be Lenis; the site now uses native scrolling (faster, no lag
 * on slower laptops, and keyboard/assistive scrolling behaves as expected).
 * Kept as a stub so dialogs can still call getLenis()?.stop().
 */
export const getLenis = () => null;

/**
 * Keeps every ScrollTrigger in step with the layout: whenever the page height changes
 * (images loading, a section changing size) re-measure all trigger positions.
 */
export function useSmoothScroll() {
  useEffect(() => {
    let timer = 0;
    let lastHeight = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastHeight) < 2) return;
      lastHeight = h;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
      window.removeEventListener("load", refresh);
    };
  }, []);
}

/**
 * Gentle heading reveal: words start slightly faded and soft, and are fully sharp
 * before the heading reaches the middle of the screen. Scrubbed with the scroll.
 * Screen readers always get the plain text (see <Words>). Reduced motion: no effect.
 */
export function useBlurReveal(ref, { start = "top 95%", end = "top 65%" } = {}) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = el.querySelectorAll("[data-bw]");
      if (!words.length) return;
      gsap.fromTo(
        words,
        { opacity: 0.45, filter: "blur(4px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          duration: 1,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start, end, scrub: 0.4, refreshPriority: -1 },
        }
      );
    });
    return () => mm.revert();
  }, [ref, start, end]);
}

export { gsap, ScrollTrigger, Flip };

/** True when the visitor asked for less motion — in their OS or with the footer switch. */
export const reducedMotion = () =>
  document.documentElement.dataset.motion === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
