import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Scene, UIElement } from "./types";
import { CameraRig } from "../camera/CameraRig";
import { useCursor } from "../animation/useCursor";
import { CursorClick } from "../animation/CursorClick";
import { Ambient, Particles } from "../effects/Ambient";
import { Caption, Kinetic, IconsRow } from "../effects/Caption";
import { Grade } from "../effects/Glow";
import { Mockup } from "../mockup/Mockup";
import { WorkflowCanvas } from "../n8n/WorkflowCanvas";
import { UIElementView } from "../n8n/UIElementView";
import { ConnectionLayer } from "../n8n/ConnectionLine";
import { ParameterPanel } from "../n8n/ParameterPanel";
import { renderNodeIcon } from "../n8n/NodeIcon";

const SURFACE_W = 1920;
const SURFACE_H = 1080;

/* =============================================================================
   ScreenDemo — a mockup surface with n8n canvas, nodes, connections,
   parameter panel, animated cursor. Camera zoom/pan applied via CameraRig.
   ========================================================================== */
const ScreenDemo: React.FC<{ scene: Scene; durF: number }> = ({ scene, durF }) => {
  const cur = useCursor(scene.cursor, durF);
  const ui = scene.ui || [];
  const nodes = ui.filter((e) => e.kind === "node");
  const others = ui.filter((e) => e.kind !== "node" && e.kind !== "panel" || (e.kind === "panel" && !e.w));
  const panel = ui.find((e) => e.kind === "panel" && e.w); // panel with width = param drawer

  const isCanvas = scene.mockup === "canvas" || scene.mockup === "browser";

  const surface = (
    <>
      {isCanvas ? (
        <WorkflowCanvas>
          {scene.connections && scene.connections.length ? (
            <ConnectionLayer nodes={nodes} connections={scene.connections} surfaceW={SURFACE_W} surfaceH={SURFACE_H} />
          ) : null}
          {ui.filter((e) => !(e.kind === "panel" && e.w)).map((el, i) => (
            <UIElementView key={i} el={el} index={i} />
          ))}
        </WorkflowCanvas>
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, #1e1e2c, #12121a)" }}>
          {ui.filter((e) => !(e.kind === "panel" && e.w)).map((el, i) => (
            <UIElementView key={i} el={el} index={i} />
          ))}
        </div>
      )}
      {/* parameter drawer */}
      {panel && (
        <ParameterPanel
          el={panel}
          fields={(scene.typing || []).map((t) => ({ label: t.target }))}
          typing={scene.typing}
        />
      )}
      {/* cursor sits above everything */}
      <CursorClick x={cur.x} y={cur.y} click={cur.click} drag={cur.drag} />
    </>
  );

  // terminal renders code instead of canvas
  const termContent = scene.mockup === "terminal" && scene.code ? (
    <pre style={{ margin: 0, padding: 28, color: "#c7f9cc", fontFamily: '"JetBrains Mono",monospace', fontSize: 22, lineHeight: 1.5 }}>
      {scene.code}
      <CursorClick x={cur.x} y={cur.y} click={cur.click} drag={cur.drag} />
    </pre>
  ) : null;

  return (
    <AbsoluteFill>
      <Ambient bg={scene.bg} />
      <CameraRig camera={scene.camera} durF={durF} entrance>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: "84%", height: "78%", position: "relative" }}>
            <Mockup kind={scene.mockup} title={scene.mockup_title}>
              {termContent || surface}
            </Mockup>
          </div>
        </AbsoluteFill>
      </CameraRig>
    </AbsoluteFill>
  );
};

/* =============================================================================
   ConceptScene — ambient + particles + icons + kinetic text + code block.
   ========================================================================== */
const ConceptScene: React.FC<{ scene: Scene; durF: number }> = ({ scene, durF }) => {
  const type = scene.type || "concept";
  return (
    <AbsoluteFill>
      <Ambient bg={scene.bg} />
      <Particles />
      <CameraRig camera={scene.camera} durF={durF} entrance={false}>
        {scene.icons && scene.icons.length ? (
          <IconsRow icons={scene.icons} renderIcon={(slug) => renderNodeIcon(slug, 60)} />
        ) : null}
        {scene.kinetic && scene.kinetic.length ? <Kinetic lines={scene.kinetic} /> : null}
        {scene.code && type === "code" ? (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <pre
              style={{
                background: "rgba(18,18,26,0.95)", color: "#d6e4ff",
                padding: "30px 40px", borderRadius: 14, fontSize: 32,
                fontFamily: '"JetBrains Mono",monospace', maxWidth: "80%",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)", border: "1px solid rgba(234,75,113,0.25)",
              }}
            >
              {scene.code}
            </pre>
          </AbsoluteFill>
        ) : null}
      </CameraRig>
    </AbsoluteFill>
  );
};

/* =============================================================================
   SceneController — decides demo vs concept, adds caption + grade.
   ========================================================================== */
export const SceneController: React.FC<{ scene: Scene; durF: number }> = ({ scene, durF }) => {
  const type = scene.type || "concept";
  const isDemo = type === "screen_demo" || (scene.mockup && scene.mockup !== "none");
  return (
    <AbsoluteFill>
      {isDemo ? <ScreenDemo scene={scene} durF={durF} /> : <ConceptScene scene={scene} durF={durF} />}
      {scene.caption ? <Caption text={scene.caption} mode={scene.caption_mode} durF={durF} /> : null}
      <Grade grade={scene.grade} />
    </AbsoluteFill>
  );
};
