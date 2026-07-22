import React from "react";
import { CANVAS, CANVAS_DARK } from "./tokens";

/**
 * n8n canvas dot grid.
 * vue-flow `<Background>` renders an SVG <pattern> of circles at
 * `gap = GRID_SIZE` (16). Each dot is a 1px-radius circle.
 */
export const CanvasBackground: React.FC<{
  /** viewport offset, so the pattern scrolls with the canvas */
  offsetX?: number;
  offsetY?: number;
  dark?: boolean;
}> = ({ offsetX = 0, offsetY = 0, dark = false }) => {
  const C = dark ? CANVAS_DARK : CANVAS;
  const g = C.dotGap;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: C.bg,
      }}
    >
      <svg width="100%" height="100%" style={{ display: "block" }}>
        <defs>
          <pattern
            id="n8n-dots"
            x={offsetX % g}
            y={offsetY % g}
            width={g}
            height={g}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={C.dotRadius}
              cy={C.dotRadius}
              r={C.dotRadius}
              fill={C.dotColor}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#n8n-dots)" />
      </svg>
    </div>
  );
};
