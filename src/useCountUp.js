import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "./motion.js";

/**
 * Counts from 0 to `to` once the element scrolls into view.
 * Jumps straight to the final value when the user prefers reduced motion.
 */
export default function useCountUp(to, duration = 1600) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      setValue(to);
      return;
    }
    let raf;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3)))); // ease-out cubic
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return [ref, value];
}
