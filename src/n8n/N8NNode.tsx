import React from "react";
import { useCurrentFrame, spring } from "remotion";
import { UIElement, FPS } from "../core/types";
import { renderNodeIcon } from "./NodeIcon";

/* =============================================================================
   N8NNode — recreates the real n8n node card:
   rounded dark card, left icon tile, label under/beside, status indicator,
   input/output connector nubs. Spring entrance ("add node" pop).
   ========================================================================== */

const STATUS_COLOR: Record<string, string> = {
  success: "#12c47a",
  error: "#ff5f57",
  running: "#f5b942",
  idle: "#6a7488",
};

export const N8NNode: React.FC<{ el: UIElement; index?: number }> = ({ el, index = 0 }) => {
  const frame = useCurrentFrame();
  const appear = 4 + index * 5;
  const s = spring({ frame: frame - appear, fps: FPS, config: { damping: 15, stiffness: 120 } });
  const sc = 0.6 + s * 0.4;
  const op = Math.min(1, Math.max(0, (frame - appear) / 8));

  const w = el.w ?? 15;
  const h = el.h ?? 12;
  const statusColor = el.status ? STATUS_COLOR[el.status] : null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${el.x ?? 10}%`, top: `${el.y ?? 10}%`,
        width: `${w}%`, height: `${h}%`,
        transform: `scale(${sc})`, opacity: op,
        transformOrigin: "center",
      }}
    >
      {/* selection highlight */}
      {el.selected && (
        <div
          style={{
            position: "absolute", inset: -6,
            border: "2px solid #ea4b71", borderRadius: 16,
            boxShadow: "0 0 0 4px rgba(234,75,113,0.18)",
          }}
        />
      )}
      {/* card */}
      <div
        style={{
          width: "100%", height: "100%",
          background: "linear-gradient(180deg,#2d2d3a,#232331)",
          border: "1px solid #3a3a4d", borderRadius: 12,
          boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
          display: "flex", alignItems: "center", gap: 12,
          padding: "0 16px", boxSizing: "border-box", position: "relative",
        }}
      >
        {renderNodeIcon(el.icon, 46)}
        <div style={{ overflow: "hidden" }}>
          <div
            style={{
              color: "#f0f2f8", fontSize: el.fontSize ?? 20, fontWeight: 600,
              fontFamily: '"Inter","Segoe UI",sans-serif', whiteSpace: "nowrap",
              textOverflow: "ellipsis", overflow: "hidden",
            }}
          >
            {el.label}
          </div>
        </div>
        {/* input nub */}
        <div style={{ position: "absolute", left: -7, top: "50%", width: 12, height: 12, borderRadius: "50%", background: "#4a4a5e", border: "2px solid #6a6a80", transform: "translateY(-50%)" }} />
        {/* output nub */}
        <div style={{ position: "absolute", right: -7, top: "50%", width: 12, height: 12, borderRadius: "50%", background: "#ea4b71", border: "2px solid #ff7a9c", transform: "translateY(-50%)" }} />
        {/* status */}
        {statusColor && (
          <div style={{ position: "absolute", top: -6, right: -6, width: 16, height: 16, borderRadius: "50%", background: statusColor, border: "2px solid #1a1a24", boxShadow: `0 0 10px ${statusColor}` }} />
        )}
      </div>
    </div>
  );
};
