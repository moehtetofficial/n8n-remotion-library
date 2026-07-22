import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { CanvasBackground } from "./CanvasBackground";
import { WorkflowNode } from "./WorkflowNode";
import { Connection } from "./Connection";
import { NdvPanel } from "./NdvPanel";
import { Cursor, choreograph } from "./Cursor";
import { GRID, theme } from "./tokens";
import type { N8nWorkflow } from "./WorkflowCanvas";

export interface ScreenDemoProps {
  workflow: N8nWorkflow;
  /** which node the cursor opens */
  focus: string;
  fields: Array<{ label: string; value: string; select?: boolean }>;
  /** index of the field that gets typed into */
  typeFieldIndex?: number;
  zoom?: number;
  dark?: boolean;
}

/* Beat sheet — frame numbers for the whole interaction. */
const BEAT = {
  cursorStart: 6,
  nodeClick: 0,   // filled in from choreography
  ndvOpen: 0,
  fieldClick: 0,
  typeStart: 0,
};

export const ScreenDemo: React.FC<ScreenDemoProps> = ({
  workflow,
  focus,
  fields,
  typeFieldIndex = 1,
  zoom = 1.6,
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const T = theme(dark);

  const xs = workflow.nodes.map((n) => n.position[0]);
  const ys = workflow.nodes.map((n) => n.position[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX + GRID.nodeW;
  const h = Math.max(...ys) - minY + GRID.nodeH;

  const target = workflow.nodes.find((n) => n.name === focus)!;
  // node centre in screen space (canvas is centred, then scaled)
  const nodeCx = 1920 / 2 + (target.position[0] - minX - w / 2 + GRID.nodeW / 2) * zoom;
  const nodeCy = 1080 / 2 + (target.position[1] - minY - h / 2 + GRID.nodeH / 2) * zoom;

  // panel is placed to the right of centre
  const panelX = 1920 / 2 + 120;
  const panelY = 1080 / 2 - 150;
  const fieldY = panelY + 108 + typeFieldIndex * 74;
  const fieldX = panelX + 60;

  const actions = choreograph(
    { x: 320, y: 880 },
    [
      { x: nodeCx, y: nodeCy, click: true, atFrame: BEAT.cursorStart },
      { x: fieldX, y: fieldY, click: true, atFrame: 62 },
    ],
  );

  const clicks = actions.filter((a) => a.type === "click");
  const nodeClickF = clicks[0]?.atFrame ?? 30;
  const fieldClickF = clicks[1]?.atFrame ?? 90;

  const ndvOpenF = nodeClickF + 6;
  const typeStartF = fieldClickF + 8;

  // canvas dims + pushes left once the NDV opens
  const dim = interpolate(frame, [ndvOpenF, ndvOpenF + 14], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ndvFields = fields.map((f, i) => ({
    ...f,
    typeAtFrame: i === typeFieldIndex ? typeStartF : undefined,
    focusAtFrame: i === typeFieldIndex ? fieldClickF : undefined,
  }));

  return (
    <AbsoluteFill>
      <CanvasBackground dark={dark} />

      {/* canvas layer */}
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${-dim * 300}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: w,
            height: h,
            transform: `scale(${zoom})`,
            transformOrigin: "center",
          }}
        >
          {Object.entries(workflow.connections).map(([src, conn]) =>
            (conn.main ?? []).flatMap((outs, oi) =>
              outs.map((c, ci) => {
                const a = workflow.nodes.find((n) => n.name === src)!;
                const b = workflow.nodes.find((n) => n.name === c.node)!;
                return (
                  <Connection
                    key={`${src}-${oi}-${ci}`}
                    from={{ x: a.position[0] - minX, y: a.position[1] - minY }}
                    to={{ x: b.position[0] - minX, y: b.position[1] - minY }}
                    dark={dark}
                  />
                );
              }),
            ),
          )}
          {workflow.nodes.map((n) => (
            <WorkflowNode
              key={n.name}
              type={n.type}
              name={n.name}
              x={n.position[0] - minX}
              y={n.position[1] - minY}
              dark={dark}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* dim scrim behind the NDV */}
      <AbsoluteFill
        style={{ background: "#000", opacity: dim * 0.12, pointerEvents: "none" }}
      />

      {/* NDV panel */}
      {frame >= ndvOpenF && (
        <div style={{ position: "absolute", left: panelX, top: panelY }}>
          <NdvPanel
            nodeType={target.type}
            title={target.name}
            fields={ndvFields}
            openAtFrame={ndvOpenF}
            width={T.NDV.mainPanelWidth}
            dark={dark}
          />
        </div>
      )}

      <Cursor actions={actions} start={{ x: 320, y: 880 }} />
    </AbsoluteFill>
  );
};
