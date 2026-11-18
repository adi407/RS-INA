import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;
/** The active Lenis instance (null under reduced motion), e.g. to stop scrolling while a menu is open. */
export const getLenis = () => lenis;

/**
 * Weighted smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger
 * animations stay in sync. Touch devices keep native scrolling (Lenis default).
 * Skipped entirely for reduced motion.
 */
export function useSmoothScroll() {
  // Keep every ScrollTrigger in step with the layout: whenever the page height changes
  // (images loading, a section changing size, content edits) re-measure all trigger
  // positions, so effects like the Proven Impact dark switch fire at the right scroll point.
  useEffect(() => {
    let timer = 0;
    let lastHeight = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastHeight) < 2) return; // ignore no-op notifications
      lastHeight = h;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Anchor links (#contact, #inquiry…) land below the sticky navbar
    lenis = new Lenis({ lerp: 0.1, anchors: { offset: -96 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts and images shift layout after first paint; re-measure triggers once loaded
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
    };
  }, []);
}

/**
 * Word-by-word blur reveal (Amaterasu-style): every [data-bw] word inside `ref` starts
 * blurred and faint, then comes into focus one after another in reading order as the
 * element scrolls up the screen. Scrubbed, so it follows the scroll both ways.
 * Reduced motion: words simply stay sharp.
 */
export function useBlurReveal(ref, { start = "top 90%", end = "top 45%" } = {}) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = el.querySelectorAll("[data-bw]");
      if (!words.length) return;
      gsap.fromTo(
        words,
        { opacity: 0.12, filter: "blur(10px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          duration: 1,
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: 0.6,
            refreshPriority: -1, // measure after pinned sections above have added their space
          },
        }
      );
    });
    return () => mm.revert();
  }, [ref, start, end]);
}

export { gsap, ScrollTrigger };
