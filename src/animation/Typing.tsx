import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS } from "../core/types";

/* =============================================================================
   Typing — typewriter reveal of a string, frame-driven.
   startAt = seconds; speed = chars/second (default 18).
   Shows a blinking caret while typing.
   ========================================================================== */
export const Typing: React.FC<{
  text: string;
  startAt?: number;
  speed?: number;
  style?: React.CSSProperties;
}> = ({ text, startAt = 0, speed = 18, style }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS - startAt;
  const chars = Math.max(0, Math.floor(t * speed));
  const shown = text.slice(0, Math.min(text.length, chars));
  const done = chars >= text.length;
  const caretOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <span style={style}>
      {shown}
      {(!done || caretOn) && (
        <span style={{ opacity: caretOn ? 1 : 0.15, color: "#ea4b71", fontWeight: 700 }}>|</span>
      )}
    </span>
  );
};
