import { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { gsap } from "gsap";
import { CursorStep, FPS } from "../core/types";

/* =============================================================================
   useCursor — a fake cursor that walks a path, clicks, and drags.
   GSAP timeline built paused, seeked by Remotion frame (deterministic).

   cursor: [{ x, y, click?, drag?, dwell? }]
   Returns { x, y, click (0..1 pulse), drag (0|1) }.
   ========================================================================== */
export function useCursor(steps: CursorStep[] | undefined, durF: number) {
  const frame = useCurrentFrame();

  const built = useMemo(() => {
    const state = { x: 50, y: 55, click: 0, drag: 0 };
    if (!steps || steps.length === 0) return { state, tl: null as gsap.core.Timeline | null };

    const first = steps[0];
    gsap.set(state, { x: first.x ?? 50, y: first.y ?? 55, click: 0, drag: 0 });

    const tl = gsap.timeline({ paused: true });
    steps.forEach((s) => {
      const hop = 0.9;
      if (s.drag) tl.to(state, { drag: 1, duration: 0.1 });
      tl.to(state, { x: s.x, y: s.y, duration: hop, ease: "power2.inOut" });
      if (s.click) {
        tl.to(state, { click: 1, duration: 0.08 }).to(state, { click: 0, duration: 0.14 });
      }
      if (s.drag) tl.to(state, { drag: 0, duration: 0.1 });
      tl.to(state, { duration: Math.max(0, s.dwell ?? 0.4) }); // dwell
    });

    return { state, tl };
  }, [steps]);

  if (built.tl) {
    const total = built.tl.duration() || 1;
    const p = Math.min(1, frame / FPS / (durF / FPS));
    built.tl.progress(p);
  }

  return built.state;
}
