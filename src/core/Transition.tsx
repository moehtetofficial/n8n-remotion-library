import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Scene } from "./types";

/* =============================================================================
   Transition — wraps a scene body and applies enter/exit motion.
   fade (default) | slide | wipe
   ========================================================================== */
export const Transition: React.FC<{
  scene: Scene;
  durF: number;
  children: React.ReactNode;
}> = ({ scene, durF, children }) => {
  const frame = useCurrentFrame();
  const kind = scene.transition || "fade";
  const inF = 12;

  let style: React.CSSProperties = {};

  if (kind === "slide") {
    const x = interpolate(
      frame,
      [0, inF, durF - inF, durF],
      [80, 0, 0, -80],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const o = interpolate(
      frame,
      [0, inF, durF - inF, durF],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    style = { transform: `translateX(${x}px)`, opacity: o };
  } else if (kind === "wipe") {
    const w = interpolate(frame, [0, inF], [0, 100], { extrapolateRight: "clamp" });
    style = { clipPath: `inset(0 ${100 - w}% 0 0)` };
  } else {
    const o = interpolate(
      frame,
      [0, inF, durF - inF, durF],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    style = { opacity: o };
  }

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};
