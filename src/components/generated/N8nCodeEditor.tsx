import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from "remotion";

/* N8nCodeEditor — recreates the real n8n Node Details View (NDV) for the Code
   node: dimmed canvas behind, modal with INPUT | editor | OUTPUT panels,
   frame-driven code typing, then "Test step" fires and OUTPUT populates.
   scene props (optional):
     scene.node_name    default "Code"
     scene.code         code string (typed char by char)
     scene.input_json   left panel JSON string
     scene.output_json  right panel JSON string
*/

const FPS = 30;
const T = {
  dim: "rgba(24,28,38,0.55)", modal: "#ffffff", border: "#e4e7ec",
  panel: "#f7f8fa", primary: "#ff6d5a", ok: "#2ea36f", text: "#37424e", sub: "#7a8595",
};

// tiny JS syntax colorizer (keywords / strings / numbers)
const KW = /\b(return|const|let|var|function|if|else|for|map|new|typeof|await|async)\b/g;
const colorize = (line: string, key: number) => {
  const parts: React.ReactNode[] = [];
  let rest = line, i = 0;
  const push = (txt: string, color?: string) => parts.push(<span key={key + "-" + i++} style={color ? { color } : undefined}>{txt}</span>);
  while (rest.length) {
    const str = rest.match(/^("[^"]*"?|'[^']*'?)/);
    if (str) { push(str[0], "#0f8a4f"); rest = rest.slice(str[0].length); continue; }
    const num = rest.match(/^\d+(\.\d+)?/);
    if (num) { push(num[0], "#c05621"); rest = rest.slice(num[0].length); continue; }
    const kw = rest.match(KW);
    const idx = kw ? rest.search(KW) : -1;
    if (idx === 0 && kw) { push(kw[0], "#7c3aed"); rest = rest.slice(kw[0].length); continue; }
    const next = Math.min(...[rest.search(/["']/), rest.search(/\d/), idx].filter((n) => n > 0), rest.length);
    push(rest.slice(0, next || 1)); rest = rest.slice(next || 1);
  }
  return parts;
};

const DEFAULT_CODE = `const items = $input.all();

return items.map(item => ({
  json: {
    name: item.json.name,
    total: item.json.qty * item.json.price,
    status: "processed"
  }
}));`;

const DEFAULT_IN = `[
  {
    "name": "Mg Moe",
    "qty": 3,
    "price": 15000
  }
]`;

const DEFAULT_OUT = `[
  {
    "name": "Mg Moe",
    "total": 45000,
    "status": "processed"
  }
]`;

export default function N8nCodeEditor({ scene, durF }: { scene: any; durF: number }) {
  const frame = useCurrentFrame();
  const D = Math.max(durF, 120);
  const code: string = scene?.code || DEFAULT_CODE;
  const inputJson: string = scene?.input_json || DEFAULT_IN;
  const outputJson: string = scene?.output_json || DEFAULT_OUT;
  const nodeName: string = scene?.node_name || "Code";

  const modalIn = spring({ frame: frame - 4, fps: FPS, config: { damping: 15, stiffness: 130 } });

  // typing: 8% -> 62% of duration
  const typeT = interpolate(frame, [D * 0.08, D * 0.62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shown = code.slice(0, Math.floor(code.length * typeT));
  const lines = shown.split("\n");
  const caretOn = Math.floor(frame / 8) % 2 === 0 && typeT < 1;

  // test step click at 68%, output appears 72%
  const clickT = frame > D * 0.66 && frame < D * 0.7;
  const outT = interpolate(frame, [D * 0.72, D * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outLines = outputJson.split("\n");

  const panelHead = (label: string, badge?: string) => (
    <div style={{ height: 44, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 10 }}>
      <span style={{ color: T.text, fontSize: 15, fontWeight: 600 }}>{label}</span>
      {badge && <span style={{ fontSize: 12, color: T.ok, background: "#eaf6f0", border: `1px solid ${T.ok}`, borderRadius: 4, padding: "2px 8px" }}>{badge}</span>}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: "#f9f9f9", fontFamily: "Inter, sans-serif" }}>
      {/* faint canvas + dim (NDV opens above the editor) */}
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(#dcdce3 1.6px, transparent 1.6px)", backgroundSize: "22px 22px" }} />
      <AbsoluteFill style={{ background: T.dim }} />

      {/* NDV modal */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 90, bottom: 90, background: T.modal, borderRadius: 10, boxShadow: "0 30px 80px rgba(10,14,24,0.45)", transform: `scale(${0.92 + modalIn * 0.08})`, opacity: modalIn, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* modal header — node icon, name, Test step button */}
        <div style={{ height: 62, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: 7, background: "#1e2430", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="19" height="19" viewBox="0 0 24 24"><path d="M8.7 16.3 4.4 12l4.3-4.3 1.4 1.4L7.2 12l2.9 2.9-1.4 1.4zm6.6 0-1.4-1.4 2.9-2.9-2.9-2.9 1.4-1.4L19.6 12l-4.3 4.3z" fill="#fff" /></svg>
          </div>
          <span style={{ color: T.text, fontSize: 18, fontWeight: 600 }}>{nodeName}</span>
          <div style={{ marginLeft: "auto", padding: "9px 20px", borderRadius: 6, background: T.primary, color: "#fff", fontSize: 15, fontWeight: 600, transform: clickT ? "scale(0.94)" : "scale(1)", boxShadow: clickT ? "0 0 0 6px rgba(255,109,90,0.25)" : "none" }}>
            ▷ Test step
          </div>
          <span style={{ color: T.sub, fontSize: 22, marginLeft: 6 }}>✕</span>
        </div>

        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* INPUT panel */}
          <div style={{ width: "24%", borderRight: `1px solid ${T.border}`, background: T.panel, display: "flex", flexDirection: "column" }}>
            {panelHead("INPUT", "1 item")}
            <pre style={{ margin: 0, padding: 16, color: "#4a5563", fontSize: 15, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.55 }}>{inputJson}</pre>
          </div>

          {/* editor */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ height: 44, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 14 }}>
              <span style={{ color: T.text, fontSize: 14, fontWeight: 600, borderBottom: `2px solid ${T.primary}`, paddingBottom: 10, marginTop: 12 }}>Parameters</span>
              <span style={{ color: T.sub, fontSize: 14 }}>Settings</span>
              <span style={{ marginLeft: "auto", color: T.sub, fontSize: 13 }}>JavaScript ▾ · Run Once for All Items</span>
            </div>
            <div style={{ flex: 1, padding: "16px 0", overflow: "hidden", background: "#fdfdfe" }}>
              {lines.map((ln, i) => (
                <div key={i} style={{ display: "flex", fontFamily: '"JetBrains Mono", monospace', fontSize: 17, lineHeight: 1.65 }}>
                  <span style={{ width: 52, textAlign: "right", paddingRight: 16, color: "#b6bdc7", userSelect: "none" }}>{i + 1}</span>
                  <span style={{ color: "#37424e", whiteSpace: "pre" }}>
                    {colorize(ln, i)}
                    {i === lines.length - 1 && caretOn && <span style={{ borderLeft: `2px solid ${T.primary}`, marginLeft: 1 }} />}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* OUTPUT panel */}
          <div style={{ width: "24%", borderLeft: `1px solid ${T.border}`, background: T.panel, display: "flex", flexDirection: "column" }}>
            {panelHead("OUTPUT", outT > 0 ? "1 item" : undefined)}
            {outT === 0 ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#9aa4b2", fontSize: 14, textAlign: "center", padding: 20 }}>
                Execute this node to view data
              </div>
            ) : (
              <pre style={{ margin: 0, padding: 16, color: "#4a5563", fontSize: 15, fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.55 }}>
                {outLines.slice(0, Math.ceil(outLines.length * outT)).join("\n")}
              </pre>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
