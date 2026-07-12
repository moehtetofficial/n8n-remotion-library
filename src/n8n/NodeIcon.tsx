import React from "react";

/* =============================================================================
   NodeIcon — inline SVG icons for common n8n nodes. No network / CDN needed,
   so it renders reliably in headless Chromium.

   Each icon is drawn on a rounded tile with the service's brand-ish color.
   Unknown slug -> generic gear.
   ========================================================================== */

type IconDef = { bg: string; svg: React.ReactNode };

const P = (d: string, fill = "#fff") => <path d={d} fill={fill} />;

const ICONS: Record<string, IconDef> = {
  webhook: {
    bg: "#6b4fe0",
    svg: (
      <svg viewBox="0 0 24 24" width="60%" height="60%">
        <path d="M10 8.5a3.5 3.5 0 1 1 5 3.15l2.1 3.6a3.5 3.5 0 1 1-1.7 1l-2.6-4.5a1 1 0 0 0-.9-.5H8.5a3.5 3.5 0 1 1 0-2H10z" fill="#fff" opacity="0.95"/>
      </svg>
    ),
  },
  http: {
    bg: "#2b6fe0",
    svg: (
      <svg viewBox="0 0 24 24" width="62%" height="62%">
        <circle cx="12" cy="12" r="9" fill="none" stroke="#fff" strokeWidth="1.6"/>
        <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="#fff" strokeWidth="1.3"/>
      </svg>
    ),
  },
  openai: {
    bg: "#10a37f",
    svg: (
      <svg viewBox="0 0 24 24" width="60%" height="60%">
        <path d="M12 3l7 4v10l-7 4-7-4V7z" fill="none" stroke="#fff" strokeWidth="1.4"/>
        <circle cx="12" cy="12" r="3" fill="#fff"/>
      </svg>
    ),
  },
  gemini: {
    bg: "#3b7ff2",
    svg: (
      <svg viewBox="0 0 24 24" width="62%" height="62%">
        <path d="M12 2c1 5 5 9 10 10-5 1-9 5-10 10-1-5-5-9-10-10 5-1 9-5 10-10z" fill="#fff"/>
      </svg>
    ),
  },
  gsheets: {
    bg: "#0f9d58",
    svg: (
      <svg viewBox="0 0 24 24" width="58%" height="58%">
        <rect x="5" y="3" width="14" height="18" rx="2" fill="#fff"/>
        <path d="M8 9h8M8 12h8M8 15h8M11 7v11" stroke="#0f9d58" strokeWidth="1.3"/>
      </svg>
    ),
  },
  code: {
    bg: "#e0863b",
    svg: (
      <svg viewBox="0 0 24 24" width="62%" height="62%">
        <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  telegram: {
    bg: "#2aabee",
    svg: (
      <svg viewBox="0 0 24 24" width="62%" height="62%">
        <path d="M21 4L3 11l5 2 2 6 3-4 5 4 3-15z" fill="#fff"/>
      </svg>
    ),
  },
  switch: {
    bg: "#8a4fe0",
    svg: (
      <svg viewBox="0 0 24 24" width="62%" height="62%">
        <path d="M4 8h8l4-4M4 8l4 4M12 16h4l4 4M20 20l-4-4" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  if: {
    bg: "#7b61ff",
    svg: (
      <svg viewBox="0 0 24 24" width="60%" height="60%">
        <path d="M12 3l4 4-4 4-4-4z" fill="#fff"/>
        <path d="M12 11v6M8 21h8" stroke="#fff" strokeWidth="1.6"/>
      </svg>
    ),
  },
  set: {
    bg: "#3f9",
    svg: (
      <svg viewBox="0 0 24 24" width="58%" height="58%">
        <rect x="4" y="5" width="16" height="3" rx="1.5" fill="#0a2"/>
        <rect x="4" y="10.5" width="16" height="3" rx="1.5" fill="#0a2"/>
        <rect x="4" y="16" width="16" height="3" rx="1.5" fill="#0a2"/>
      </svg>
    ),
  },
  schedule: {
    bg: "#e0be3b",
    svg: (
      <svg viewBox="0 0 24 24" width="60%" height="60%">
        <circle cx="12" cy="12" r="9" fill="none" stroke="#222" strokeWidth="1.6"/>
        <path d="M12 7v5l3 3" stroke="#222" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  merge: {
    bg: "#5b8def",
    svg: (
      <svg viewBox="0 0 24 24" width="60%" height="60%">
        <path d="M6 4v6a4 4 0 0 0 4 4h8M18 4v6a4 4 0 0 1-4 4" fill="none" stroke="#fff" strokeWidth="1.6"/>
        <path d="M15 11l3 3-3 3" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  agent: {
    bg: "#a855f7",
    svg: (
      <svg viewBox="0 0 24 24" width="60%" height="60%">
        <rect x="6" y="7" width="12" height="10" rx="3" fill="#fff"/>
        <circle cx="10" cy="12" r="1.3" fill="#a855f7"/>
        <circle cx="14" cy="12" r="1.3" fill="#a855f7"/>
        <path d="M12 4v3M9 17v3M15 17v3" stroke="#fff" strokeWidth="1.6"/>
      </svg>
    ),
  },
  gear: {
    bg: "#6a7488",
    svg: (
      <svg viewBox="0 0 24 24" width="60%" height="60%">
        <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9 4l-2-.5.7-1.9-1.4-1.4-1.9.7L15 5l-.5-2h-2L12 5l-1.9-.7L8.7 5.7 6.8 5 5.4 6.4l.7 1.9L4 8.8 3.5 11H2v2l2 .5-.7 1.9 1.4 1.4 1.9-.7L8 19l.5 2h2l.5-2 1.9.7 1.4-1.4-.7-1.9L15 15.2 17 15.5 20 15z" fill="#fff" opacity="0.9"/>
      </svg>
    ),
  },
};

export function renderNodeIcon(slug?: string, size = 46): React.ReactNode {
  const def = ICONS[(slug || "").toLowerCase()] || ICONS.gear;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: size * 0.28,
        background: def.bg, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.35)", flexShrink: 0,
      }}
    >
      {def.svg}
    </div>
  );
}

export const NodeIcon: React.FC<{ slug?: string; size?: number }> = ({ slug, size = 46 }) => (
  <>{renderNodeIcon(slug, size)}</>
);
