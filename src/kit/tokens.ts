/**
 * n8n canvas design tokens — extracted from n8n-io/n8n@master packages/frontend
 *
 * DO NOT hand-edit. Regenerate with scripts/extract-n8n-tokens.py
 * Source files:
 *   design-system/src/css/_primitives.scss   (raw scale)
 *   design-system/src/css/_tokens.scss       (semantic layer, light theme)
 *   editor-ui/src/app/utils/nodeViewUtils.ts (geometry constants)
 *   editor-ui/.../canvas/.../_canvasNodeStyles.scss
 */

/** Canvas grid. All n8n node positions snap to this. */
export const GRID = {
  size: 16,
  nodeW: 96,
  nodeH: 96,
  configurableW: 256,
  configurableH: 96,
  configurationRadius: 40,
  agentW: 320,
  agentH: 128,
  nodeXSpacing: 128,
  /** default x-distance between two chained nodes */
  horizontalStep: 224,
} as const;

export const CANVAS = {
  bg: "#F5F5F5",
  dotColor: "#999999",
  dotGap: 16,
  dotRadius: 1,
  selected: "#F0F0F0",
} as const;

export const NODE = {
  bg: "#FFFFFF",
  borderColor: "#0000001A",
  borderWidth: 1.5,
  borderWidthActive: 2,
  /**
   * Corner radii, FITTED FROM SCREENSHOTS — not taken from _tokens.scss.
   * The SCSS says --radius--lg (20) / 36px, but two independent renders
   * (161px and 84px nodes) both fit R=7 and R=29 in 96px source units.
   * Circle-fit mean error: 0.16px and 0.34px respectively.
   * The SCSS values are believed stale; screenshots win.
   */
  radius: 7,
  /** trigger nodes: left corners use this radius, right corners use `radius` */
  triggerRadiusLeft: 29,
  /** what _tokens.scss currently claims, kept for reference */
  radiusPerScss: 20,
  triggerRadiusLeftPerScss: 36,
  /** NODE_ICON_SIZES.canvas — 48 for the `node:*` set, 40 for legacy SVG icons */
  iconSize: 48,
  iconSizeLegacy: 40,
  shadow: "0 4px 16px rgba(0,0,0,0.06)",
  pinnedBorder: "#7F22FE",
  runningBorder: "#FF6900",
} as const;

export const HANDLE = {
  size: 12,
  bg: "#FFFFFF",
  borderColor: "#989898",
  borderWidth: 1,
  hoverScale: 1.5,
} as const;

export const EDGE = {
  color: "#E5E5E5",
  width: 2,
  /** vue-flow getBezierPath curvature default */
  curvature: 0.25,
  borderRadius: 16,
  paddingX: 40,
  paddingBottom: 130,
} as const;

export const STATUS = {
  primary: "#FF6900",
  secondary: "#7F22FE",
  success: "#00A63E",
  warning: "#B57617",
  danger: "#E7000B",
} as const;

export const NDV = {
  /** NodeDetailsView.vue $main-panel-width */
  mainPanelWidth: 360,
  bg: "#FFFFFF",
  headerBg: "#F5F5F5",
  border: "#E5E5E5",
  inputBg: "#FAFAFA",
  droppable: "#7F22FE",
  backdrop: "#00000080",
} as const;

export const TEXT = {
  color: "#262626",
  subtle: "#444444",
  tint1: "#999999",
  labelSize: 16,
  subtitleSize: 13,
  lineHeight: 1.25,
  weightRegular: 400,
  weightMedium: 500,
} as const;

export const FONT = {
  /** n8n ships InterVariable; add Padauk for Burmese captions */
  sans: '"Inter", "InterVariable", "Padauk", "Noto Sans Myanmar", sans-serif',
  mono: '"JetBrains Mono", "CommitMono", ui-monospace, Menlo, Consolas, monospace',
} as const;

export const SPACING = {"5xs": 2, "4xs": 4, "3xs": 6, "2xs": 8, "xs": 12, "sm": 16, "md": 20, "lg": 24, "xl": 32} as const;

export const RADIUS = {"4xs": 2, "3xs": 4, "2xs": 6, "xs": 8, "sm": 12, "md": 16, "lg": 20, "xl": 24} as const;

/* ------------------------------------------------------------------ */
/* Geometry helpers — mirror n8n's own layout math                     */
/* ------------------------------------------------------------------ */

/** Snap a coordinate to the canvas grid, exactly as n8n does. */
export function snapToGrid(x: number, y: number): [number, number] {
  const s = GRID.size;
  return [Math.round(x / s) * s, Math.round(y / s) * s];
}

