/* LsnCodeBlock — dark code panel with window chrome + typewriter reveal (self-contained).
   Regex token tinting (keyword/string/comment/number); no external highlighter.
   scene props:
     scene.code        the source string   [required]
     scene.filename    title-bar filename  (default "code.js")
     scene.cps         chars/sec reveal; 0 = show all instantly  (default 28)
     scene.font_size   px (default 28)
     scene.line_numbers boolean (default true)
   USE for showing JSON / JS / any code with a typing animation.
*/
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const MONO = "'JetBrains Mono', 'Fira Code', monospace";
const ED = {
  bg: "#1e1e2e", bar: "#181825", text: "#cdd6f4", keyword: "#cba6f7",
  string: "#a6e3a1", comment: "#6c7086", number: "#fab387", gutter: "#45475a",
  dot: ["#ff5f56", "#ffbd2e", "#27c93f"],
};
const KW = /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|async|await|new|class|extends|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false|this)\b/g;

function tintInline(chunk: string, base: number): React.ReactNode[] {
  if (!chunk) return [];
  const nodes: React.ReactNode[] = [];
  let last = 0, k = base;
  const re = new RegExp(KW.source + "|\\b\\d+(?:\\.\\d+)?\\b", "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(chunk)) !== null) {
    if (m.index > last) nodes.push(chunk.slice(last, m.index));
    const tok = m[0];
    const isNum = /^\d/.test(tok);
    nodes.push(<span key={`t${k++}`} style={{ color: isNum ? ED.number : ED.keyword }}>{tok}</span>);
    last = m.index + tok.length;
  }
  if (last < chunk.length) nodes.push(chunk.slice(last));
  return nodes;
}

function tint(src: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  src.split("\n").forEach((line, li) => {
    const parts: React.ReactNode[] = [];
    let rest = line, key = 0;
    const s = rest.indexOf("//"), h = rest.indexOf("#");
    const cands = [s, h].filter((x) => x >= 0);
    const cIdx = cands.length ? Math.min(...cands) : -1;
    let comment = "";
    if (cIdx >= 0) { comment = rest.slice(cIdx); rest = rest.slice(0, cIdx); }
    const strRe = /(["'`])(?:\\.|(?!\1).)*\1/g;
    let last = 0; let m: RegExpExecArray | null;
    while ((m = strRe.exec(rest)) !== null) {
      parts.push(...tintInline(rest.slice(last, m.index), key)); key += 100;
      parts.push(<span key={`s${li}-${key++}`} style={{ color: ED.string }}>{m[0]}</span>);
      last = m.index + m[0].length;
    }
    parts.push(...tintInline(rest.slice(last), key));
    if (comment) parts.push(<span key={`c${li}`} style={{ color: ED.comment, fontStyle: "italic" }}>{comment}</span>);
    out.push(<div key={`l${li}`} style={{ minHeight: "1.5em" }}>{parts.length ? parts : "\u00A0"}</div>);
  });
  return out;
}

const LsnCodeBlock: React.FC<{ scene: any; durF?: number }> = ({ scene }) => {
  const s = scene || {};
  const code: string = s.code || "";
  const filename: string = s.filename || "code.js";
  const cps: number = s.cps != null ? s.cps : 28;
  const fontSize: number = s.font_size || 28;
  const lineNumbers = s.line_numbers !== false;
  const width = s.width || 1200;
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shown = cps <= 0 ? code.length : Math.max(0, Math.floor((f / fps) * cps));
  const visible = code.slice(0, shown);
  const typing = shown < code.length;
  const lineCount = code.split("\n").length;

  return (
    <AbsoluteFill style={{ background: "#f9f9f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width, borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 60px rgba(16,19,48,0.18)", background: ED.bg, fontFamily: MONO }}>
        <div style={{ height: 52, background: ED.bar, display: "flex", alignItems: "center", paddingLeft: 24, gap: 10 }}>
          {ED.dot.map((c, i) => <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />)}
          <div style={{ marginLeft: 16, color: ED.text, fontSize: 22, opacity: 0.8, fontFamily: MONO }}>{filename}</div>
        </div>
        <div style={{ display: "flex", padding: 24 }}>
          {lineNumbers ? (
            <div style={{ color: ED.gutter, fontSize, lineHeight: 1.5, textAlign: "right", paddingRight: 24, userSelect: "none", minWidth: 48 }}>
              {Array.from({ length: lineCount }, (_, i) => <div key={i} style={{ minHeight: "1.5em" }}>{i + 1}</div>)}
            </div>
          ) : null}
          <div style={{ color: ED.text, fontSize, lineHeight: 1.5, whiteSpace: "pre", flex: 1 }}>
            {tint(visible)}
            {typing ? <span style={{ opacity: f % 16 < 8 ? 1 : 0, color: ED.text }}>▌</span> : null}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default LsnCodeBlock;
