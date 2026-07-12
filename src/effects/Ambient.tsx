import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/* =============================================================================
   Ambient — always-visible animated background (prevents black screens).
   n8n-flavoured dark palette with a drifting radial accent.
   ========================================================================== */
export const Ambient: React.FC<{ bg?: string }> = ({ bg }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = durationInFrames > 0 ? frame / durationInFrames : 0;
  const hue = 250 + Math.sin(t * Math.PI * 2) * 16; // indigo/violet drift

  if (bg) return <AbsoluteFill style={{ background: bg }} />;

  const gx = 30 + Math.sin(frame / 90) * 18;
  const gy = 35 + Math.cos(frame / 110) * 16;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${hue},34%,9%), hsl(${hue + 18},38%,14%) 55%, hsl(${hue - 14},30%,7%))`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(42% 46% at ${gx}% ${gy}%, hsla(336,72%,55%,0.16), transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* =============================================================================
   Particles — subtle floating dots for depth on concept scenes.
   ========================================================================== */
export const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 14 }).map((_, i) => {
        const x = (i * 137.5) % 100;
        const y = ((((i * 71) % 100) + frame / (2 + (i % 4))) % 110) - 5;
        const s = 4 + (i % 5) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`, top: `${y}%`,
              width: s, height: s, borderRadius: "50%",
              background: `hsla(${300 + (i % 6) * 12},80%,70%,0.14)`,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
