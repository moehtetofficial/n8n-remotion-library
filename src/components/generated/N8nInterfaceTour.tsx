import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

/* N8nInterfaceTour — the full real n8n editor UI (dark sidebar, header, canvas,
   nodes, add-node panel button) with cinematic camera moves that tour each area:
   overview -> sidebar -> canvas nodes -> header (Active/Save) -> overview.
   A soft highlight ring marks the focused area so students always know where to look.
   scene props (optional):
     scene.workflow_title  string
     scene.tour            array of area keys among: "overview"|"sidebar"|"canvas"|"header"|"addnode"
*/

const T = {
  canvas: "#f9f9f9", dot: "#dcdce3", nodeBg: "#fff", nodeBorder: "#d5d9e0",
  primary: "#ff6d5a", wire: "#b0b7c3", label: "#555f6d",
  header: "#ffffff", headerBorder: "#e4e7ec", sidebar: "#101330", text: "#37424e",
};

// camera targets: scale + focal point (px on 1920x1080) + highlight rect
const AREAS: Record<string, { s: number; cx: number; cy: number; hl?: [number, number, number, number] }> = {
  overview: { s: 1, cx: 960, cy: 540 },
  sidebar: { s: 1.9, cx: 240, cy: 430, hl: [0, 0, 250, 1080] },
  canvas: { s: 1.65, cx: 900, cy: 560, hl: [520, 380, 800, 360] },
  header: { s: 1.85, cx: 1520, cy: 120, hl: [1200, 70, 660, 100] },
  addnode: { s: 2.0, cx: 1852, cy: 540, hl: [1795, 470, 115, 140] },
};

const glyph = (d: string, c: string, s = 34) => (
  <svg width={s} height={s} viewBox="0 0 24 24"><path d={d} fill={c} /></svg>
);
const P = {
  bolt: "M13 2 4 14h6l-1 8 9-12h-6l1-8z",
  gear: "M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.5-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.5h-4l-.3 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.5L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5zM13 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2c1.4 0 2.8 3.1 3 7h-6c.2-3.9 1.6-7 3-7z",
};

