/**
 * CodeBlock — dark code panel with window chrome + typewriter reveal.
 * Lightweight token tinting (keywords / strings / comments / numbers) —
 * regex-based, language-agnostic, deterministic (no external highlighter).
 * Reveals character-by-character based on frame; caret blinks while typing.
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { font, type, radius, space, shadow } from '../tokens';

export type CodeBlockProps = {
  code: string;
  /** filename shown in the title bar */
  filename?: string;
  /** characters per second for the reveal; 0 = show all immediately */
  cps?: number;
  at?: number;
  /** font size override */
  fontSize?: number;
  /** show line numbers */
  lineNumbers?: boolean;
  width?: number | string;
};

// dark editor palette (independent of the light UI theme)
const editor = {
  bg: '#1e1e2e',
  bar: '#181825',
  text: '#cdd6f4',
  keyword: '#cba6f7',
  string: '#a6e3a1',
  comment: '#6c7086',
  number: '#fab387',
  gutter: '#45475a',
  dot: ['#ff5f56', '#ffbd2e', '#27c93f'],
};

const KEYWORDS =
  /\b(const|let|var|function|return|if|else|for|while|import|from|export|default|async|await|new|class|extends|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false|this)\b/g;

/** Escape HTML-sensitive chars, then wrap tokens in tinted spans. */
function tint(src: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const lines = src.split('\n');
  lines.forEach((line, li) => {
    const parts: React.ReactNode[] = [];
    let rest = line;
    let key = 0;

    // comment: everything after // (or # ) to end of line
    const cIdx = (() => {
      const s = rest.indexOf('//');
      const h = rest.indexOf('#');
      const cands = [s, h].filter((x) => x >= 0);
      return cands.length ? Math.min(...cands) : -1;
    })();
    let comment = '';
    if (cIdx >= 0) {
      comment = rest.slice(cIdx);
      rest = rest.slice(0, cIdx);
    }

    // tokenize the non-comment portion by strings first
    const strRe = /(["'`])(?:\\.|(?!\1).)*\1/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = strRe.exec(rest)) !== null) {
      const before = rest.slice(last, m.index);
      parts.push(...tintInline(before, key));
      key += 100;
      parts.push(
        <span key={`s${li}-${key++}`} style={{ color: editor.string }}>
          {m[0]}
        </span>
      );
      last = m.index + m[0].length;
    }
    parts.push(...tintInline(rest.slice(last), key));

    if (comment) {
      parts.push(
        <span key={`c${li}`} style={{ color: editor.comment, fontStyle: 'italic' }}>
          {comment}
        </span>
      );
    }

    out.push(
      <div key={`l${li}`} style={{ minHeight: '1.5em' }}>
        {parts.length ? parts : '\u00A0'}
      </div>
    );
  });
  return out;
}

/** tint keywords + numbers inside a plain (non-string, non-comment) chunk */
function tintInline(chunk: string, baseKey: number): React.ReactNode[] {
  if (!chunk) return [];
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let k = baseKey;
  const combined = new RegExp(
    KEYWORDS.source + '|\\b\\d+(?:\\.\\d+)?\\b',
    'g'
  );
  let m: RegExpExecArray | null;
  while ((m = combined.exec(chunk)) !== null) {
    if (m.index > last) nodes.push(chunk.slice(last, m.index));
    const tok = m[0];
    const isNum = /^\d/.test(tok);
    nodes.push(
      <span key={`t${k++}`} style={{ color: isNum ? editor.number : editor.keyword }}>
        {tok}
      </span>
    );
    last = m.index + tok.length;
  }
  if (last < chunk.length) nodes.push(chunk.slice(last));
  return nodes;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  filename = 'code.js',
  cps = 28,
  at = 0,
  fontSize = type.body,
  lineNumbers = true,
  width = 1200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shown =
    cps <= 0
      ? code.length
      : Math.max(0, Math.floor(((frame - at) / fps) * cps));
  const visible = code.slice(0, shown);
  const typing = shown < code.length && frame >= at;
  const lineCount = code.split('\n').length;

  return (
    <div
      style={{
        width,
        borderRadius: radius.lg,
        overflow: 'hidden',
        boxShadow: shadow.lg,
        background: editor.bg,
        fontFamily: font.mono,
      }}
    >
      {/* title bar */}
      <div
        style={{
          height: 52,
          background: editor.bar,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: space.md,
          gap: 10,
        }}
      >
        {editor.dot.map((c, i) => (
          <div
            key={i}
            style={{ width: 14, height: 14, borderRadius: '50%', background: c }}
          />
        ))}
        <div
          style={{
            marginLeft: space.sm,
            color: editor.text,
            fontSize: type.small,
            opacity: 0.8,
            fontFamily: font.mono,
          }}
        >
          {filename}
        </div>
      </div>

      {/* code area */}
      <div style={{ display: 'flex', padding: space.md }}>
        {lineNumbers ? (
          <div
            style={{
              color: editor.gutter,
              fontSize,
              lineHeight: 1.5,
              textAlign: 'right',
              paddingRight: space.md,
              userSelect: 'none',
              minWidth: 48,
            }}
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} style={{ minHeight: '1.5em' }}>
                {i + 1}
              </div>
            ))}
          </div>
        ) : null}
        <div
          style={{
            color: editor.text,
            fontSize,
            lineHeight: 1.5,
            whiteSpace: 'pre',
            flex: 1,
          }}
        >
          {tint(visible)}
          {typing ? (
            <span style={{ opacity: frame % 16 < 8 ? 1 : 0, color: editor.text }}>
              ▌
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
