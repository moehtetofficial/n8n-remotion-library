import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  Audio,
  staticFile,
} from "remotion";
import { WorkflowCanvas, N8nWorkflow } from "./WorkflowCanvas";
import { ScreenDemo } from "./ScreenDemo";
import { Act1, Act1Beat } from "./Act1";
import { CANVAS_DARK, TEXT_DARK, FONT } from "./tokens";
import { ensureBurmeseFont } from "./fonts";

/* ------------------------------------------------------------------ */
/* Scene IR — the contract between the compiler and the renderer.      */
/* Frames are absolute and pre-computed. The renderer does no timing   */
/* maths of its own.                                                   */
/* ------------------------------------------------------------------ */

export type ScenePattern =
  | "TitleCard"
  | "WorkflowCanvas"
  | "ScreenDemo"
  | "Act1";

export interface SceneIRScene {
  id: string;
  pattern: ScenePattern;
  startFrame: number;
  endFrame: number;
  data: Record<string, unknown>;
}

export interface SceneIR {
  meta: {
    lessonId: number | string;
    fps: number;
    width: number;
    height: number;
    totalFrames: number;
    dark?: boolean;
    /** file placed in public/ by the render script */
    audioFile?: string;
  };
  scenes: SceneIRScene[];
  captions?: Array<{ text: string; startFrame: number; endFrame: number }>;
}

/* ------------------------------------------------------------------ */

const TitleCard: React.FC<{
  title: string;
  subtitle?: string;
  dark?: boolean;
}> = ({ title, subtitle, dark = true }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: dark ? CANVAS_DARK.bg : "#F5F5F5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT.sans,
        gap: 20,
      }}
    >
      <div
        style={{
          fontSize: 84,
          fontWeight: 600,
          color: dark ? TEXT_DARK.color : "#262626",
          opacity: t,
          transform: `translateY(${(1 - t) * 20}px)`,
        }}
      >
        {title}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: 34,
            color: dark ? TEXT_DARK.tint1 : "#909298",
            opacity: interpolate(frame, [8, 26], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ text: string; dark?: boolean }> = ({
  text,
  dark = true,
}) => (
  <div
    style={{
      position: "absolute",
      bottom: 70,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: FONT.sans,
      fontSize: 40,
      lineHeight: 1.45,
      color: dark ? "#FFFFFF" : "#262626",
      textShadow: dark ? "0 2px 12px rgba(0,0,0,0.85)" : "none",
      padding: "0 160px",
      pointerEvents: "none",
    }}
  >
    {text}
  </div>
);

/** Fallback when a scene's pattern is unknown or its data is malformed. */
const UnknownPattern: React.FC<{ id: string; pattern: string; dark: boolean }> = ({
  id,
  pattern,
  dark,
}) => (
  <AbsoluteFill
    style={{
      background: dark ? CANVAS_DARK.bg : "#F5F5F5",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT.mono,
      fontSize: 28,
      color: "#E7000B",
    }}
  >
    {`unrenderable scene "${id}" (pattern: ${pattern})`}
  </AbsoluteFill>
);

/** Dispatch one IR scene to its pattern component. */
const RenderScene: React.FC<{ scene: SceneIRScene; dark: boolean }> = ({
  scene,
  dark,
}) => {
  switch (scene.pattern) {
    case "TitleCard": {
      const d = scene.data as { title: string; subtitle?: string };
      if (!d?.title) break;
      return <TitleCard title={d.title} subtitle={d.subtitle} dark={dark} />;
    }
    case "WorkflowCanvas": {
      const d = scene.data as {
        workflow?: N8nWorkflow;
        zoom?: number;
        animate?: boolean;
        subtitles?: Record<string, string>;
      };
      if (!d?.workflow?.nodes?.length) break;
      return (
        <WorkflowCanvas
          workflow={d.workflow}
          zoom={d.zoom ?? 1.6}
          animate={d.animate ?? true}
          subtitles={d.subtitles}
          dark={dark}
        />
      );
    }
    case "ScreenDemo": {
      const d = scene.data as unknown as React.ComponentProps<typeof ScreenDemo>;
      if (!d?.workflow?.nodes?.length || !d?.focus) break;
      return <ScreenDemo {...d} dark={dark} />;
    }
    case "Act1": {
      const d = scene.data as unknown as {
        workflow?: N8nWorkflow;
        beats?: Act1Beat[];
        runAtFrame?: number;
        runStepF?: number;
        zoom?: number;
        cursor?: boolean;
      };
      if (!d?.workflow?.nodes?.length || !d?.beats?.length) break;
      return (
        <Act1
          workflow={d.workflow}
          beats={d.beats}
          runAtFrame={d.runAtFrame}
          runStepF={d.runStepF}
          zoom={d.zoom}
          cursor={d.cursor}
          dark={dark}
        />
      );
    }
  }
  return <UnknownPattern id={scene.id} pattern={scene.pattern} dark={dark} />;
};

export const IRComposition: React.FC<{ ir: SceneIR }> = ({ ir }) => {
  ensureBurmeseFont();
  const dark = ir.meta.dark ?? true;
  return (
    <AbsoluteFill style={{ background: dark ? CANVAS_DARK.bg : "#F5F5F5" }}>
      {ir.meta.audioFile && <Audio src={staticFile(ir.meta.audioFile)} />}

      {ir.scenes.map((s) => (
        <Sequence
          key={s.id}
          from={s.startFrame}
          durationInFrames={Math.max(1, s.endFrame - s.startFrame)}
        >
          <RenderScene scene={s} dark={dark} />
        </Sequence>
      ))}

      {(ir.captions ?? []).map((c, i) => (
        <Sequence
          key={i}
          from={c.startFrame}
          durationInFrames={Math.max(1, c.endFrame - c.startFrame)}
        >
          <Caption text={c.text} dark={dark} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
