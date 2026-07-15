/* LsnBulletList — staggered bullet points for explaining concepts (self-contained).
   scene props:
     scene.items     array of string OR {text, sub}   [required]
     scene.heading   optional heading above the list
     scene.marker    "dot" | "number" | "check"   (default dot)
     scene.is_burmese  boolean -> Padauk
     scene.accent    hex accent for markers (default n8n orange)
   USE for concept explanations / step lists / key points.
*/
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const FONT_UI = "'Inter', 'Padauk', system-ui, sans-serif";
const FONT_MM = "'Padauk', sans-serif";
const C = { text: "#101330", muted: "#6b6e82", orange: "#ff6d5a" };

const SlideLeft: React.FC<{ children: React.ReactNode; at: number; style?: React.CSSProperties }> = ({ children, at, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 200, stiffness: 120, mass: 0.8 }, durationInFrames: 14 });
  const opacity = interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity, transform: `translateX(${56 * (1 - p)}px)`, ...style }}>{children}</div>;
};

const Marker: React.FC<{ kind: string; i: number; accent: string }> = ({ kind, i, accent }) => {
  const base: React.CSSProperties = {
    flex: "0 0 auto", width: 44, height: 44, borderRadius: 999, display: "flex",
    alignItems: "center", justifyContent: "center", fontFamily: FONT_UI, fontWeight: 700,
    fontSize: 28, color: "#fff", background: accent,
  };
  if (kind === "number") return <div style={base}>{i + 1}</div>;
  if (kind === "check")
    return (
      <div style={base}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  return <div style={{ flex: "0 0 auto", width: 16, height: 16, margin: "0 14px", borderRadius: 999, background: accent }} />;
};

const LsnBulletList: React.FC<{ scene: any; durF?: number }> = ({ scene }) => {
  const s = scene || {};
  const raw = Array.isArray(s.items) ? s.items : [];
  const heading: string | undefined = s.heading;
  const marker: string = s.marker || "dot";
  const isMM = !!s.is_burmese;
  const accent: string = s.accent || C.orange;
  const textFont = isMM ? FONT_MM : FONT_UI;
  const f = useCurrentFrame();

  const listStart = heading ? 10 : 0;
  const headOpacity = interpolate(f, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 40, maxWidth: 1500, padding: 64 }}>
        {heading ? (
          <div style={{ opacity: headOpacity, fontFamily: textFont, fontSize: 56, fontWeight: 700, color: C.text, marginBottom: 16 }}>
            {heading}
          </div>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {raw.map((r: any, i: number) => {
            const item = typeof r === "string" ? { text: r } : r || {};
            return (
              <SlideLeft key={i} at={listStart + i * 8}>
                <div style={{ display: "flex", flexDirection: "row", gap: 24, alignItems: "flex-start" }}>
                  <div style={{ marginTop: 4 }}>
                    <Marker kind={marker} i={i} accent={accent} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontFamily: textFont, fontSize: 34, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>
                      {item.text}
                    </div>
                    {item.sub ? (
                      <div style={{ fontFamily: textFont, fontSize: 28, fontWeight: 400, color: C.muted, lineHeight: 1.4 }}>
                        {item.sub}
                      </div>
                    ) : null}
                  </div>
                </div>
              </SlideLeft>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default LsnBulletList;
