import React from "react";

/* =============================================================================
   WorkflowCanvas — the n8n editor canvas: dark background + dotted grid.
   Children (nodes, connections, cursor) are positioned on top.
   ========================================================================== */
export const WorkflowCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute", inset: 0,
      background: "#1a1a24",
      backgroundImage:
        "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
      backgroundSize: "26px 26px",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

/* =============================================================================
   Toolbar — n8n top bar with workflow name + Save + Active toggle.
   ========================================================================== */
export const Toolbar: React.FC<{ title?: string; active?: boolean }> = ({ title = "My workflow", active = false }) => (
  <div
    style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 52,
      background: "#2d2d3a", borderBottom: "1px solid #3a3a4d",
      display: "flex", alignItems: "center", padding: "0 20px", gap: 16, zIndex: 20,
      fontFamily: '"Inter","Segoe UI",sans-serif',
    }}
  >
    <div style={{ color: "#f0f2f8", fontSize: 20, fontWeight: 600 }}>{title}</div>
    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ color: "#b8bccc", fontSize: 16 }}>{active ? "Active" : "Inactive"}</div>
      <div
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: active ? "#ea4b71" : "#4a4a5e",
          position: "relative", transition: "none",
        }}
      >
        <div style={{ position: "absolute", top: 3, left: active ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff" }} />
      </div>
      <div style={{ padding: "8px 18px", background: "#ea4b71", borderRadius: 8, color: "#fff", fontSize: 16, fontWeight: 600 }}>Save</div>
    </div>
  </div>
);
