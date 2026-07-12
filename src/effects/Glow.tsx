import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Scene } from "../core/types";

/* =============================================================================
   Glow — pulsing glow ring, used to draw the eye to a node/field.
   ========================================================================== */
export const Glow: React.FC<{
  x: number; y: number; w: number; h: number; color?: string;
}> = ({ x, y, w, h, color = "#ea4b71" }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + Math.sin(frame / 8) * 0.5;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`, top: `${y}%`,
        width: `${w}%`, height: `${h}%`,
        borderRadius: 14,
        boxShadow: `0 0 ${18 + pulse * 22}px ${4 + pulse * 6}px ${color}`,
        opacity: 0.35 + pulse * 0.35,
        pointerEvents: "none",
      }}
    />
  );
};

/* =============================================================================
   Highlight — a selection ring around an element (n8n selected-node look).
   ========================================================================== */
export const Highlight: React.FC<{
  x: number; y: number; w: number; h: number; color?: string;
}> = ({ x, y, w, h, color = "#ea4b71" }) => (
  <div
    style={{
      position: "absolute",
      left: `${x - 0.6}%`, top: `${y - 0.9}%`,
      width: `${w + 1.2}%`, height: `${h + 1.8}%`,
      border: `2px solid ${color}`,
      borderRadius: 14,
      boxShadow: `0 0 0 4px ${color}22`,
      pointerEvents: "none",
    }}
  />
);

/* =============================================================================
   Grade — cinematic vignette overlay.
   ========================================================================== */
export const Grade: React.FC<{ grade?: Scene["grade"] }> = ({ grade }) => {
  if (!grade) return null;
  const vig = grade.vignette ?? 0;
  return vig > 0 ? (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${Math.min(0.85, vig)}) 100%)`,
      }}
    />
  ) : null;
};