export default function N8nInterfaceTour({ scene, durF }: { scene: any; durF: number }) {
  const frame = useCurrentFrame();
  const D = Math.max(durF, 120);
  const title = scene?.workflow_title || "My workflow";
  const tour: string[] = Array.isArray(scene?.tour) && scene.tour.length
    ? scene.tour.filter((k: string) => AREAS[k])
    : ["overview", "sidebar", "canvas", "header", "overview"];

  // camera interpolation across tour stops (dwell + move)
  const nStops = tour.length;
  const segLen = D / nStops;
  const idx = Math.min(nStops - 1, Math.floor(frame / segLen));
  const local = (frame - idx * segLen) / segLen; // 0..1 in current segment
  const moveT = interpolate(local, [0, 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const from = AREAS[tour[Math.max(0, idx - (local < 0.35 && idx > 0 ? 1 : 0))]];
  const cur = AREAS[tour[idx]];
  const prev = idx > 0 ? AREAS[tour[idx - 1]] : cur;
  const s = interpolate(moveT, [0, 1], [prev.s, cur.s]);
  const cx = interpolate(moveT, [0, 1], [prev.cx, cur.cx]);
  const cy = interpolate(moveT, [0, 1], [prev.cy, cur.cy]);
  void from;

  const hl = cur.hl;
  const hlOp = hl ? interpolate(local, [0.35, 0.5, 0.9, 1], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;

  const nodes = [
    { x: 700, y: 560, label: "Webhook", icon: P.bolt, color: "#8c5cf6", trigger: true },
    { x: 1000, y: 560, label: "Edit Fields", icon: P.gear, color: "#6b7684" },
    { x: 1300, y: 560, label: "HTTP Request", icon: P.globe, color: "#3b82f6" },
  ];

  return (
    <AbsoluteFill style={{ background: "#0b0f16", overflow: "hidden" }}>
      {/* camera rig */}
      <AbsoluteFill style={{ transform: `scale(${s}) translate(${(960 - cx)}px, ${(540 - cy)}px)`, transformOrigin: "960px 540px", fontFamily: "Inter, sans-serif" }}>
        <AbsoluteFill style={{ background: T.canvas }} />
        <AbsoluteFill style={{ backgroundImage: `radial-gradient(${T.dot} 1.6px, transparent 1.6px)`, backgroundSize: "22px 22px" }} />

        {/* dark sidebar */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 250, background: T.sidebar, padding: "18px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px", marginBottom: 30 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>n8n</div>
          </div>
          {["Overview", "Personal", "Workflows", "Credentials", "Executions", "Templates", "Variables"].map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 22px", color: i === 2 ? "#fff" : "rgba(255,255,255,0.62)", background: i === 2 ? "rgba(255,109,90,0.16)" : "transparent", borderLeft: i === 2 ? `3px solid ${T.primary}` : "3px solid transparent", fontSize: 16 }}>
              <span style={{ width: 18, height: 18, borderRadius: 4, background: "rgba(255,255,255,0.22)" }} />
              {m}
            </div>
          ))}
        </div>

        {/* header */}
        <div style={{ position: "absolute", left: 250, right: 0, top: 0, height: 64, background: T.header, borderBottom: `1px solid ${T.headerBorder}`, display: "flex", alignItems: "center", padding: "0 26px", gap: 16 }}>
          <span style={{ color: T.text, fontSize: 19, fontWeight: 600 }}>{title}</span>
          <span style={{ color: "#9aa4b2", fontSize: 14 }}>+ Add tag</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: "#7a8595", fontSize: 14 }}>Inactive</span>
            <div style={{ width: 38, height: 21, borderRadius: 11, background: "#d7dbe2", position: "relative" }}>
              <div style={{ position: "absolute", left: 2, top: 2, width: 17, height: 17, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
            </div>
            <div style={{ padding: "7px 16px", borderRadius: 6, border: `1px solid ${T.headerBorder}`, color: T.text, fontSize: 14 }}>Share</div>
            <div style={{ padding: "7px 20px", borderRadius: 6, background: T.primary, color: "#fff", fontSize: 14, fontWeight: 600 }}>Save</div>
          </div>
        </div>

        {/* wires */}
        <svg style={{ position: "absolute", inset: 0 }} width="1920" height="1080">
          <line x1={752} y1={560} x2={948} y2={560} stroke={T.wire} strokeWidth={2.4} />
          <line x1={1052} y1={560} x2={1248} y2={560} stroke={T.wire} strokeWidth={2.4} />
        </svg>

        {/* nodes */}
        {nodes.map((n, i) => (
          <div key={i} style={{ position: "absolute", left: n.x - 52, top: n.y - 52, width: 104, height: 104 }}>
            <div style={{ width: "100%", height: "100%", background: T.nodeBg, border: `2px solid ${T.nodeBorder}`, borderRadius: n.trigger ? "36px 8px 8px 36px" : 8, boxShadow: "0 2px 8px rgba(16,19,48,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {glyph(n.icon, n.color)}
            </div>
            <div style={{ marginTop: 9, textAlign: "center", color: T.label, fontSize: 15, fontWeight: 500, width: 180, marginLeft: -38 }}>{n.label}</div>
          </div>
        ))}

        {/* add-node button (right edge, real n8n) */}
        <div style={{ position: "absolute", right: 26, top: 500, width: 52, height: 52, borderRadius: 10, background: "#fff", border: `1px solid ${T.nodeBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#5b6672", fontSize: 30, boxShadow: "0 2px 8px rgba(16,19,48,0.1)" }}>+</div>

        {/* zoom controls */}
        <div style={{ position: "absolute", left: 276, bottom: 24, display: "flex", gap: 8 }}>
          {["+", "−", "⤢"].map((c, i) => (
            <div key={i} style={{ width: 36, height: 36, borderRadius: 8, background: "#fff", border: `1px solid ${T.headerBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#5b6672", fontSize: 17 }}>{c}</div>
          ))}
        </div>

        {/* focus highlight ring */}
        {hl && hlOp > 0 && (
          <div style={{ position: "absolute", left: hl[0] - 8, top: hl[1] - 8, width: hl[2] + 16, height: hl[3] + 16, border: `3px solid ${T.primary}`, borderRadius: 14, boxShadow: `0 0 0 6px rgba(255,109,90,0.18), 0 0 40px rgba(255,109,90,0.35)`, opacity: hlOp }} />
        )}
      </AbsoluteFill>

      {/* cinematic vignette on top of the camera */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at center, transparent 62%, rgba(6,8,14,0.5) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
}
