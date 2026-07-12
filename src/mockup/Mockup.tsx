import React from "react";

/* =============================================================================
   Mockup — window chrome (mac / browser / terminal). Holds the surface content.
   The content area is positioned absolutely so children use % coordinates.
   ========================================================================== */
export const Mockup: React.FC<{
  kind?: "mac" | "browser" | "terminal" | "canvas" | "none";
  title?: string;
  children: React.ReactNode;
}> = ({ kind = "browser", title = "n8n", children }) => {
  const isTerm = kind === "terminal";

  if (kind === "none" || kind === "canvas") {
    // bare surface (canvas draws its own bg)
    return <div style={{ position: "absolute", inset: 0 }}>{children}</div>;
  }

  return (
    <div
      style={{
        width: "100%", height: "100%",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(234,75,113,0.12)",
        background: isTerm ? "#0b0f16" : "#1a1a24",
        position: "relative",
      }}
    >
      {/* title bar */}
      <div
        style={{
          height: 44, background: "linear-gradient(180deg,#2d2d3a,#232331)",
          display: "flex", alignItems: "center", padding: "0 16px", gap: 8,
          borderBottom: "1px solid #3a3a4d",
        }}
      >
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#febc2e" }} />
        <span style={{ width: 13, height: 13, borderRadius: "50%", background: "#28c840" }} />
        {kind === "browser" ? (
          <div
            style={{
              marginLeft: 16, flex: 1, height: 26, background: "#12121a",
              borderRadius: 13, display: "flex", alignItems: "center",
              padding: "0 14px", color: "#7f84a0", fontSize: 15,
              fontFamily: '"Inter",sans-serif',
            }}
          >
            {title}
          </div>
        ) : (
          <div style={{ marginLeft: "auto", marginRight: "auto", color: "#9aa0b4", fontSize: 15, fontFamily: '"Inter",sans-serif', fontWeight: 500 }}>
            {title}
          </div>
        )}
      </div>
      {/* content */}
      <div style={{ position: "absolute", top: 44, left: 0, right: 0, bottom: 0 }}>
        {children}
      </div>
    </div>
  );
};
