import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from "remotion";

/* StepFlowDiagram — premium concept-scene component: 3-5 process steps revealed
   progressively with drawn connectors and a moving focus glow synced to durF.
   Supports Burmese text (Padauk / Noto Sans Myanmar).
   scene props (optional):
     scene.heading  string
     scene.steps    [{ title, desc }]  (max 5)
*/

const FPS = 30;

const DEFAULT_STEPS = [
  { title: "Trigger", desc: "Webhook / Schedule" },
  { title: "Process", desc: "Data transform" },
  { title: "AI Decision", desc: "Gemini analysis" },
  { title: "Action", desc: "Send result" },
];

export default function StepFlowDiagram({ scene, durF }: { scene: any; durF: number }) {
  const frame = useCurrentFrame();
  const D = Math.max(durF, 90);
  const steps = (Array.isArray(scene?.steps) && scene.steps.length ? scene.steps : DEFAULT_STEPS).slice(0, 5);
  const heading = scene?.heading || "";
  const n = steps.length;

  const W = 340, GAP = 70;
  const totalW = n * W + (n - 1) * GAP;
  const startX = (1920 - totalW) / 2;
  const Y = 470;

  // which step is "active" (focus glow) across the scene duration
  const activeF = interpolate(frame, [D * 0.15, D * 0.9], [0, n - 0.001], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const active = Math.floor(activeF);

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 30% 18%, #16203a 0%, #0b1018 65%)", fontFamily: '"Padauk","Noto Sans Myanmar",Inter,sans-serif' }}>
      {/* subtle grid depth */}
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(120,150,255,0.10) 1.4px, transparent 1.4px)", backgroundSize: "34px 34px", opacity: 0.6 }} />

      {heading ? (
        <div style={{ position: "absolute", top: 190, width: "100%", textAlign: "center", color: "#eaf2ff", fontSize: 52, fontWeight: 800, opacity: interpolate(frame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 6px 30px rgba(80,120,255,0.45)" }}>
          {heading}
        </div>
      ) : null}

      {/* connectors */}
      <svg style={{ position: "absolute", inset: 0 }} width="1920" height="1080">
        {steps.slice(0, -1).map((_: any, i: number) => {
          const x1 = startX + (i + 1) * W + i * GAP;
          const x2 = x1 + GAP;
          const drawStart = 14 + (i + 1) * 10;
          const t = interpolate(frame, [drawStart, drawStart + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
          const lit = i < active;
          const xm = x1 + (x2 - x1) * t;
          return (
            <g key={i} opacity={t}>
              <line x1={x1} y1={Y} x2={xm} y2={Y} stroke={lit ? "#5f8bff" : "rgba(140,165,255,0.4)"} strokeWidth={3} />
              {t >= 1 && (
                <path d={`M ${x2 - 14} ${Y - 9} L ${x2} ${Y} L ${x2 - 14} ${Y + 9}`} stroke={lit ? "#5f8bff" : "rgba(140,165,255,0.4)"} strokeWidth={3} fill="none" strokeLinecap="round" />
              )}
              {lit && <circle cx={x1 + ((x2 - x1) * ((frame % 24) / 24))} cy={Y} r={5} fill="#9fe8b8" />}
            </g>
          );
        })}
      </svg>

      {/* step cards */}
      {steps.map((st: any, i: number) => {
        const appear = 10 + i * 10;
        const sp = spring({ frame: frame - appear, fps: FPS, config: { damping: 14, stiffness: 120 } });
        const isActive = i === active;
        const lift = isActive ? -14 : 0;
        const x = startX + i * (W + GAP);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: Y - 110 + lift, width: W, height: 220, transform: `translateY(${(1 - sp) * 46}px) scale(${0.85 + sp * 0.15})`, opacity: sp, transition: "top 0.2s" }}>
            <div style={{ width: "100%", height: "100%", background: isActive ? "linear-gradient(180deg, rgba(52,72,130,0.85), rgba(28,38,66,0.9))" : "rgba(20,28,48,0.82)", border: `1.5px solid ${isActive ? "#6f97ff" : "rgba(120,150,255,0.28)"}`, borderRadius: 18, boxShadow: isActive ? "0 0 0 6px rgba(95,139,255,0.14), 0 26px 60px rgba(0,0,0,0.5)" : "0 16px 40px rgba(0,0,0,0.4)", padding: "26px 28px", boxSizing: "border-box" }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: isActive ? "#5f8bff" : "rgba(95,139,255,0.22)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, marginBottom: 18 }}>
                {i + 1}
              </div>
              <div style={{ color: "#eaf2ff", fontSize: 27, fontWeight: 700, marginBottom: 8 }}>{st.title}</div>
              <div style={{ color: "#9fb0d4", fontSize: 19, lineHeight: 1.5 }}>{st.desc}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
