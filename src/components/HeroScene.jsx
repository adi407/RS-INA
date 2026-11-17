import { useEffect, useRef, useState } from "react";

/**
 * Lazy 3D layer for the hero (globe + arcs + wave field, see three/heroScene.js).
 * Only loads on large screens with motion allowed and WebGL available, after the page
 * is idle; Three.js stays out of the main bundle. It renders only while the hero is on
 * screen and the tab is visible. Anywhere it doesn't load, the photo backdrop remains.
 * `onReady` fires after the first frame so the hero can dim its photo underneath.
 */
export default function HeroScene({ onReady }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ok =
      window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)").matches &&
      !!document.createElement("canvas").getContext("webgl2");
    if (!ok) return;

    let scene = null;
    let cancelled = false;
    let io = null;
    const onVisibility = () => scene?.setActive(!document.hidden && visible);
    let visible = true;

    const start = () =>
      import("../three/heroScene.js").then(({ createHeroScene }) => {
        if (cancelled || !canvasRef.current) return;
        try {
          scene = createHeroScene(canvasRef.current, {
            onFirstFrame: () => {
              setReady(true);
              onReady?.();
            },
          });
        } catch {
          return; // WebGL context failed — keep the photo backdrop
        }
        io = new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
          onVisibility();
        });
        io.observe(canvasRef.current);
        document.addEventListener("visibilitychange", onVisibility);
      });

    // Wait for the page to settle so the 3D never competes with first paint
    const idle = window.requestIdleCallback ? requestIdleCallback(start, { timeout: 1500 }) : setTimeout(start, 600);

    return () => {
      cancelled = true;
      window.cancelIdleCallback ? cancelIdleCallback(idle) : clearTimeout(idle);
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene?.dispose();
    };
  }, [onReady]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-[5]">
      <canvas
        ref={canvasRef}
        className={`size-full transition-opacity duration-[1500ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
