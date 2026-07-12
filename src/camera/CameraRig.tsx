import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, interpolate } from "remotion";
import { CameraKey, FPS } from "../core/types";
import { useCamera } from "./useCamera";

/* =============================================================================
   CameraRig — applies keyframe camera to whatever it wraps.
   Optional entrance spring so scenes don't pop in flat.
   ========================================================================== */
export const CameraRig: React.FC<{
  camera?: CameraKey[];
  durF: number;
  entrance?: boolean;
  children: React.ReactNode;
}> = ({ camera, durF, entrance = true, children }) => {
  const frame = useCurrentFrame();
  const cam = useCamera(camera, durF);

  const s = entrance
    ? spring({ frame, fps: FPS, config: { damping: 18, stiffness: 90 } })
    : 1;
  const inScale = interpolate(s as number, [0, 1], [0.96, 1]);
  const inOp = entrance
    ? interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <AbsoluteFill style={{ opacity: inOp }}>
      <AbsoluteFill
        style={{
          transform: `scale(${inScale * cam.zoom})`,
          transformOrigin: `${cam.x}% ${cam.y}%`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
