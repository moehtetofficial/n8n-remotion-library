import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { GRID, STATUS, nodeRadius } from "./tokens";

/**
 * Execution status ring — the coloured outline n8n draws around a node
 * while it runs, and the tick badge it leaves behind when it succeeds.
 *
 * Rendered as a sibling overlay on top of the node body, so the node's
 * own border stays untouched.
 */

export type NodeStatus = "idle" | "running" | "success" | "error";

export interface StatusRingProps {
  status: NodeStatus;
  /** frame the status becomes active (relative to the Sequence) */
  atFrame?: number;
  isTrigger?: boolean;
  /** how long the running spinner sweeps before settling */
  runningF?: number;
}

const RING_W = 2.5;

export const StatusRing: React.FC<StatusRingProps> = ({
  status,
  atFrame = 0,
  isTrigger = false,
  runningF = 45,
}) => {
  const frame = useCurrentFrame();
  if (status === "idle" || frame < atFrame) return null;

  const local = frame - atFrame;
  const color =
    status === "error"
      ? STATUS.danger
      : status === "success"
        ? STATUS.success
        : STATUS.primary;

  // running: the ring pulses; success/error: it snaps on then holds
  const opacity =
    status === "running"
      ? 0.55 + 0.45 * Math.sin((local / runningF) * Math.PI * 2)
      : interpolate(local, [0, 8], [0, 1], {
          easing: Easing.out(Easing.quad),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  const scale =
    status === "running"
      ? 1
      : interpolate(local, [0, 10], [1.08, 1], {
          easing: Easing.bezier(0.22, 1, 0.36, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: -RING_W,
          border: `${RING_W}px solid ${color}`,
          borderRadius: nodeRadius(isTrigger),
          boxSizing: "border-box",
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: "center",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
      {status === "success" && <SuccessBadge atFrame={atFrame} />}
      {status === "error" && <ErrorBadge atFrame={atFrame} />}
    </>
  );
};

const badgeBase = (bg: string): React.CSSProperties => ({
  position: "absolute",
  top: -8,
  right: -8,
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: bg,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 4,
  pointerEvents: "none",
});

const SuccessBadge: React.FC<{ atFrame: number }> = ({ atFrame }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [atFrame + 4, atFrame + 16], [0, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ ...badgeBase(STATUS.success), transform: `scale(${t})` }}>
      <svg width={12} height={12} viewBox="0 0 12 12">
        <path
          d="M2.5 6.3 L4.8 8.6 L9.5 3.6"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={12}
          strokeDashoffset={12 * (1 - t)}
        />
      </svg>
    </div>
  );
};

const ErrorBadge: React.FC<{ atFrame: number }> = ({ atFrame }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [atFrame + 4, atFrame + 16], [0, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ ...badgeBase(STATUS.danger), transform: `scale(${t})` }}>
      <svg width={12} height={12} viewBox="0 0 12 12">
        <path
          d="M3.2 3.2 L8.8 8.8 M8.8 3.2 L3.2 8.8"
          stroke="#FFFFFF"
          strokeWidth={1.9}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

/**
 * Item counter that n8n shows on a connection after a node has run
 * ("3 items"). Sits at the midpoint of the edge.
 */
export const ItemCountBadge: React.FC<{
  count: number;
  x: number;
  y: number;
  atFrame?: number;
  dark?: boolean;
}> = ({ count, x, y, atFrame = 0, dark = false }) => {
  const frame = useCurrentFrame();
  if (frame < atFrame) return null;
  const t = interpolate(frame, [atFrame, atFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${t})`,
        background: dark ? "#282828" : "#FFFFFF",
        border: `1px solid ${dark ? "#FFFFFF26" : "#0000001A"}`,
        borderRadius: 6,
        padding: "2px 8px",
        fontSize: 12,
        lineHeight: 1.3,
        color: dark ? "#C3C9D5" : "#444444",
        opacity: t,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      {count} {count === 1 ? "item" : "items"}
    </div>
  );
};
