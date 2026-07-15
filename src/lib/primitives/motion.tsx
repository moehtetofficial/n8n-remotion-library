/**
 * Motion primitives — frame-deterministic entrance/exit wrappers.
 * All timing in FRAMES (30fps canvas). Built on useCurrentFrame + interpolate/spring.
 */
import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { motion as M } from '../tokens';

type Common = {
  children: React.ReactNode;
  /** frame at which the animation starts (relative to sequence) */
  at?: number;
  /** duration in frames */
  duration?: number;
  style?: React.CSSProperties;
};

/** Fade in (optionally fade out near the end via `out`). */
export const FadeIn: React.FC<Common & { out?: number }> = ({
  children, at = 0, duration = M.base, out, style,
}) => {
  const frame = useCurrentFrame();
  let opacity = interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (out != null) {
    opacity *= interpolate(frame, [out, out + duration], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  }
  return <div style={{ opacity, ...style }}>{children}</div>;
};

type Dir = 'up' | 'down' | 'left' | 'right';
const offsetFor = (dir: Dir, dist: number): [number, number] => {
  switch (dir) {
    case 'up': return [0, dist];
    case 'down': return [0, -dist];
    case 'left': return [dist, 0];
    case 'right': return [-dist, 0];
  }
};

/** Slide + fade in from a direction. */
export const SlideIn: React.FC<Common & { from?: Dir; distance?: number }> = ({
  children, at = 0, duration = M.base, from = 'up', distance = 48, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - at,
    fps,
    config: { damping: M.damping, stiffness: M.stiffness, mass: M.mass },
    durationInFrames: duration,
  });
  const [ox, oy] = offsetFor(from, distance);
  const opacity = interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <div style={{
      opacity,
      transform: `translate(${ox * (1 - p)}px, ${oy * (1 - p)}px)`,
      ...style,
    }}>{children}</div>
  );
};

/** Scale + fade in (pop). */
export const ScaleIn: React.FC<Common & { fromScale?: number }> = ({
  children, at = 0, duration = M.base, fromScale = 0.86, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({
    frame: frame - at,
    fps,
    config: { damping: M.damping, stiffness: M.stiffness, mass: M.mass },
    durationInFrames: duration,
  });
  const scale = interpolate(p, [0, 1], [fromScale, 1]);
  const opacity = interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <div style={{ opacity, transform: `scale(${scale})`, ...style }}>
      {children}
    </div>
  );
};

/** Stagger children by a fixed frame gap. Wraps each child with FadeIn+SlideIn. */
export const Stagger: React.FC<{
  children: React.ReactNode;
  at?: number;
  gap?: number;
  duration?: number;
  from?: Dir;
  style?: React.CSSProperties;
  childStyle?: React.CSSProperties;
}> = ({ children, at = 0, gap = 5, duration = M.base, from = 'up', style, childStyle }) => {
  const items = React.Children.toArray(children);
  return (
    <div style={style}>
      {items.map((c, i) => (
        <SlideIn key={i} at={at + i * gap} duration={duration} from={from} style={childStyle}>
          {c}
        </SlideIn>
      ))}
    </div>
  );
};

/** Linear typewriter reveal of a string, character by character. */
export const Typewriter: React.FC<{
  text: string;
  at?: number;
  cps?: number; // characters per second
  style?: React.CSSProperties;
  caret?: boolean;
}> = ({ text, at = 0, cps = 24, style, caret = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = Math.max(0, Math.floor(((frame - at) / fps) * cps));
  const slice = text.slice(0, shown);
  const done = shown >= text.length;
  return (
    <span style={style}>
      {slice}
      {caret && !done ? <span style={{ opacity: frame % 16 < 8 ? 1 : 0 }}>▌</span> : null}
    </span>
  );
};

export const easing = Easing;
