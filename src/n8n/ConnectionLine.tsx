import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { UIElement, ConnSpec, FPS } from "../core/types";

/* =============================================================================
   ConnectionLine — draws n8n-style bezier connectors between node cards.
   - line "draws in" (stroke-dashoffset) as the scene starts
   - animated flow dots travel along the path when animated=true
   Coordinates resolved from the node UIElements by label.
   ========================================================================== */

function centerOf(el: UIElement, side: "out" | "in") {
  const x = (el.x ?? 10) + (side === "out" ? (el.w ?? 15) : 0);
  const y = (el.y ?? 10) + (el.h ?? 12) / 2;
  return { x, y };
}

export const ConnectionLayer: React.FC<{
  nodes: UIElement[];
  connections: ConnSpec[];
  surfaceW: number;   // px, for coordinate math
  surfaceH: number;
}> = ({ nodes, connections, surfaceW, surfaceH }) => {
  const frame = useCurrentFrame();
  const byLabel: Record<string, UIElement> = {};
  nodes.forEach((n) => { if (n.label) byLabel[n.label] = n; });

  return (
    <svg
      width={surfaceW}
      height={surfaceH}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}
    >
      {connections.map((c, i) => {
        const a = byLabel[c.from];
        const b = byLabel[c.to];
        if (!a || !b) return null;
        const p1 = centerOf(a, "out");
        const p2 = centerOf(b, "in");
        const x1 = (p1.x / 100) * surfaceW;
        const y1 = (p1.y / 100) * surfaceH;
        const x2 = (p2.x / 100) * surfaceW;
        const y2 = (p2.y / 100) * surfaceH;
        const dx = Math.max(40, Math.abs(x2 - x1) * 0.5);
        const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

        const drawStart = 6 + i * 4;
        const draw = interpolate(frame, [drawStart, drawStart + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // approximate path length for dash
        const len = Math.hypot(x2 - x1, y2 - y1) + dx;

        // flow dot position along the curve (t 0..1)
        const t = ((frame % 60) / 60);
        const flow = cubicPoint(x1, y1, x1 + dx, y1, x2 - dx, y2, x2, y2, t);

        return (
          <g key={i}>
            <path
              d={d}
              fill="none"
              stroke="#4a4a5e"
              strokeWidth={3}
              strokeDasharray={len}
              strokeDashoffset={len * (1 - draw)}
              strokeLinecap="round"
            />
            {c.animated && draw > 0.9 && (
              <>
                <circle cx={flow.x} cy={flow.y} r={5} fill="#ea4b71" />
                <circle cx={flow.x} cy={flow.y} r={9} fill="#ea4b71" opacity={0.3} />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

function cubicPoint(
  x0: number, y0: number, x1: number, y1: number,
  x2: number, y2: number, x3: number, y3: number, t: number
) {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  return {
    x: a * x0 + b * x1 + c * x2 + d * x3,
    y: a * y0 + b * y1 + c * y2 + d * y3,
  };
}
