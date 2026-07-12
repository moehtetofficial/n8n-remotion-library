/* =============================================================================
   CORE TYPES — shared across every component in the library.
   niche-agnostic: works for n8n demos, motivation, dhamma, any video type.
   ========================================================================== */

export const FPS = 30;

/* ---- Camera keyframe (standalone, cursor-independent) --------------------- */
export type CameraKey = {
  at: number;        // seconds into the scene
  zoom?: number;     // 1 = fit, >1 zoom in
  x?: number;        // focal point %, 0-100 (default 50)
  y?: number;        // focal point %, 0-100 (default 50)
  ease?: string;     // "power2.inOut" | "power3.out" | "linear" ...
};

/* ---- Cursor step (GSAP frame-seeked path) -------------------------------- */
export type CursorStep = {
  x: number; y: number;   // % within the active surface
  at?: number;            // seconds (optional explicit timing)
  click?: boolean;
  drag?: boolean;         // hold + move = drag
  dwell?: number;         // seconds to pause after arriving
};

/* ---- Recreated UI element (from screenshot reference) -------------------- */
export type UIKind =
  | "panel" | "node" | "button" | "input" | "text"
  | "connector" | "browserbar" | "terminal" | "toolbar" | "sidebar" | "tab";

export type UIElement = {
  kind?: UIKind;
  label?: string;
  icon?: string;          // NodeIcon slug: "webhook" | "openai" | "gsheets" ...
  status?: "success" | "error" | "running" | "idle";
  x?: number; y?: number; // % within surface
  w?: number; h?: number; // % size
  color?: string;
  fontSize?: number;
  selected?: boolean;     // draw highlight ring
};

/* ---- Connection between two node UI elements ----------------------------- */
export type ConnSpec = {
  from: string;           // node label
  to: string;             // node label
  animated?: boolean;     // moving dots
};

/* ---- Concept-scene visual atoms ------------------------------------------ */
export type IconItem = { name?: string; slug?: string; label?: string; x?: number; y?: number; color?: string };

/* ---- Typing action (field fill) ------------------------------------------ */
export type TypeAction = { target: string; value: string; at?: number; speed?: number };

/* ---- The scene object (one spoken sentence) ------------------------------ */
export type Scene = {
  start?: number; end?: number;
  type?: "intro" | "concept" | "screen_demo" | "code" | "outro";
  caption?: string;
  caption_mode?: "word" | "line";

  // screen_demo
  mockup?: "mac" | "browser" | "terminal" | "canvas" | "none";
  mockup_title?: string;
  ui?: UIElement[];
  connections?: ConnSpec[];
  cursor?: CursorStep[];
  typing?: TypeAction[];

  // concept
  icons?: IconItem[];
  kinetic?: string[];
  code?: string;
  language?: string;

  // cinematic (shared)
  camera?: CameraKey[];
  transition?: "fade" | "slide" | "wipe";
  grade?: { vignette?: number; bloom?: number; saturate?: number; contrast?: number; hue?: number };
  bg?: string;
};

export type Script = {
  title?: string;
  audio_file?: string;
  audio_duration?: number;
  scenes?: Scene[];
};

/* ---- Easing name -> gsap string ------------------------------------------ */
export const gsapEase = (n?: string) => n || "power2.inOut";
