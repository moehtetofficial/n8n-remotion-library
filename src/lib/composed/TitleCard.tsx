/**
 * TitleCard — lesson title screen.
 * Big display title + optional subtitle + optional eyebrow (kicker).
 * Burmese-safe: pass isBurmese to switch the title font to Padauk.
 * Timeline: eyebrow → title → subtitle → underline sweep.
 */
import React from 'react';
import { Center, Stack } from '../primitives/layout';
import { FadeIn, SlideIn } from '../primitives/motion';
import { color, font, type, weight, space, radius } from '../tokens';
import { useCurrentFrame, interpolate } from 'remotion';

export type TitleCardProps = {
  /** main heading */
  title: string;
  /** secondary line under the title */
  subtitle?: string;
  /** small label above the title (e.g. "Lesson 03", "အခန်း ၃") */
  eyebrow?: string;
  /** switch title/subtitle to Padauk for Myanmar text */
  isBurmese?: boolean;
  /** accent color for the eyebrow + underline */
  accent?: string;
  /** frame to begin the sequence */
  at?: number;
  align?: 'center' | 'left';
};

export const TitleCard: React.FC<TitleCardProps> = ({
  title,
  subtitle,
  eyebrow,
  isBurmese = false,
  accent = color.primary,
  at = 0,
  align = 'center',
}) => {
  const frame = useCurrentFrame();
  const textFont = isBurmese ? font.burmese : font.ui;
  const alignItems = align === 'center' ? 'center' : 'flex-start';
  const textAlign = align === 'center' ? 'center' : 'left';

  // underline sweep grows after the title lands
  const underlineStart = at + 16;
  const underlineW = interpolate(
    frame,
    [underlineStart, underlineStart + 14],
    [0, 220],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <Center>
      <Stack gap="md" align={alignItems} style={{ maxWidth: 1400, padding: space.xl }}>
        {eyebrow ? (
          <FadeIn at={at} duration={10}>
            <div
              style={{
                fontFamily: font.ui,
                fontSize: type.small,
                fontWeight: weight.bold,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: accent,
                textAlign,
              }}
            >
              {eyebrow}
            </div>
          </FadeIn>
        ) : null}

        <SlideIn at={at + 4} from="up" distance={40}>
          <div
            style={{
              fontFamily: textFont,
              fontSize: type.h1,
              fontWeight: weight.bold,
              lineHeight: 1.15,
              color: color.text,
              textAlign,
            }}
          >
            {title}
          </div>
        </SlideIn>

        <div
          style={{
            height: 6,
            width: underlineW,
            borderRadius: radius.pill,
            background: accent,
          }}
        />

        {subtitle ? (
          <FadeIn at={at + 18} duration={12}>
            <div
              style={{
                fontFamily: textFont,
                fontSize: type.h3,
                fontWeight: weight.regular,
                color: color.textSoft,
                lineHeight: 1.4,
                textAlign,
              }}
            >
              {subtitle}
            </div>
          </FadeIn>
        ) : null}
      </Stack>
    </Center>
  );
};

export default TitleCard;
