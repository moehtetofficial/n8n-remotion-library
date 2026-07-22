import React from "react";
import { Composition } from "remotion";
import { IRComposition, SceneIR } from "../src/kit/IRComposition";
import irJson from "../src/kit/scene-ir.json";

const ir = irJson as unknown as SceneIR;

/**
 * V2 render path — driven entirely by a pre-computed Scene IR.
 *
 * The render script overwrites src/kit/scene-ir.json before calling
 * `remotion render`, so nothing here changes per-lesson.
 * Runs alongside the legacy Gist-based `Lesson` composition.
 */
export const V2Lesson: React.FC = () => (
  <Composition
    id="V2Lesson"
    component={IRComposition as never}
    durationInFrames={ir.meta.totalFrames}
    fps={ir.meta.fps}
    width={ir.meta.width}
    height={ir.meta.height}
    defaultProps={{ ir }}
  />
);
