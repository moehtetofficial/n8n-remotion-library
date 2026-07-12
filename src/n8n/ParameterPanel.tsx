import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { UIElement, TypeAction } from "../core/types";
import { Typing } from "../animation/Typing";
import { renderNodeIcon } from "./NodeIcon";

/* =============================================================================
   ParameterPanel — the n8n node settings drawer that slides in from the right.
   Renders labelled fields; a field whose label matches a typing action gets
   the typewriter treatment.
   ========================================================================== */
export const ParameterPanel: React.FC<{
  el: UIElement;               // panel element: label=title, icon=node icon
  fields?: { label: string; value?: string }[];
  typing?: TypeAction[];
}> = ({ el, fields = [], typing = [] }) => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [2, 16], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = interpolate(frame, [2, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const typeFor = (label: string) => typing.find((t) => t.target === label);

  return (
    <div
      style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: `${el.w ?? 34}%`,
        background: "#232331", borderLeft: "1px solid #3a3a4d",
        transform: `translateX(${slide}%)`, opacity: op,
        zIndex: 30, padding: "24px 26px", boxSizing: "border-box",
        fontFamily: '"Inter","Segoe UI",sans-serif',
        boxShadow: "-20px 0 50px rgba(0,0,0,0.4)",
      }}
    >
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        {renderNodeIcon(el.icon, 40)}
        <div style={{ color: "#f0f2f8", fontSize: 24, fontWeight: 700 }}>{el.label}</div>
      </div>
      {/* fields */}
      {fields.map((f, i) => {
        const ta = typeFor(f.label);
        return (
          <div key={i} style={{ marginBottom: 20 }}>
            <div style={{ color: "#9aa0b4", fontSize: 15, marginBottom: 8, fontWeight: 500 }}>{f.label}</div>
            <div
              style={{
                background: "#1a1a24", border: "1px solid #3a3a4d", borderRadius: 8,
                padding: "12px 14px", color: "#e6e9f2", fontSize: 17, minHeight: 22,
                fontFamily: ta ? '"JetBrains Mono",monospace' : "inherit",
              }}
            >
              {ta ? (
                <Typing text={ta.value} startAt={ta.at ?? 0} speed={ta.speed ?? 18} />
              ) : (
                f.value || ""
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
