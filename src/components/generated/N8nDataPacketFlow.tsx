import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Easing } from "remotion";

/* N8nDataPacketFlow — teaches "how data enters n8n": an external app fires a
   POST request, a JSON payload packet physically travels into the Webhook
   trigger node, the workflow executes, and the result lands in a destination.
   Real n8n light-theme node styling.
   scene props (optional):
     scene.source_label  e.g. "Your Website"
     scene.payload       JSON string shown in the packet card
     scene.dest_label    e.g. "Telegram"   scene.dest_icon: mail|db|globe|sheet
*/

const FPS = 30;
const T = {
  canvas: "#f9f9f9", dot: "#dcdce3", nodeBg: "#fff", nodeBorder: "#d5d9e0",
  primary: "#ff6d5a", ok: "#2ea36f", wire: "#b0b7c3", label: "#555f6d", text: "#37424e",
};

const glyph = (name: string, c: string, s = 36) => {
  const p: Record<string, string> = {
    bolt: "M13 2 4 14h6l-1 8 9-12h-6l1-8z",
    gear: "M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.5-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.5h-4l-.3 2.5a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.5L6.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.6 7.6 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5zM13 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z",
    mail: "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 7 8-5H4l8 5zm0 2.2L4 9.5V17h16V9.5l-8 4.7z",
    db: "M12 2C7.6 2 4 3.6 4 5.5v13C4 20.4 7.6 22 12 22s8-1.6 8-3.5v-13C20 3.6 16.4 2 12 2zm0 2c3.9 0 6 1.2 6 1.5S15.9 7 12 7 6 5.8 6 5.5 8.1 4 12 4zm6 14.5c0 .3-2.1 1.5-6 1.5s-6-1.2-6-1.5V8.2C7.5 9 9.6 9.5 12 9.5s4.5-.5 6-1.3v10.3z",
    globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
    sheet: "M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 5v3h6V8H5zm8 0v3h6V8h-6zm-8 5v3h6v-3H5zm8 0v3h6v-3h-6z",
  };
  return <svg width={s} height={s} viewBox="0 0 24 24"><path d={p[name] || p.gear} fill={c} /></svg>;
};

