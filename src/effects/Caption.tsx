import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";
import { FPS, IconItem } from "../core/types";

/* =============================================================================
   Caption — bottom subtitle, Burmese-friendly, word-by-word reveal.
   ========================================================================== */
export const Caption: React.FC<{ text: string; mode?: string; durF: number }> = ({ text, mode, durF }) => {
  const frame = useCurrentFrame();
  const words = text.split(/\s+/).filter(Boolean);
  const perWord = words.length ? Math.max(2, Math.floor((durF * 0.55) / words.length)) : 0;
  return (
    <div style={{ position: "absolute", bottom: 70, left: 0, right: 0, textAlign: "center", padding: "0 120px" }}>
      <span
        style={{
          display: "inline-block",
          background: "linear-gradient(135deg, rgba(8,10,18,0.88), rgba(30,18,40,0.88))",
          color: "#fff", fontSize: 46, lineHeight: 1.5, fontWeight: 600,
          padding: "16px 34px", borderRadius: 18, backdropFilter: "blur(6px)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(234,75,113,0.22) inset",
          fontFamily: '"Padauk","Noto Sans Myanmar",sans-serif',
        }}
      >
        {mode === "word"
          ? words.map((w, i) => {
              const a = i * perWord;
              const o = interpolate(frame, [a, a + perWord], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const ty = interpolate(frame, [a, a + perWord], [10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <span key={i} style={{ display: "inline-block", opacity: o, transform: `translateY(${ty}px)`, marginRight: 12 }}>{w}</span>;
            })
          : text}
      </span>
    </div>
  );
};

/* =============================================================================
   Kinetic — staggered big text lines for concept/intro scenes.
   ========================================================================== */
export const Kinetic: React.FC<{ lines: string[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 18 }}>
      {lines.map((ln, i) => {
        const appear = 6 + i * 8;
        const o = interpolate(frame, [appear, appear + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const s = spring({ frame: frame - appear, fps: FPS, config: { damping: 14, stiffness: 120 } });
        const ty = interpolate(s, [0, 1], [40, 0]);
        const sc = interpolate(s, [0, 1], [0.85, 1]);
        return (
          <div
            key={i}
            style={{
              opacity: o, transform: `translateY(${ty}px) scale(${sc})`,
              color: "#f3e9ff", fontSize: 62, fontWeight: 800, textAlign: "center",
              fontFamily: '"Padauk","Noto Sans Myanmar",sans-serif',
              textShadow: "0 6px 30px rgba(234,75,113,0.45)", padding: "0 100px",
            }}
          >
            {ln}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* =============================================================================
   Icons — animated concept icons (uses NodeIcon slugs if provided).
   Rendered by SceneController which injects the icon renderer.
   ========================================================================== */
export const IconsRow: React.FC<{ icons: IconItem[]; renderIcon: (slug?: string, color?: string) => React.ReactNode }> = ({ icons, renderIcon }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {icons.map((ic, i) => {
        const appear = 8 + i * 6;
        const s = spring({ frame: frame - appear, fps: FPS, config: { damping: 12, stiffness: 100 } });
        const sc = interpolate(s, [0, 1], [0, 1]);
        const float = Math.sin((frame + i * 20) / 24) * 10;
        return (
          <div
            key={i}
            style={{
              position: "absolute", left: `${ic.x ?? 50}%`, top: `${ic.y ?? 50}%`,
              transform: `translate(-50%,-50%) scale(${sc}) translateY(${float}px)`,
              display: "flex", flexDirection: "column", alignItems: "center",
            }}
          >
            <div
              style={{
                width: 120, height: 120, borderRadius: 28,
                background: ic.color ?? "linear-gradient(135deg,#ea4b71,#8a4fe0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 54, boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              }}
            >
              {ic.slug ? renderIcon(ic.slug, "#fff") : (ic.name ?? "◆")}
            </div>
            {ic.label && (
              <div style={{ marginTop: 12, color: "#f0e6ff", fontSize: 26, textAlign: "center", fontFamily: '"Padauk",sans-serif' }}>
                {ic.label}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
