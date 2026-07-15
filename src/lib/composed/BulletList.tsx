/**
 * BulletList — staggered list of points for explaining concepts.
 * Each item slides in with a marker (dot / number / check).
 * Burmese-safe via isBurmese. Optional heading above the list.
 */
import React from 'react';
import { Stack, Row } from '../primitives/layout';
import { SlideIn, FadeIn } from '../primitives/motion';
import { color, font, type, weight, space, radius } from '../tokens';

export type BulletItem = string | { text: string; sub?: string };

export type BulletListProps = {
  items: BulletItem[];
  /** optional heading rendered above the list */
  heading?: string;
  /** marker style */
  marker?: 'dot' | 'number' | 'check';
  isBurmese?: boolean;
  accent?: string;
  /** frame to begin */
  at?: number;
  /** frame gap between items */
  gap?: number;
};

const Marker: React.FC<{
  kind: 'dot' | 'number' | 'check';
  index: number;
  accent: string;
}> = ({ kind, index, accent }) => {
  const base: React.CSSProperties = {
    flex: '0 0 auto',
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: font.ui,
    fontWeight: weight.bold,
    fontSize: type.body,
    color: '#ffffff',
    background: accent,
  };
  if (kind === 'number') return <div style={base}>{index + 1}</div>;
  if (kind === 'check') {
    return (
      <div style={base}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12.5l4 4L19 7"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }
  return (
    <div
      style={{
        flex: '0 0 auto',
        width: 16,
        height: 16,
        marginLeft: 14,
        marginRight: 14,
        borderRadius: radius.pill,
        background: accent,
      }}
    />
  );
};

export const BulletList: React.FC<BulletListProps> = ({
  items,
  heading,
  marker = 'dot',
  isBurmese = false,
  accent = color.primary,
  at = 0,
  gap = 8,
}) => {
  const textFont = isBurmese ? font.burmese : font.ui;
  const headStart = at;
  const listStart = heading ? at + 10 : at;

  return (
    <Stack gap="lg" style={{ maxWidth: 1500 }}>
      {heading ? (
        <FadeIn at={headStart} duration={10}>
          <div
            style={{
              fontFamily: textFont,
              fontSize: type.h2,
              fontWeight: weight.bold,
              color: color.text,
              marginBottom: space.sm,
            }}
          >
            {heading}
          </div>
        </FadeIn>
      ) : null}

      <Stack gap="md">
        {items.map((raw, i) => {
          const item = typeof raw === 'string' ? { text: raw } : raw;
          return (
            <SlideIn key={i} at={listStart + i * gap} from="left" distance={56}>
              <Row gap="md" align="flex-start">
                <div style={{ marginTop: 4 }}>
                  <Marker kind={marker} index={i} accent={accent} />
                </div>
                <Stack gap="xs">
                  <div
                    style={{
                      fontFamily: textFont,
                      fontSize: type.title,
                      fontWeight: weight.medium,
                      color: color.text,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.text}
                  </div>
                  {item.sub ? (
                    <div
                      style={{
                        fontFamily: textFont,
                        fontSize: type.body,
                        fontWeight: weight.regular,
                        color: color.textMuted,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.sub}
                    </div>
                  ) : null}
                </Stack>
              </Row>
            </SlideIn>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default BulletList;
