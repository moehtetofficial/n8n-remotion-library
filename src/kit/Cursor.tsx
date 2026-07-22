import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export interface CursorAction {
  type: "move" | "click" | "hover" | "type";
  /** target point in canvas coordinates */
  x: number;
  y: number;
  /** frame this action begins */
  atFrame: number;
  /** frames the action takes (move only; click is fixed) */
  durF?: number;
}

/**
 * Timing constants. Real screen recordings have a characteristic
 * rhythm — the cursor decelerates into a target, pauses, then clicks.
 * Skipping the pause is what makes synthetic cursors look robotic.
 */
export const CURSOR_TIMING = {
  /** frames to travel between two points (scaled by distance) */
  moveMinF: 12,
  moveMaxF: 28,
  /** dwell after arriving, before the click fires */
  hoverBeforeClickF: 9,
  /** click ripple duration */
  clickF: 12,
} as const;

/** Duration for a move, scaled by distance like a real hand. */
export function moveDuration(dist: number): number {
  const { moveMinF, moveMaxF } = CURSOR_TIMING;
  return Math.round(
    interpolate(dist, [0, 1200], [moveMinF, moveMaxF], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
}

/**
 * Build a frame-accurate action list from a sequence of targets.
 * Each `click` automatically gets a preceding move + hover dwell.
 */
export function choreograph(
  start: { x: number; y: number },
  steps: Array<{ x: number; y: number; click?: boolean; atFrame?: number }>,
): CursorAction[] {
  const out: CursorAction[] = [];
  let cur = start;
  let f = 0;

  for (const s of steps) {
    if (s.atFrame !== undefined) f = Math.max(f, s.atFrame);
    const dist = Math.hypot(s.x - cur.x, s.y - cur.y);
    const durF = moveDuration(dist);
    out.push({ type: "move", x: s.x, y: s.y, atFrame: f, durF });
    f += durF;

    if (s.click) {
      f += CURSOR_TIMING.hoverBeforeClickF;
      out.push({ type: "click", x: s.x, y: s.y, atFrame: f });
      f += CURSOR_TIMING.clickF;
    }
    cur = s;
  }
  return out;
}

/** macOS-style arrow pointer. */
const Pointer: React.FC<{ pressed: boolean }> = ({ pressed }) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    style={{
      display: "block",
      transform: `scale(${pressed ? 0.88 : 1})`,
      transformOrigin: "2px 2px",
      filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))",
    }}
  >
    <path
      d="M2 2 L2 17.5 L6.2 13.6 L9 20 L11.6 18.9 L8.9 12.7 L14.5 12.5 Z"
      fill="#FFFFFF"
      stroke="#000000"
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);

export const Cursor: React.FC<{
  actions: CursorAction[];
  /** where the cursor sits before the first action */
  start?: { x: number; y: number };
}> = ({ actions, start = { x: 0, y: 0 } }) => {
  const frame = useCurrentFrame();

  const moves = actions.filter((a) => a.type === "move");
  const clicks = actions.filter((a) => a.type === "click");

  // current position: walk the move list
  let pos = start;
  for (const m of moves) {
    const durF = m.durF ?? CURSOR_TIMING.moveMinF;
    if (frame >= m.atFrame + durF) {
      pos = { x: m.x, y: m.y };
    } else if (frame >= m.atFrame) {
      const t = interpolate(frame, [m.atFrame, m.atFrame + durF], [0, 1], {
        // decelerate into the target — this is what reads as "human"
        easing: Easing.bezier(0.33, 0, 0.15, 1),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      pos = {
        x: pos.x + (m.x - pos.x) * t,
        y: pos.y + (m.y - pos.y) * t,
      };
      break;
    } else {
      break;
    }
  }

  const active = clicks.find(
    (c) => frame >= c.atFrame && frame < c.atFrame + CURSOR_TIMING.clickF,
  );
  const pressed =
    !!active && frame < (active?.atFrame ?? 0) + 4;

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {active && <ClickRipple startFrame={active.atFrame} frame={frame} />}
      <Pointer pressed={pressed} />
    </div>
  );
};

const ClickRipple: React.FC<{ startFrame: number; frame: number }> = ({
  startFrame,
  frame,
}) => {
  const t = interpolate(
    frame,
    [startFrame, startFrame + CURSOR_TIMING.clickF],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const size = interpolate(t, [0, 1], [6, 44]);
  const opacity = interpolate(t, [0, 1], [0.55, 0]);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: "50%",
        border: `2px solid #FF6900`,
        opacity,
      }}
    />
  );
};
