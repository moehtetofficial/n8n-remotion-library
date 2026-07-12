import React from "react";
import { UIElement } from "../core/types";
import { N8NNode } from "./N8NNode";

/* =============================================================================
   UIElementView — routes a UIElement to the right renderer.
   node -> N8NNode (rich). everything else -> lightweight primitives.
   ========================================================================== */
export const UIElementView: React.FC<{ el: UIElement; index?: number }> = ({ el, index = 0 }) => {
  if (el.kind === "node") return <N8NNode el={el} index={index} />;

  const base: React.CSSProperties = {
    position: "absolute",
    left: `${el.x ?? 10}%`, top: `${el.y ?? 10}%`,
    width: `${el.w ?? 20}%`, height: `${el.h ?? 8}%`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: '"Inter","Segoe UI",sans-serif',
    fontSize: el.fontSize ?? 18, color: "#e6edf7", boxSizing: "border-box",
  };

  switch (el.kind) {
    case "button":
      return <div style={{ ...base, background: el.color ?? "#ea4b71", borderRadius: 8, fontWeight: 600, color: "#fff" }}>{el.label}</div>;
    case "input":
      return <div style={{ ...base, background: "#12121a", border: "1px solid #3a3a4d", borderRadius: 8, justifyContent: "flex-start", padding: "0 12px", color: "#8a90a6" }}>{el.label}</div>;
    case "panel":
    case "sidebar":
      return <div style={{ ...base, background: "rgba(35,35,49,0.92)", border: "1px solid #3a3a4d", borderRadius: 12, alignItems: "flex-start", justifyContent: "flex-start", padding: 14, flexDirection: "column", color: "#c6cbdb" }}>{el.label}</div>;
    case "tab":
      return <div style={{ ...base, background: el.selected ? "#1a1a24" : "transparent", borderBottom: el.selected ? "2px solid #ea4b71" : "2px solid transparent", color: el.selected ? "#fff" : "#9aa0b4", fontWeight: 500 }}>{el.label}</div>;
    case "text":
      return <div style={{ ...base, background: "transparent", fontWeight: 500 }}>{el.label}</div>;
    case "toolbar":
      return <div style={{ ...base, background: "#2d2d3a", borderBottom: "1px solid #3a3a4d", justifyContent: "flex-start", padding: "0 16px", color: "#f0f2f8", fontWeight: 600 }}>{el.label}</div>;
    default:
      return <div style={{ ...base, background: "rgba(45,45,58,0.7)", border: "1px solid #3a3a4d", borderRadius: 8 }}>{el.label}</div>;
  }
};
