import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { theme, GRID } from "./tokens";

/**
 * The "+" affordance n8n renders on an output handle when nothing is
 * connected yet, and the mid-edge "+" that appears on connection hover.
 *
 * This is the single most recognisable gesture in an n8n tutorial:
 * "click the plus to add your next node".
 */

export interface AddButtonProps {
  /** centre point, canvas coordinates */
  x: number;
  y: number;
  /** frame it fades in */
  atFrame?: number;
  /** frame the cursor clicks it — triggers the press + ripple */
  clickAtFrame?: number;
  size?: number;
  dark?: boolean;
  /** stub connector line drawn back toward the source handle */
  stub?: number;
}

export const AddButton: React.FC<AddButtonProps> = ({
  x,
  y,
  atFrame = 0,
  clickAtFrame,
  size = 22,
  dark = false,
  stub = 0,
}) => {
  const frame = useCurrentFrame();
  if (frame < atFrame) return null;

  const T = theme(dark);

  const appear = interpolate(frame, [atFrame, atFrame + 10], [0, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pressed =
    clickAtFrame !== undefined &&
    frame >= clickAtFrame &&
    frame < clickAtFrame + 5;

  // gentle idle pulse so the eye finds it before the cursor arrives
  const idle =
    clickAtFrame === undefined || frame < clickAtFrame
      ? 1 + 0.04 * Math.sin((frame - atFrame) / 9)
      : 1;

  const scale = appear * idle * (pressed ? 0.9 : 1);

  return (
    <>
      {stub > 0 && (
        <div
          style={{
            position: "absolute",
            left: x - stub,
            top: y - 1,
            width: stub,
            height: 2,
            background: T.EDGE.color,
            opacity: appear,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          borderRadius: 4,
          background: T.NODE.bg,
          border: `1.5px solid ${T.EDGE.color}`,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${scale})`,
          opacity: appear,
          pointerEvents: "none",
          zIndex: 6,
        }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 12 12">
          <path
            d="M6 2 L6 10 M2 6 L10 6"
            stroke={T.TEXT.tint1}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </svg>
      </div>
      {clickAtFrame !== undefined && frame >= clickAtFrame && (
        <ClickPulse x={x} y={y} atFrame={clickAtFrame} />
      )}
    </>
  );
};

const ClickPulse: React.FC<{ x: number; y: number; atFrame: number }> = ({
  x,
  y,
  atFrame,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [atFrame, atFrame + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (t >= 1) return null;
  const s = interpolate(t, [0, 1], [10, 52]);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: s,
        height: s,
        marginLeft: -s / 2,
        marginTop: -s / 2,
        borderRadius: "50%",
        border: "2px solid #FF6900",
        opacity: interpolate(t, [0, 1], [0.5, 0]),
        pointerEvents: "none",
        zIndex: 7,
      }}
    />
  );
};

/** Convenience: "+" hanging off a node's output handle. */
export const OutputAddButton: React.FC<
  Omit<AddButtonProps, "x" | "y"> & { nodeX: number; nodeY: number; gap?: number }
> = ({ nodeX, nodeY, gap = 44, ...rest }) => (
  <AddButton
    x={nodeX + GRID.nodeW + gap}
    y={nodeY + GRID.nodeH / 2}
    stub={gap - 12}
    {...rest}
  />
);
