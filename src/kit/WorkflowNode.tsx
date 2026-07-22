import React from "react";
import { GRID, NODE, HANDLE, TEXT, FONT, nodeRadius, theme } from "./tokens";
import { NodeIcon, iconForType, TRIGGER_TYPES } from "./nodeIcons";

export interface WorkflowNodeProps {
  type: string;
  name: string;
  /** top-left corner, canvas coordinates */
  x: number;
  y: number;
  subtitle?: string;
  /** 0..1 — drives the appear animation; 1 = fully visible */
  progress?: number;
  dark?: boolean;
}

const Handle: React.FC<{ side: "in" | "out"; dark?: boolean }> = ({ side, dark }) => {
  const H = theme(!!dark).HANDLE;
  return (
  <div
    style={{
      position: "absolute",
      top: "50%",
      [side === "in" ? "left" : "right"]: 0,
      transform: `translate(${side === "in" ? "-50%" : "50%"}, -50%)`,
      width: H.size,
      height: H.size,
      borderRadius: "50%",
      background: H.bg,
      border: `${H.borderWidth}px solid ${H.borderColor}`,
      boxSizing: "border-box",
      zIndex: 2,
    }}
  />
  );
};

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  type,
  name,
  x,
  y,
  subtitle,
  progress = 1,
  dark = false,
}) => {
  const isTrigger = TRIGGER_TYPES.has(type);
  const T = theme(dark);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: GRID.nodeW,
        height: GRID.nodeH,
        opacity: progress,
        transform: `scale(${0.94 + 0.06 * progress})`,
        transformOrigin: "center",
      }}
    >
      {/* node body */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          background: T.NODE.bg,
          backgroundClip: "padding-box",
          border: `${T.NODE.borderWidth}px solid ${T.NODE.borderColor}`,
          borderRadius: nodeRadius(isTrigger),
          boxShadow: T.NODE.shadow,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NodeIcon
          name={iconForType(type)}
          size={T.NODE.iconSize}
          color={T.TEXT.color}
        />
        {/* triggers have no input handle */}
        {!isTrigger && <Handle side="in" dark={dark} />}
        <Handle side="out" dark={dark} />
      </div>

      {/* label sits BELOW the node — n8n: top:100%, min-width 2x node */}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: 8,
          minWidth: GRID.nodeW * 2,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          pointerEvents: "none",
          fontFamily: FONT.sans,
        }}
      >
        <div
          style={{
            fontSize: T.TEXT.labelSize,
            fontWeight: T.TEXT.weightMedium,
            lineHeight: T.TEXT.lineHeight,
            color: T.TEXT.color,
            textAlign: "center",
          }}
        >
          {name}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: T.TEXT.subtitleSize,
              fontWeight: T.TEXT.weightRegular,
              lineHeight: T.TEXT.lineHeight,
              color: T.TEXT.tint1,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
