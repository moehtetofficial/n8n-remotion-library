/* LsnTitleCard — lesson title scene (self-contained; no ../lib imports).
   Renders eyebrow + display title + underline sweep + subtitle.
   Burmese-safe via scene.is_burmese (Padauk).
   scene props (all optional except title):
     scene.title       main heading (string)  [required]
     scene.subtitle    secondary line
     scene.eyebrow     small kicker above title (e.g. "Lesson 03" / "အခန်း ၃")
     scene.is_burmese  boolean -> switch title/subtitle to Padauk
     scene.accent      hex accent for eyebrow + underline (default n8n orange)
     scene.align       "center" | "left"  (default center)
   USE for lesson title cards / section openers.
*/
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const FONT_UI = "'Inter', 'Padauk', system-ui, sans-serif";
const FONT_MM = "'Padauk', sans-serif";
const C = { text: "#101330", soft: "#3d3f52", orange: "#ff6d5a" };

const FadeIn: React.FC<{ children: React.ReactNode; at?: number; dur?: number; style?: React.CSSProperties }> = ({
  children, at = 0, dur = 12, style,
}) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity, ...style }}>{children}</div>;
};

const SlideUp: React.FC<{ children: React.ReactNode; at?: number; dur?: number; dist?: number; style?: React.CSSProperties }> = ({
  children, at = 0, dur = 14, dist = 40, style,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 200, stiffness: 120, mass: 0.8 }, durationInFrames: dur });
  const opacity = interpolate(f, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ opacity, transform: `translateY(${dist * (1 - p)}px)`, ...style }}>{children}</div>;
};

const LsnTitleCard: React.FC<{ scene: any; durF?: number }> = ({ scene }) => {
  const f = useCurrentFrame();
  const s = scene || {};
  const title: string = s.title || s.heading || "Untitled";
  const subtitle: string | undefined = s.subtitle;
  const eyebrow: string | undefined = s.eyebrow;
  const isMM = !!s.is_burmese;
  const accent: string = s.accent || C.orange;
  const align = s.align === "left" ? "left" : "center";
  const textFont = isMM ? FONT_MM : FONT_UI;
  const items = align === "center" ? "center" : "flex-start";

  const uStart = 16;
  const underlineW = interpolate(f, [uStart, uStart + 14], [0, 220], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: items, maxWidth: 1400, padding: 64 }}>
        {eyebrow ? (
          <FadeIn at={0} dur={10}>
            <div style={{ fontFamily: FONT_UI, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: accent, textAlign: align }}>
              {eyebrow}
            </div>
          </FadeIn>
        ) : null}

        <SlideUp at={4} dist={40}>
          <div style={{ fontFamily: textFont, fontSize: 72, fontWeight: 700, lineHeight: 1.15, color: C.text, textAlign: align }}>
            {title}
          </div>
        </SlideUp>

        <div style={{ height: 6, width: underlineW, borderRadius: 999, background: accent }} />

        {subtitle ? (
          <FadeIn at={18} dur={12}>
            <div style={{ fontFamily: textFont, fontSize: 42, fontWeight: 400, color: C.soft, lineHeight: 1.4, textAlign: align }}>
              {subtitle}
            </div>
          </FadeIn>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export default LsnTitleCard;
