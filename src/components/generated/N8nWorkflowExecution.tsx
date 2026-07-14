import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from "remotion";

/* N8nWorkflowExecution — pixel-faithful recreation of the real n8n editor (light theme)
   and a sequential execution run: node spinner -> green check -> connection turns
   green with an "1 item" label and moving data dots.
   scene props (all optional):
     scene.workflow_title  string
     scene.nodes           [{ label, icon, trigger?, color? }]  (auto layout, max 5)
     scene.item_label      string e.g. "1 item"
*/

const FPS = 30;
// real n8n light-theme tokens
const T = {
  canvas: "#f9f9f9", dot: "#dcdce3",
  nodeBg: "#ffffff", nodeBorder: "#d5d9e0", label: "#555f6d",
  primary: "#ff6d5a", ok: "#2ea36f", wire: "#b0b7c3",
  header: "#ffffff", headerBorder: "#e4e7ec", sidebar: "#101330",
  text: "#37424e",
};

const glyph = (name: string, c: string) => {
  const p: Record<string, string> = {
    bolt: "M13 2 4 14h6l-1 8 9-12h-6l1-8z",
    globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2c1.4 0 2.8 3.1 3 7h-6c.2-3.9 1.6-7 3-7zm-4.9 7c.1-2.2.7-4.2 1.6-5.7A8 8 0 0 0 4.1 11h3zm0 2h-3a8 8 0 0 0 4.6 5.7c-.9-1.5-1.5-3.5-1.6-5.7zm2 0c.2 3.9 1.6 7 2.9 7s2.8-3.1 3-7h-5.9zm7.9 0c-.1 2.2-.7 4.2-1.6 5.7A8 8 0 0 0 19.9 13h-2.9zm0-2h2.9a8 8 0 0 0-4.5-5.7c.9 1.5 1.5 3.5 1.6 5.7z",
    gear: "M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.5-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.5h-4l-.3 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.5L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5zM13 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z",
    mail: "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7 8-5H4l8 5zm0 2.2L4 9.5V17h16V9.5l-8 4.7z",
    db: "M12 2C7.6 2 4 3.6 4 5.5v13C4 20.4 7.6 22 12 22s8-1.6 8-3.5v-13C20 3.6 16.4 2 12 2zm0 2c3.9 0 6 1.2 6 1.5S15.9 7 12 7 6 5.8 6 5.5 8.1 4 12 4zm6 14.5c0 .3-2.1 1.5-6 1.5s-6-1.2-6-1.5V8.2C7.5 9 9.6 9.5 12 9.5s4.5-.5 6-1.3v10.3z",
    brain: "M12 3a4 4 0 0 0-4 4v.3A4 4 0 0 0 5 11a4 4 0 0 0 1.2 2.9A4 4 0 0 0 9 21h1V3h2v18h1a4 4 0 0 0 2.8-7.1A4 4 0 0 0 19 11a4 4 0 0 0-3-3.7V7a4 4 0 0 0-4-4z",
    code: "M8.7 16.3 4.4 12l4.3-4.3 1.4 1.4L7.2 12l2.9 2.9-1.4 1.4zm6.6 0-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4L19.6 12l-4.3 4.3z",
    sheet: "M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 5v3h6V8H5zm8 0v3h6V8h-6zm-8 5v3h6v-3H5zm8 0v3h6v-3h-6z",
  };
  return (
    <svg width="38" height="38" viewBox="0 0 24 24">
      <path d={p[name] || p.gear} fill={c} />
    </svg>
  );
};

const DEFAULT_NODES = [
  { label: "Webhook", icon: "bolt", trigger: true, color: "#8c5cf6" },
  { label: "Edit Fields", icon: "gear", color: "#6b7684" },
  { label: "HTTP Request", icon: "globe", color: "#3b82f6" },
  { label: "Gmail", icon: "mail", color: "#e34133" },
];

