/* LsnConceptCallout — highlight box for a key term / tip / warning / definition (self-contained).
   Left accent bar + tinted surface + icon + label, pops in with scale.
   scene props:
     scene.text     body text (the concept explanation)   [required]
     scene.label    bold label above text (e.g. "Definition" / "သတိပြုရန်")
     scene.variant  "info" | "tip" | "warning" | "definition"   (default info)
     scene.is_burmese  boolean -> Padauk
   USE for highlighting one key term / important tip / warning.
*/
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const FONT_UI = "'Inter', 'Padauk', system-ui, sans-serif";
const FONT_MM = "'Padauk', sans-serif";
const TEXT = "#101330";

const VAR: Record<string, { accent: string; tint: string; icon: React.ReactNode }> = {
  info: {
    accent: "#4c6ef5", tint: "rgba(76,110,245,0.08)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 11v5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="12" cy="7.5" r="1.3" fill="currentColor" />
      </svg>
    ),
  },
  tip: {
    accent: "#2fb344", tint: "rgba(47,179,68,0.08)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1 1 1.7V16h5v-.4c0-.7.4-1.3 1-1.7A6 6 0 0 0 12 3z"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  warning: {
    accent: "#f59f00", tint: "rgba(245,159,0,0.10)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L2 20h20L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 10v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  definition: {
    accent: "#7048e8", tint: "rgba(112,72,232,0.08)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H18a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2V5.5z"
          stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 8h8M8 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
};

const LsnConceptCallout: React.FC<{ scene: any; durF?: number }> = ({ scene }) => {
  const s = scene || {};
  const text: string = s.text || s.caption || "";
  const label: string | undefined = s.label;
  const v = VAR[s.variant] || VAR.info;
  const isMM = !!s.is_burmese;
  const textFont = isMM ? FONT_MM : FONT_UI;
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const p = spring({ frame: f, fps, config: { damping: 200, stiffness: 120, mass: 0.8 }, durationInFrames: 14 });
  const scale = interpolate(p, [0, 1], [0.9, 1]);
  const opacity = interpolate(f, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bodyOpacity = interpolate(f, [6, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity, transform: `scale(${scale})` }}>
        <div style={{ width: 1200, display: "flex", background: "#fff", borderRadius: 14, boxShadow: "0 8px 28px rgba(16,19,48,0.12)", overflow: "hidden" }}>
          <div style={{ flex: "0 0 auto", width: 10, background: v.accent }} />
          <div style={{ flex: 1, background: v.tint, padding: 40 }}>
            <div style={{ display: "flex", flexDirection: "row", gap: 24, alignItems: "flex-start" }}>
              <div style={{ flex: "0 0 auto", color: v.accent, marginTop: 2 }}>{v.icon}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {label ? (
                  <div style={{ fontFamily: FONT_UI, fontSize: 22, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: v.accent }}>
                    {label}
                  </div>
                ) : null}
                <div style={{ opacity: bodyOpacity, fontFamily: textFont, fontSize: 34, fontWeight: 500, color: TEXT, lineHeight: 1.45 }}>
                  {text}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default LsnConceptCallout;