const N8nNode: React.FC<{ x: number; y: number; label: string; icon: string; color: string; trigger?: boolean; active: number; done: boolean }> =
({ x, y, label, icon, color, trigger, active, done }) => {
  const border = active > 0 ? T.primary : done ? T.ok : T.nodeBorder;
  return (
    <div style={{ position: "absolute", left: x - 52, top: y - 52, width: 104, height: 104 }}>
      <div style={{ width: "100%", height: "100%", background: T.nodeBg, border: `2px solid ${border}`, borderRadius: trigger ? "36px 8px 8px 36px" : 8, boxShadow: active > 0 ? `0 0 0 ${4 + active * 5}px rgba(255,109,90,0.22)` : "0 2px 8px rgba(16,19,48,0.08)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {glyph(icon, color)}
        {done && (
          <div style={{ position: "absolute", top: -12, right: -12, width: 26, height: 26, borderRadius: "50%", background: T.ok, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24"><path d="M4.5 12.5 10 18 19.5 7" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        )}
      </div>
      <div style={{ marginTop: 10, textAlign: "center", color: T.label, fontSize: 16, fontWeight: 500, width: 190, marginLeft: -43 }}>{label}</div>
    </div>
  );
};

export default function N8nDataPacketFlow({ scene, durF }: { scene: any; durF: number }) {
  const frame = useCurrentFrame();
  const D = Math.max(durF, 120);
  const srcLabel = scene?.source_label || "Your Website";
  const destLabel = scene?.dest_label || "Telegram";
  const destIcon = scene?.dest_icon || "mail";
  const payload = scene?.payload || '{\n  "name": "Mg Moe",\n  "order": "#1024",\n  "total": 45000\n}';

  // stage anchors (1920x1080)
  const SRC = { x: 300, y: 540 };
  const WEBHOOK = { x: 880, y: 540 };
  const PROC = { x: 1230, y: 540 };
  const DEST = { x: 1580, y: 540 };

  // timeline fractions of D
  const seg = (a: number, b: number, ease = Easing.inOut(Easing.ease)) =>
    interpolate(frame, [D * a, D * b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

  const cardIn = spring({ frame: frame - 8, fps: FPS, config: { damping: 14, stiffness: 120 } });
  const shrink = seg(0.18, 0.26);          // payload card -> packet
  const hop1 = seg(0.26, 0.42);            // src -> webhook
  const hop2 = seg(0.5, 0.62);             // webhook -> processing
  const hop3 = seg(0.68, 0.8);             // processing -> destination
  const whActive = frame > D * 0.42 && frame < D * 0.5 ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
  const prActive = frame > D * 0.62 && frame < D * 0.68 ? 0.5 + 0.5 * Math.sin(frame / 3) : 0;
  const whDone = frame >= D * 0.5;
  const prDone = frame >= D * 0.68;
  const destDone = frame >= D * 0.82;

  // packet position
  let px = SRC.x + 130, py = SRC.y - 60;
  if (hop1 > 0) { px = interpolate(hop1, [0, 1], [SRC.x + 130, WEBHOOK.x - 60]); py = SRC.y - 60 + Math.sin(hop1 * Math.PI) * -50; }
  if (hop2 > 0) { px = interpolate(hop2, [0, 1], [WEBHOOK.x + 60, PROC.x - 60]); py = SRC.y - 60; }
  if (hop3 > 0) { px = interpolate(hop3, [0, 1], [PROC.x + 60, DEST.x - 60]); py = SRC.y - 60; }
  const packetVisible = shrink >= 1 && !destDone && (hop1 < 1 || hop2 > 0 || hop3 > 0) && !(hop1 >= 1 && hop2 === 0 && frame > D * 0.42 && frame < D * 0.5) && !(hop2 >= 1 && hop3 === 0 && frame > D * 0.62 && frame < D * 0.68);

  return (
    <AbsoluteFill style={{ background: T.canvas, fontFamily: "Inter, sans-serif" }}>
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(${T.dot} 1.6px, transparent 1.6px)`, backgroundSize: "22px 22px" }} />

      {/* external source app window */}
      <div style={{ position: "absolute", left: SRC.x - 170, top: SRC.y - 130, width: 340, height: 260, background: "#fff", border: `1px solid ${T.nodeBorder}`, borderRadius: 12, boxShadow: "0 14px 34px rgba(16,19,48,0.12)", transform: `scale(${0.7 + cardIn * 0.3})`, opacity: cardIn }}>
        <div style={{ height: 38, borderBottom: `1px solid ${T.nodeBorder}`, display: "flex", alignItems: "center", gap: 7, padding: "0 14px" }}>
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
          <span style={{ marginLeft: 10, color: T.label, fontSize: 14 }}>{srcLabel}</span>
        </div>
        <div style={{ padding: 18 }}>
          <div style={{ height: 14, width: "70%", background: "#eef0f4", borderRadius: 5, marginBottom: 10 }} />
          <div style={{ height: 14, width: "50%", background: "#eef0f4", borderRadius: 5, marginBottom: 18 }} />
          <div style={{ display: "inline-block", padding: "9px 20px", borderRadius: 7, background: T.primary, color: "#fff", fontSize: 15, fontWeight: 600, transform: frame > D * 0.14 && frame < D * 0.18 ? "scale(0.93)" : "scale(1)" }}>
            Submit Order
          </div>
          <div style={{ marginTop: 14, color: "#8a94a3", fontSize: 13, fontFamily: '"JetBrains Mono", monospace' }}>POST /webhook/order</div>
        </div>
      </div>

      {/* payload card that shrinks into a packet */}
      {frame > D * 0.1 && shrink < 1 && (
        <div style={{ position: "absolute", left: SRC.x - 60, top: SRC.y - 320, width: interpolate(shrink, [0, 1], [300, 34]), padding: interpolate(shrink, [0, 1], [16, 0]), background: "#1e2430", borderRadius: 10, boxShadow: "0 16px 40px rgba(16,19,48,0.35)", opacity: interpolate(frame, [D * 0.1, D * 0.13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), overflow: "hidden" }}>
          <pre style={{ margin: 0, color: "#9fe8b8", fontSize: interpolate(shrink, [0, 1], [17, 4]), fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.5 }}>{payload}</pre>
        </div>
      )}

      {/* travelling packet */}
      {packetVisible && (
        <div style={{ position: "absolute", left: px - 17, top: py - 17, width: 34, height: 34, borderRadius: 9, background: "#1e2430", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 6px rgba(46,163,111,0.18), 0 8px 20px rgba(16,19,48,0.3)` }}>
          <span style={{ color: "#9fe8b8", fontSize: 12, fontWeight: 800, fontFamily: '"JetBrains Mono", monospace' }}>{"{}"}</span>
        </div>
      )}

      {/* dashed request path + wires */}
      <svg style={{ position: "absolute", inset: 0 }} width="1920" height="1080">
        <path d={`M ${SRC.x + 175} ${SRC.y - 60} C ${SRC.x + 320} ${SRC.y - 130}, ${WEBHOOK.x - 260} ${SRC.y - 130}, ${WEBHOOK.x - 64} ${SRC.y - 30}`} stroke={T.wire} strokeWidth={2.2} strokeDasharray="7 8" fill="none" opacity={0.9} />
        <path d={`M ${WEBHOOK.x + 52} ${WEBHOOK.y} L ${PROC.x - 52} ${PROC.y}`} stroke={whDone ? T.ok : T.wire} strokeWidth={2.4} fill="none" />
        <path d={`M ${PROC.x + 52} ${PROC.y} L ${DEST.x - 52} ${DEST.y}`} stroke={prDone ? T.ok : T.wire} strokeWidth={2.4} fill="none" />
      </svg>

      {/* n8n nodes */}
      <N8nNode x={WEBHOOK.x} y={WEBHOOK.y} label="Webhook" icon="bolt" color="#8c5cf6" trigger active={whActive} done={whDone} />
      <N8nNode x={PROC.x} y={PROC.y} label="Edit Fields" icon="gear" color="#6b7684" active={prActive} done={prDone} />
      <N8nNode x={DEST.x} y={DEST.y} label={destLabel} icon={destIcon} color="#2a9edb" active={0} done={destDone} />
    </AbsoluteFill>
  );
}
