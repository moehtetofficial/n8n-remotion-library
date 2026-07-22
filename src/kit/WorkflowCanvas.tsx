import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { CanvasBackground } from "./CanvasBackground";
import { WorkflowNode } from "./WorkflowNode";
import { Connection } from "./Connection";
import { GRID } from "./tokens";

/** Minimal shape of real n8n workflow JSON. */
export interface N8nWorkflow {
  nodes: Array<{
    name: string;
    type: string;
    position: [number, number];
    parameters?: Record<string, unknown>;
  }>;
  connections: Record<
    string,
    { main?: Array<Array<{ node: string; type: string; index: number }>> }
  >;
}

export interface WorkflowCanvasProps {
  workflow: N8nWorkflow;
  /** canvas zoom, 1 = 100% */
  zoom?: number;
  /** true = animate nodes/edges in; false = show final state */
  animate?: boolean;
  subtitles?: Record<string, string>;
  dark?: boolean;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  workflow,
  zoom = 1,
  animate = true,
  subtitles = {},
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const byName = new Map(workflow.nodes.map((n) => [n.name, n]));

  // Centre the workflow bounding box in the viewport.
  const xs = workflow.nodes.map((n) => n.position[0]);
  const ys = workflow.nodes.map((n) => n.position[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX + GRID.nodeW;
  const h = Math.max(...ys) - minY + GRID.nodeH;

  // node i appears at frame i*8; edges follow the later of their endpoints
  const nodeProgress = (i: number) =>
    animate
      ? interpolate(frame, [i * 8, i * 8 + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const idx = (name: string) =>
    workflow.nodes.findIndex((n) => n.name === name);

  return (
    <AbsoluteFill>
      <CanvasBackground dark={dark} />
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          {/* edges under nodes */}
          {Object.entries(workflow.connections).map(([src, conn]) =>
            (conn.main ?? []).flatMap((outputs, oi) =>
              outputs.map((c, ci) => {
                const a = byName.get(src);
                const b = byName.get(c.node);
                if (!a || !b) return null;
                const after = Math.max(idx(src), idx(c.node));
                const p = animate
                  ? interpolate(
                      frame,
                      [after * 8 + 10, after * 8 + 26],
                      [0, 1],
                      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                    )
                  : 1;
                return (
                  <Connection
                    key={`${src}-${oi}-${ci}`}
                    from={{ x: a.position[0] - minX, y: a.position[1] - minY }}
                    to={{ x: b.position[0] - minX, y: b.position[1] - minY }}
                    progress={p}
                    dark={dark}
                  />
                );
              }),
            ),
          )}

          {workflow.nodes.map((n, i) => (
            <WorkflowNode
              key={n.name}
              type={n.type}
              name={n.name}
              x={n.position[0] - minX}
              y={n.position[1] - minY}
              subtitle={subtitles[n.name]}
              progress={nodeProgress(i)}
              dark={dark}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
