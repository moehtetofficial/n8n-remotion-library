import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { GRID, theme, FONT } from "./tokens";
import { NodeIcon, iconForType } from "./nodeIcons";

/**
 * AI sub-nodes — the small rounded pills that hang BELOW an AI Agent
 * (Chat Model, Memory, Tool) and connect upward with a dashed line.
 *
 * n8n draws these with `configurationRadius` (40px) corners on a
 * 256x96 body, connected by a vertical dashed edge to a diamond
 * handle on the parent's underside.
 */

export type SubNodeKind = "languageModel" | "memory" | "tool" | "outputParser";

const KIND_LABEL: Record<SubNodeKind, string> = {
  languageModel: "Chat Model",
  memory: "Memory",
  tool: "Tool",
  outputParser: "Output Parser",
};

export interface SubNodeSpec {
  kind: SubNodeKind;
  name: string;
  type: string;
  /** required slots render a red asterisk when empty, like n8n */
  required?: boolean;
}

export interface SubNodeProps extends SubNodeSpec {
  /** top-left of the sub-node pill, canvas coordinates */
  x: number;
  y: number;
  atFrame?: number;
  dark?: boolean;
}

export const SubNode: React.FC<SubNodeProps> = ({
  kind,
  name,
  type,
  x,
  y,
  atFrame = 0,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const T = theme(dark);

  const t = interpolate(frame, [atFrame, atFrame + 14], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < atFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: GRID.configurableW,
        height: GRID.configurableH,
        opacity: t,
        transform: `translateY(${(1 - t) * 14}px)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: T.NODE.bg,
          border: `${T.NODE.borderWidth}px solid ${T.NODE.borderColor}`,
          borderRadius: GRID.configurationRadius,
          boxShadow: T.NODE.shadow,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "0 28px",
        }}
      >
        <NodeIcon name={iconForType(type)} size={36} color={T.TEXT.color} />
        <div style={{ fontFamily: FONT.sans, overflow: "hidden" }}>
          <div
            style={{
              fontSize: T.TEXT.labelSize,
              fontWeight: T.TEXT.weightMedium,
              color: T.TEXT.color,
              lineHeight: T.TEXT.lineHeight,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: T.TEXT.subtitleSize,
              color: T.TEXT.tint1,
              lineHeight: T.TEXT.lineHeight,
            }}
          >
            {KIND_LABEL[kind]}
          </div>
        </div>
        {/* diamond handle on the pill's top edge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: 11,
            height: 11,
            transform: "translate(-50%, -50%) rotate(45deg)",
            background: T.NODE.bg,
            border: `1px solid ${T.HANDLE.borderColor}`,
            boxSizing: "border-box",
          }}
        />
      </div>
    </div>
  );
};

/** Dashed vertical edge from a parent node's underside to a sub-node. */
export const SubNodeConnection: React.FC<{
  /** parent attachment point (canvas coords) */
  from: { x: number; y: number };
  /** sub-node attachment point (canvas coords) */
  to: { x: number; y: number };
  atFrame?: number;
  dark?: boolean;
}> = ({ from, to, atFrame = 0, dark = false }) => {
  const frame = useCurrentFrame();
  const T = theme(dark);
  const progress = interpolate(frame, [atFrame, atFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (frame < atFrame) return null;

  const midY = from.y + (to.y - from.y) * 0.5;
  const d = `M${from.x},${from.y} C${from.x},${midY} ${to.x},${midY} ${to.x},${to.y}`;
  const len = Math.hypot(to.x - from.x, to.y - from.y) * 1.3;

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
        stroke={T.EDGE.color}
        strokeWidth={T.EDGE.width}
        strokeDasharray="6 5"
        strokeDashoffset={len * (1 - progress)}
        strokeLinecap="round"
        opacity={progress}
      />
    </svg>
  );
};

/**
 * Lay a row of sub-nodes out beneath a parent node, matching n8n's
 * spacing, and return both the pills and their dashed connections.
 */
export const SubNodeRow: React.FC<{
  parentX: number;
  parentY: number;
  parentW?: number;
  subs: SubNodeSpec[];
  gapY?: number;
  gapX?: number;
  atFrame?: number;
  staggerF?: number;
  dark?: boolean;
}> = ({
  parentX,
  parentY,
  parentW = GRID.agentW,
  subs,
  gapY = 150,
  gapX = 40,
  atFrame = 0,
  staggerF = 6,
  dark = false,
}) => {
  const totalW = subs.length * GRID.configurableW + (subs.length - 1) * gapX;
  const startX = parentX + parentW / 2 - totalW / 2;
  const y = parentY + GRID.agentH + gapY;
  const parentAnchor = { x: parentX + parentW / 2, y: parentY + GRID.agentH };

  return (
    <>
      {subs.map((s, i) => {
        const sx = startX + i * (GRID.configurableW + gapX);
        const f = atFrame + i * staggerF;
        return (
          <React.Fragment key={s.name}>
            <SubNodeConnection
              from={parentAnchor}
              to={{ x: sx + GRID.configurableW / 2, y }}
              atFrame={f}
              dark={dark}
            />
            <SubNode {...s} x={sx} y={y} atFrame={f + 4} dark={dark} />
          </React.Fragment>
        );
      })}
    </>
  );
};
