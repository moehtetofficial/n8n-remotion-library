/**
 * ConceptCallout — highlight box for a key term / tip / warning / definition.
 * Left accent bar + tinted surface + optional icon + label.
 * Pops in with ScaleIn; body text can fade in slightly after.
 */
import React from 'react';
import { ScaleIn, FadeIn } from '../primitives/motion';
import { Row, Stack } from '../primitives/layout';
import { color, font, type, weight, space, radius, shadow, palette } from '../tokens';

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'definition';

export type ConceptCalloutProps = {
  /** body text (the concept explanation) */
  text: string;
  /** bold label above the text (e.g. "Definition", "သတိပြုရန်") */
  label?: string;
  variant?: CalloutVariant;
  isBurmese?: boolean;
  at?: number;
  width?: number | string;
};

const VARIANTS: Record<
  CalloutVariant,
  { accent: string; tint: string; icon: React.ReactNode }
> = {
  info: {
    accent: palette.blue,
    tint: 'rgba(76,110,245,0.08)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 11v5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="12" cy="7.5" r="1.3" fill="currentColor" />
      </svg>
    ),
  },
  tip: {
    accent: palette.green,
    tint: 'rgba(47,179,68,0.08)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1 1 1.7V16h5v-.4c0-.7.4-1.3 1-1.7A6 6 0 0 0 12 3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  warning: {
    accent: palette.amber,
    tint: 'rgba(245,159,0,0.10)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L2 20h20L12 3z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M12 10v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="12" cy="17" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  definition: {
    accent: palette.purple,
    tint: 'rgba(112,72,232,0.08)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 5.5A1.5 1.5 0 0 1 5.5 4H18a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2V5.5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M8 8h8M8 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
};

export const ConceptCallout: React.FC<ConceptCalloutProps> = ({
  text,
  label,
  variant = 'info',
  isBurmese = false,
  at = 0,
  width = 1200,
}) => {
  const v = VARIANTS[variant];
  const textFont = isBurmese ? font.burmese : font.ui;

  return (
    <ScaleIn at={at} duration={14} fromScale={0.9}>
      <div
        style={{
          width,
          display: 'flex',
          background: color.panel,
          borderRadius: radius.md,
          boxShadow: shadow.md,
          overflow: 'hidden',
        }}
      >
        {/* left accent bar */}
        <div style={{ flex: '0 0 auto', width: 10, background: v.accent }} />

        {/* tinted body */}
        <div
          style={{
            flex: 1,
            background: v.tint,
            padding: space.lg,
          }}
        >
          <Row gap="md" align="flex-start">
            <div style={{ flex: '0 0 auto', color: v.accent, marginTop: 2 }}>
              {v.icon}
            </div>
            <Stack gap="xs" style={{ flex: 1 }}>
              {label ? (
                <div
                  style={{
                    fontFamily: font.ui,
                    fontSize: type.small,
                    fontWeight: weight.bold,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    color: v.accent,
                  }}
                >
                  {label}
                </div>
              ) : null}
              <FadeIn at={at + 6} duration={10}>
                <div
                  style={{
                    fontFamily: textFont,
                    fontSize: type.title,
                    fontWeight: weight.medium,
                    color: color.text,
                    lineHeight: 1.45,
                  }}
                >
                  {text}
                </div>
              </FadeIn>
            </Stack>
          </Row>
        </div>
      </div>
    </ScaleIn>
  );
};

export default ConceptCallout;
