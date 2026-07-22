import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { FONT, RADIUS, SPACING, STATUS, theme } from "./tokens";
import { NodeIcon, iconForType } from "./nodeIcons";

export interface NdvField {
  label: string;
  value: string;
  /** render as a dropdown rather than a text input */
  select?: boolean;
  /** frame at which the value types itself in; omit = always shown */
  typeAtFrame?: number;
  /** highlight ring, e.g. while the cursor is on it */
  focusAtFrame?: number;
}

export interface NdvPanelProps {
  nodeType: string;
  title: string;
  fields: NdvField[];
  /** frame the panel slides in */
  openAtFrame?: number;
  width?: number;
  dark?: boolean;
}

/** Character-by-character reveal, ~2.5 frames per char (≈72 WPM). */
const CHAR_F = 2.5;

const Typed: React.FC<{ text: string; startFrame?: number }> = ({
  text,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  if (startFrame === undefined) return <>{text}</>;
  const n = Math.floor(
    interpolate(frame, [startFrame, startFrame + text.length * CHAR_F], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const done = n >= text.length;
  return (
    <>
      {text.slice(0, n)}
      {!done && frame >= startFrame && (
        <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0.2 : 1 }}>|</span>
      )}
    </>
  );
};

const Field: React.FC<{ f: NdvField; dark?: boolean }> = ({ f, dark }) => {
  const frame = useCurrentFrame();
  const T = theme(!!dark);
  const focused =
    f.focusAtFrame !== undefined &&
    frame >= f.focusAtFrame &&
    frame < f.focusAtFrame + 60;

  return (
    <div style={{ marginBottom: SPACING.sm }}>
      <div
        style={{
          fontSize: T.TEXT.subtitleSize,
          fontWeight: T.TEXT.weightMedium,
          color: T.TEXT.subtle,
          marginBottom: SPACING["4xs"],
        }}
      >
        {f.label}
      </div>
      <div
        style={{
          background: T.NDV.inputBg,
          border: `1px solid ${focused ? STATUS.primary : T.NDV.border}`,
          boxShadow: focused ? `0 0 0 3px ${STATUS.primary}22` : "none",
          borderRadius: RADIUS.xs,
          padding: `9px ${SPACING["2xs"]}px`,
          fontSize: T.TEXT.subtitleSize,
          color: T.TEXT.color,
          minHeight: 34,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: FONT.sans,
        }}
      >
        <span>
          <Typed text={f.value} startFrame={f.typeAtFrame} />
        </span>
        {f.select && (
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke={T.TEXT.tint1}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export const NdvPanel: React.FC<NdvPanelProps> = ({
  nodeType,
  title,
  fields,
  openAtFrame = 0,
  width,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const T = theme(dark);
  const W = width ?? T.NDV.mainPanelWidth;
  const t = interpolate(frame, [openAtFrame, openAtFrame + 14], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: W,
        background: T.NDV.bg,
        border: `1px solid ${T.NDV.border}`,
        borderRadius: RADIUS.xs,
        boxShadow: "0 12px 40px rgba(0,0,0,0.14)",
        overflow: "hidden",
        fontFamily: FONT.sans,
        opacity: t,
        transform: `translateY(${(1 - t) * 18}px) scale(${0.97 + 0.03 * t})`,
      }}
    >
      {/* header */}
      <div
        style={{
          background: T.NDV.headerBg,
          borderBottom: `1px solid ${T.NDV.border}`,
          padding: `${SPACING["2xs"]}px ${SPACING.sm}px`,
          display: "flex",
          alignItems: "center",
          gap: SPACING["2xs"],
        }}
      >
        <NodeIcon name={iconForType(nodeType)} size={24} color={T.TEXT.color} />
        <span
          style={{
            fontSize: T.TEXT.labelSize,
            fontWeight: T.TEXT.weightMedium,
            color: T.TEXT.color,
          }}
        >
          {title}
        </span>
      </div>

      {/* parameters */}
      <div style={{ padding: SPACING.sm }}>
        {fields.map((f, i) => (
          <Field key={i} f={f} dark={dark} />
        ))}
      </div>
    </div>
  );
};