export default function N8nWorkflowExecution({ scene, durF }: { scene: any; durF: number }) {
  const frame = useCurrentFrame();
  const nodes = (Array.isArray(scene?.nodes) && scene.nodes.length ? scene.nodes : DEFAULT_NODES).slice(0, 5);
  const title = scene?.workflow_title || "My workflow";
  const itemLabel = scene?.item_label || "1 item";
  const D = Math.max(durF, 90);

  // layout (px on 1920x1080 stage)
  const NODE = 104;
  const startX = 960 - ((nodes.length - 1) * 300) / 2;
  const pos = nodes.map((_: any, i: number) => ({ x: startX + i * 300, y: 560 }));

  // timeline: 12% appear, then each node runs in an equal slice, last 8% hold
  const runStart = D * 0.14;
  const runEnd = D * 0.92;
  const slice = (runEnd - runStart) / nodes.length;
  const nodeState = (i: number) => {
    const s = runStart + i * slice, e = s + slice;
    if (frame < s) return "idle";
    if (frame < e - slice * 0.25) return "running";
    return "done";
  };

  return (
    <AbsoluteFill style={{ background: T.canvas, fontFamily: "Inter, sans-serif" }}>
      {/* dot grid */}
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${T.dot} 1.6px, transparent 1.6px)`, backgroundSize: "22px 22px" }} />
      {/* slim dark sidebar (real n8n) */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 66, background: T.sidebar, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 16, gap: 22 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: T.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>n8n</div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 22, height: 22, borderRadius: 5, background: "rgba(255,255,255,0.16)" }} />
        ))}
      </div>
      {/* header */}
      <div style={{ position: "absolute", left: 66, right: 0, top: 0, height: 64, background: T.header, borderBottom: `1px solid ${T.headerBorder}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 18 }}>
        <span style={{ color: T.text, fontSize: 20, fontWeight: 600 }}>{title}</span>
        <span style={{ color: "#9aa4b2", fontSize: 15 }}>+ Add tag</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#7a8595", fontSize: 15 }}>Inactive</span>
          <div style={{ width: 40, height: 22, borderRadius: 11, background: "#d7dbe2", position: "relative" }}>
            <div style={{ position: "absolute", left: 2, top: 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
          </div>
          <div style={{ padding: "8px 18px", borderRadius: 6, border: `1px solid ${T.headerBorder}`, color: T.text, fontSize: 15 }}>Share</div>
          <div style={{ padding: "8px 22px", borderRadius: 6, background: T.primary, color: "#fff", fontSize: 15, fontWeight: 600 }}>Save</div>
        </div>
      </div>

      {/* connections */}
      <svg style={{ position: "absolute", inset: 0 }} width="1920" height="1080">
        {pos.slice(0, -1).map((p: any, i: number) => {
          const a = { x: p.x + NODE / 2, y: p.y };
          const b = { x: pos[i + 1].x - NODE / 2, y: pos[i + 1].y };
          const done = nodeState(i) === "done";
          const midx = (a.x + b.x) / 2;
          const path = `M ${a.x} ${a.y} C ${midx} ${a.y}, ${midx} ${b.y}, ${b.x} ${b.y}`;
          // moving data dot while next node is running
          const segS = runStart + (i + 1) * slice - slice, segE = segS + slice * 0.5;
          const t = interpolate(frame, [segS + slice * 0.7, segE + slice * 0.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });
          const dx = a.x + (b.x - a.x) * t;
          return (
            <g key={i}>
              <path d={path} stroke={done ? T.ok : T.wire} strokeWidth={2.4} fill="none" />
              {done && (
                <g>
                  <rect x={midx - 34} y={a.y - 34} width={68} height={24} rx={5} fill="#eef7f2" stroke={T.ok} strokeWidth={1} />
                  <text x={midx} y={a.y - 17} textAnchor="middle" fill={T.ok} fontSize={13} fontFamily="Inter, sans-serif">{itemLabel}</text>
                </g>
              )}
              {t > 0 && t < 1 && <circle cx={dx} cy={a.y} r={6} fill={T.ok} />}
            </g>
          );
        })}
      </svg>

      {/* nodes */}
      {nodes.map((n: any, i: number) => {
        const appear = 6 + i * 6;
        const sp = spring({ frame: frame - appear, fps: FPS, config: { damping: 14, stiffness: 130 } });
        const st = nodeState(i);
        const pulse = st === "running" ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
        const border = st === "running" ? T.primary : st === "done" ? T.ok : T.nodeBorder;
        const radius = n.trigger ? "36px 8px 8px 36px" : "8px";
        return (
          <div key={i} style={{ position: "absolute", left: pos[i].x - NODE / 2, top: pos[i].y - NODE / 2, width: NODE, height: NODE, transform: `scale(${0.6 + sp * 0.4})`, opacity: Math.min(1, sp * 1.4) }}>
            <div style={{ width: "100%", height: "100%", background: T.nodeBg, border: `2px solid ${border}`, borderRadius: radius, boxShadow: st === "running" ? `0 0 0 ${4 + pulse * 4}px rgba(255,109,90,0.22)` : "0 2px 8px rgba(16,19,48,0.08)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {glyph(n.icon || "gear", n.color || "#6b7684")}
              {/* input / output connector nubs */}
              {!n.trigger && <div style={{ position: "absolute", left: -7, top: "50%", marginTop: -6, width: 12, height: 12, background: "#fff", border: `2px solid ${T.wire}`, borderRadius: 3, transform: "rotate(45deg)" }} />}
              {i < nodes.length - 1 && <div style={{ position: "absolute", right: -8, top: "50%", marginTop: -7, width: 14, height: 14, background: "#fff", border: `2px solid ${T.wire}`, borderRadius: "50%" }} />}
              {/* running spinner */}
              {st === "running" && (
                <svg width="26" height="26" viewBox="0 0 24 24" style={{ position: "absolute", top: -34, right: -6, transform: `rotate(${frame * 14}deg)` }}>
                  <circle cx="12" cy="12" r="9" stroke="#f0c4bc" strokeWidth="3.4" fill="none" />
                  <path d="M12 3a9 9 0 0 1 9 9" stroke={T.primary} strokeWidth="3.4" fill="none" strokeLinecap="round" />
                </svg>
              )}
              {/* success check badge */}
              {st === "done" && (
                <div style={{ position: "absolute", top: -12, right: -12, width: 26, height: 26, borderRadius: "50%", background: T.ok, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.18)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24"><path d="M4.5 12.5 10 18 19.5 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}
            </div>
            <div style={{ marginTop: 10, textAlign: "center", color: T.label, fontSize: 16, fontWeight: 500, width: 180, marginLeft: -38 }}>{n.label}</div>
          </div>
        );
      })}

      {/* bottom-left zoom controls (real n8n) */}
      <div style={{ position: "absolute", left: 92, bottom: 26, display: "flex", gap: 8 }}>
        {["+", "−", "⤢"].map((s, i) => (
          <div key={i} style={{ width: 38, height: 38, borderRadius: 8, background: "#fff", border: `1px solid ${T.headerBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#5b6672", fontSize: 18 }}>{s}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}