/** Input handle position (left edge, vertically centred). */
export function inputHandlePos(x: number, y: number) {
  return { x, y: y + GRID.nodeH / 2 };
}

/** Output handle position (right edge, vertically centred). */
export function outputHandlePos(x: number, y: number) {
  return { x: x + GRID.nodeW, y: y + GRID.nodeH / 2 };
}

/**
 * vue-flow `calculateControlOffset`.
 * Forward edges use half the gap; backward edges bow out by
 * curvature * 25 * sqrt(distance) so the line clears the source node.
 */
function controlOffset(distance: number, curvature: number): number {
  return distance >= 0
    ? 0.5 * distance
    : curvature * 25 * Math.sqrt(-distance);
}

/**
 * Cubic bezier path between two handles.
 * Faithful port of vue-flow `getBezierPath` for the
 * Position.Right -> Position.Left case, which is what n8n
 * uses for every main connection.
 */
export function bezierPath(
  sx: number, sy: number,
  tx: number, ty: number,
  curvature = EDGE.curvature,
): string {
  const c1x = sx + controlOffset(tx - sx, curvature);  // source: Right
  const c2x = tx - controlOffset(tx - sx, curvature);  // target: Left
  return `M${sx},${sy} C${c1x},${sy} ${c2x},${ty} ${tx},${ty}`;
}

/**
 * Border radius for a node, as a CSS `border-radius` string.
 * Trigger nodes get a rounded left side (n8n's signature shape).
 */
export function nodeRadius(isTrigger: boolean): string {
  if (!isTrigger) return `${NODE.radius}px`;
  const { triggerRadiusLeft: L, radius: R } = NODE;
  return `${L}px ${R}px ${R}px ${L}px`;
}


/* ------------------------------------------------------------------ */
/* DARK THEME                                                          */
/* Measured from real n8n editor screenshots, not from _tokens.scss.   */
/* The SCSS dark block resolves to #171717 / #2B2B2B, but the actual   */
/* editor renders #1B1B1B / #282828 — screenshots win.                 */
/* ------------------------------------------------------------------ */

export const CANVAS_DARK = {
  bg: "#1B1B1B",
  dotColor: "#2E2E2E",
  dotGap: GRID.size,
  dotRadius: 1,
  selected: "#31C49F",
} as const;

export const NODE_DARK = {
  bg: "#282828",
  borderColor: "#FFFFFF26",
  borderWidth: NODE.borderWidth,
  borderWidthActive: NODE.borderWidthActive,
  radius: NODE.radius,
  triggerRadiusLeft: NODE.triggerRadiusLeft,
  iconSize: NODE.iconSize,
  shadow: "0 4px 16px rgba(0,0,0,0.35)",
  pinnedBorder: NODE.pinnedBorder,
  runningBorder: NODE.runningBorder,
} as const;

export const HANDLE_DARK = {
  size: HANDLE.size,
  bg: "#282828",
  borderColor: "#909298",
  borderWidth: HANDLE.borderWidth,
  hoverScale: HANDLE.hoverScale,
} as const;

export const EDGE_DARK = {
  color: "#95929A",
  width: EDGE.width,
  curvature: EDGE.curvature,
  borderRadius: EDGE.borderRadius,
  paddingX: EDGE.paddingX,
  paddingBottom: EDGE.paddingBottom,
} as const;

export const TEXT_DARK = {
  color: "#FFFFFF",
  subtle: "#C3C9D5",
  tint1: "#909298",
  labelSize: TEXT.labelSize,
  subtitleSize: TEXT.subtitleSize,
  lineHeight: TEXT.lineHeight,
  weightRegular: TEXT.weightRegular,
  weightMedium: TEXT.weightMedium,
} as const;

export const NDV_DARK = {
  mainPanelWidth: NDV.mainPanelWidth,
  bg: "#2B2B2B",
  headerBg: "#232323",
  border: "#414243",
  inputBg: "#1E1E1E",
  droppable: NDV.droppable,
  backdrop: "#000000B0",
} as const;

/** Pick a palette by theme name. */
export function theme(dark: boolean) {
  return dark
    ? { CANVAS: CANVAS_DARK, NODE: NODE_DARK, HANDLE: HANDLE_DARK,
        EDGE: EDGE_DARK, TEXT: TEXT_DARK, NDV: NDV_DARK }
    : { CANVAS, NODE, HANDLE, EDGE, TEXT, NDV };
}

