/**
 * Design Tokens — single source of truth for the Lesson renderer.
 * Palette, semantic colors, type scale, spacing, canvas constants.
 * Convention: n8n light theme, Padauk font for Burmese text, 1920x1080 @ 30fps.
 */

// ── Raw palette ─────────────────────────────────────────────
export const palette = {
  // n8n brand
  orange: '#ff6d5a',
  orangeDark: '#e5533f',
  sidebar: '#101330',
  canvas: '#f9f9f9',
  // greys
  ink: '#101330',
  slate: '#3d3f52',
  muted: '#6b6e82',
  line: '#dcdce4',
  surface: '#ffffff',
  surfaceAlt: '#f1f1f5',
  // accents
  blue: '#4c6ef5',
  green: '#2fb344',
  amber: '#f59f00',
  red: '#e03131',
  purple: '#7048e8',
  white: '#ffffff',
  black: '#000000',
} as const;

// ── Semantic colors ─────────────────────────────────────────
export const color = {
  primary: palette.orange,
  primaryDark: palette.orangeDark,
  bg: palette.canvas,
  panel: palette.surface,
  panelAlt: palette.surfaceAlt,
  border: palette.line,
  text: palette.ink,
  textSoft: palette.slate,
  textMuted: palette.muted,
  success: palette.green,
  warning: palette.amber,
  danger: palette.red,
  info: palette.blue,
  accent: palette.purple,
} as const;

// ── Typography ──────────────────────────────────────────────
export const font = {
  ui: "'Inter', 'Padauk', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  burmese: "'Padauk', sans-serif",
} as const;

// Type scale (px on the 1920x1080 canvas)
export const type = {
  display: 96,
  h1: 72,
  h2: 56,
  h3: 42,
  title: 34,
  body: 28,
  small: 22,
  caption: 18,
} as const;

export const weight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ── Spacing (8px base grid) ─────────────────────────────────
export const space = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
  xl: 64,
  xxl: 96,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 24,
  pill: 999,
} as const;

export const shadow = {
  sm: '0 2px 8px rgba(16,19,48,0.08)',
  md: '0 8px 28px rgba(16,19,48,0.12)',
  lg: '0 20px 60px rgba(16,19,48,0.18)',
} as const;

// ── Canvas constants ────────────────────────────────────────
export const canvas = {
  width: 1920,
  height: 1080,
  fps: 30,
  safe: 96, // safe-area inset
} as const;

// ── Motion defaults ─────────────────────────────────────────
export const motion = {
  fast: 8,    // frames
  base: 14,
  slow: 24,
  damping: 200,
  stiffness: 120,
  mass: 0.8,
} as const;

export const tokens = {
  palette, color, font, type, weight, space, radius, shadow, canvas, motion,
} as const;

export default tokens;
