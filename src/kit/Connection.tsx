import React from "react";
import { EDGE, EDGE_DARK, bezierPath, inputHandlePos, outputHandlePos } from "./tokens";

export interface ConnectionProps {
  /** source node top-left */
  from: { x: number; y: number };
  /** target node top-left */
  to: { x: number; y: number };
  /** 0..1 — draws the line in */
  progress?: number;
  dark?: boolean;
}

export const Connection: React.FC<ConnectionProps> = ({
  from,
  to,
  progress = 1,
  dark = false,
}) => {
  const E = dark ? EDGE_DARK : EDGE;
  const s = outputHandlePos(from.x, from.y);
  const t = inputHandlePos(to.x, to.y);
  const d = bezierPath(s.x, s.y, t.x, t.y);

  // rough path length for the draw-in dash animation
  const len = Math.hypot(t.x - s.x, t.y - s.y) * 1.35;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={E.color}
        strokeWidth={E.width}
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
        strokeLinecap="round"
      />
      {/* arrow head at the target handle */}
      {progress > 0.98 && (
        <polygon
          points={`${t.x - 7},${t.y - 4.5} ${t.x - 1},${t.y} ${t.x - 7},${t.y + 4.5}`}
          fill={E.color}
        />
      )}
    </svg>
  );
};
