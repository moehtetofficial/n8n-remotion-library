import React from "react";
import { Composition, getInputProps } from "remotion";
import { Lesson } from "../compositions/Lesson";
import sceneScript from "./scene-script.json";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  const script: any = sceneScript;
  const audioDur = Number(script?.audio_duration) || 0;
  const lastScene = Array.isArray(script?.scenes) && script.scenes.length
    ? script.scenes[script.scenes.length - 1]
    : null;
  const sceneEnd = lastScene?.end ? Number(lastScene.end) : 0;
  const seconds = Math.max(audioDur, sceneEnd, 3);
  const durationInFrames = Math.max(1, Math.round(seconds * FPS));

  return (
    <Composition
      id="Lesson"
      component={Lesson}
      durationInFrames={durationInFrames}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
