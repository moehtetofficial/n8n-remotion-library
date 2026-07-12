import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { Script, Scene, FPS } from "../src/core/types";
import { SceneController } from "../src/core/SceneController";
import { Transition } from "../src/core/Transition";
import sceneScript from "../src/scene-script.json";

const script: Script = sceneScript as any;

/* -------- Title card fallback (empty scenes) ------------------------------ */
const TitleCard: React.FC<{ title: string }> = ({ title }) => {
  const frame = useCurrentFrame();
  const s = spring({ frame, fps: FPS, config: { damping: 14, stiffness: 80 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})`,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
          color: "#fff", fontSize: 78, fontWeight: 800, textAlign: "center",
          padding: "0 140px", fontFamily: '"Padauk","Noto Sans Myanmar",sans-serif',
          textShadow: "0 8px 40px rgba(234,75,113,0.5)",
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};

/* -------- Root composition ------------------------------------------------ */
export const Lesson: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  const scenes: Scene[] = Array.isArray(script.scenes) ? script.scenes : [];

  return (
    <AbsoluteFill style={{ background: "#0b0b12" }}>
      {scenes.length === 0 ? (
        <TitleCard title={script.title || "Lesson"} />
      ) : (
        scenes.map((scene, i) => {
          const startF = Math.max(0, Math.round((scene.start ?? 0) * fps));
          const endF = scene.end != null ? Math.round(scene.end * fps) : durationInFrames;
          const durF = Math.max(1, endF - startF);
          return (
            <Sequence key={i} from={startF} durationInFrames={durF} layout="none">
              <Transition scene={scene} durF={durF}>
                <SceneController scene={scene} durF={durF} />
              </Transition>
            </Sequence>
          );
        })
      )}
      {script.audio_file ? <Audio src={staticFile(script.audio_file)} /> : null}
    </AbsoluteFill>
  );
};
