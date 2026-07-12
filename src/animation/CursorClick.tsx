import React from "react";

/* =============================================================================
   CursorClick — renders the cursor arrow + ripple on click.
   Positions are % of the parent surface.
   ========================================================================== */
export const CursorClick: React.FC<{
  x: number;
  y: number;
  click: number;   // 0..1 pulse
  drag?: number;   // 0|1
}> = ({ x, y, click, drag = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      transform: `translate(-4%, -6%) scale(${1 - click * 0.15})`,
      zIndex: 60,
      pointerEvents: "none",
    }}
  >
    {/* click ripple */}
    {click > 0 && (
      <div
        style={{
          position: "absolute",
          left: -18,
          top: -18,
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "2px solid rgba(234,75,113,0.85)",
          opacity: 1 - click,
          transform: `scale(${0.6 + click * 0.9})`,
        }}
      />
    )}
    {/* drag ghost */}
    {drag > 0 && (
      <div
        style={{
          position: "absolute",
          left: -6,
          top: -6,
          width: 20,
          height: 20,
          borderRadius: 6,
          background: "rgba(234,75,113,0.25)",
          border: "1px solid rgba(234,75,113,0.6)",
        }}
      />
    )}
    <svg width="34" height="34" viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.6))" }}>
      <path d="M4 2 L4 20 L9 15 L12 22 L15 21 L12 14 L19 14 Z" fill="#fff" stroke="#111" strokeWidth="1" />
    </svg>
  </div>
);
