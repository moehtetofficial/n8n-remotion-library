import { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { gsap } from "gsap";
import { CameraKey, FPS } from "../core/types";

/* =============================================================================
   useCamera — cinematic camera as keyframes, independent of the cursor.
   Combines Zoom + Pan + Follow from the reference library into ONE hook.

   camera: [{ at, zoom, x, y, ease }]
     at   = seconds into the scene
     zoom = scale (1 = fit, 1.6 = zoom in)
     x,y  = focal point % (transform-origin)

   Returns { zoom, x, y } for the current frame. Apply as:
     transform: `scale(zoom)`  transformOrigin: `x% y%`

   Deterministic: builds a paused GSAP timeline, seeks it by frame.
   ========================================================================== */
export function useCamera(keys: CameraKey[] | undefined, durF: number) {
  const frame = useCurrentFrame();

  const built = useMemo(() => {
    const state = { zoom: 1, x: 50, y: 50 };
    if (!keys || keys.length === 0) return { state, tl: null as gsap.core.Timeline | null };

    const sorted = [...keys].sort((a, b) => (a.at ?? 0) - (b.at ?? 0));
    const first = sorted[0];
    gsap.set(state, {
      zoom: first.zoom ?? 1,
      x: first.x ?? 50,
      y: first.y ?? 50,
    });

    const tl = gsap.timeline({ paused: true });
    let prevAt = first.at ?? 0;
    // ensure timeline starts at t=0 even if first key.at > 0
    if (prevAt > 0) tl.to(state, { duration: prevAt });

    sorted.forEach((k, i) => {
      if (i === 0) return;
      const at = k.at ?? prevAt + 1;
      const dur = Math.max(0.2, at - prevAt);
      tl.to(state, {
        zoom: k.zoom ?? state.zoom,
        x: k.x ?? state.x,
        y: k.y ?? state.y,
        duration: dur,
        ease: k.ease || "power2.inOut",
      });
      prevAt = at;
    });

    return { state, tl };
  }, [keys]);

  if (built.tl) {
    const sceneSeconds = durF / FPS;
    const tlDur = built.tl.duration() || 1;
    // map scene time onto timeline (they share the same second-space,
    // but clamp so late frames hold the final keyframe)
    const seconds = Math.min(frame / FPS, tlDur, sceneSeconds);
    built.tl.seek(seconds);
  }

  return built.state;
}
