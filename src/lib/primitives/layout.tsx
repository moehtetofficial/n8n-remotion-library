/**
 * Layout primitives — deterministic flex helpers on the 1920x1080 canvas.
 */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { space as S, color } from '../tokens';

type Gap = keyof typeof S | number;
const gapPx = (g?: Gap) => (g == null ? 0 : typeof g === 'number' ? g : S[g]);

/** Full-canvas background layer. */
export const Stage: React.FC<{
  children: React.ReactNode;
  bg?: string;
  style?: React.CSSProperties;
}> = ({ children, bg = color.bg, style }) => (
  <AbsoluteFill style={{ backgroundColor: bg, ...style }}>{children}</AbsoluteFill>
);

/** Center content both axes. */
export const Center: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <AbsoluteFill style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', ...style,
  }}>{children}</AbsoluteFill>
);

/** Vertical stack. */
export const Stack: React.FC<{
  children: React.ReactNode;
  gap?: Gap;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  style?: React.CSSProperties;
}> = ({ children, gap = 'md', align = 'stretch', justify = 'flex-start', style }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    gap: gapPx(gap), alignItems: align, justifyContent: justify, ...style,
  }}>{children}</div>
);

/** Horizontal row. */
export const Row: React.FC<{
  children: React.ReactNode;
  gap?: Gap;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  style?: React.CSSProperties;
}> = ({ children, gap = 'md', align = 'center', justify = 'flex-start', style }) => (
  <div style={{
    display: 'flex', flexDirection: 'row',
    gap: gapPx(gap), alignItems: align, justifyContent: justify, ...style,
  }}>{children}</div>
);

/** Two-column split with configurable ratio (0..1 for the left column). */
export const Split: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: number;
  gap?: Gap;
  style?: React.CSSProperties;
}> = ({ left, right, ratio = 0.5, gap = 'lg', style }) => (
  <div style={{ display: 'flex', width: '100%', height: '100%', gap: gapPx(gap), ...style }}>
    <div style={{ flex: ratio }}>{left}</div>
    <div style={{ flex: 1 - ratio }}>{right}</div>
  </div>
);

/** Padded content area respecting the safe inset. */
export const Frame: React.FC<{
  children: React.ReactNode;
  pad?: Gap;
  style?: React.CSSProperties;
}> = ({ children, pad = 'xl', style }) => (
  <AbsoluteFill style={{ padding: gapPx(pad), ...style }}>{children}</AbsoluteFill>
);

export const Spacer: React.FC<{ size?: Gap }> = ({ size = 'md' }) => (
  <div style={{ flex: '0 0 auto', width: gapPx(size), height: gapPx(size) }} />
);
