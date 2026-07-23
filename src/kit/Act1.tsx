import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { CanvasBackground } from "./CanvasBackground";
import { WorkflowNode } from "./WorkflowNode";
import { Connection } from "./Connection";
import { StatusRing, ItemCountBadge, NodeStatus } from "./StatusRing";
import { OutputAddButton } from "./AddButton";
import { SubNodeRow, SubNodeSpec } from "./SubNode";
import { Cursor, choreograph, CURSOR_TIMING } from "./Cursor";
import { GRID, theme } from "./tokens";
import type { N8nWorkflow } from "./WorkflowCanvas";

/**
 * Act 1 — "the empty canvas fills up".
 *
 * The opening beat of nearly every n8n lesson: start on an empty grid,
 * drop the trigger, click the "+", chain the next node, then run it and
 * watch the status rings go green. Everything is frame-scheduled from a
 * single beat sheet so narration can be lined up against named beats.
 */

export interface Act1Beat {
  /** node name from the workflow */
  node: string;
  /** frame the node lands on the canvas */
  appearF: number;
  /** frame the "+" beside it is clicked (omit for the last node) */
  addClickF?: number;
  /** items this node emits, shown on its outgoing edge after the run */
  items?: number;
  /** AI sub-nodes hanging beneath this node */
  subs?: SubNodeSpec[];
}

export interface Act1Props {
  workflow: N8nWorkflow;
  beats: Act1Beat[];
  /** frame the execution starts; status rings cascade from here */
  runAtFrame?: number;
  /** frames between one node finishing and the next starting */
  runStepF?: number;
  zoom?: number;
  dark?: boolean;
  /** show the animated mouse pointer */
  cursor?: boolean;
  /**
   * Fixed zoom. Omit to auto-fit the canvas into the 1920x1080 frame,
   * which is almost always what you want — a hardcoded zoom either
   * crops a wide workflow or leaves a two-node one marooned in space.
   */
  fit?: boolean;
}

/** Layout constants — shared between bounds maths and the children. */
const ADD_GAP = 44;
const SUB_GAP_Y = 150;
const SUB_GAP_X = 40;
/** vertical room a node label + subtitle occupies below the node box */
const LABEL_H = 64;

export const Act1: React.FC<Act1Props> = ({
  workflow,
  beats,
  runAtFrame,
  runStepF = 22,
  zoom,
  dark = true,
  cursor = true,
  fit = true,
}) => {
  const frame = useCurrentFrame();
  const T = theme(dark);

  const byName = new Map(workflow.nodes.map((n) => [n.name, n]));
  const beatOf = new Map(beats.map((b) => [b.node, b]));

  /* ---- canvas bounds -------------------------------------------------
   * The node rectangles alone are not the visual extent: labels hang
   * below every node, the "+" affordance sticks out to the right, and
   * sub-node pills sit well underneath their parent. Measuring only the
   * node boxes pushed all three off-canvas, so the padding below is
   * derived from whatever the beat sheet actually asks for.
   */
  const xs = workflow.nodes.map((n) => n.position[0]);
  const ys = workflow.nodes.map((n) => n.position[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);

  const hasAdd = beats.some((b) => b.addClickF !== undefined);
  const subCounts = beats.map((b) => b.subs?.length ?? 0);
  const maxSubs = Math.max(0, ...subCounts);

  const PAD_RIGHT = hasAdd ? ADD_GAP + 40 : 24;
  const PAD_BOTTOM = maxSubs > 0 ? SUB_GAP_Y + GRID.configurableH + 40 : LABEL_H;
  const PAD_LEFT = 24;
  const PAD_TOP = 24;

  // widest sub-node row, so a 3-tool agent doesn't clip sideways
  const subRowW =
    maxSubs > 0
      ? maxSubs * GRID.configurableW + (maxSubs - 1) * SUB_GAP_X
      : 0;
  const nodeSpanW = Math.max(...xs) - minX + GRID.nodeW;
  const spanW = Math.max(nodeSpanW, subRowW);

  const w = spanW + PAD_LEFT + PAD_RIGHT;
  const h = Math.max(...ys) - minY + GRID.nodeH + PAD_TOP + PAD_BOTTOM;

  // centre the node span inside the padded canvas
  const offsetX = PAD_LEFT + (spanW - nodeSpanW) / 2;
  const offsetY = PAD_TOP;

  const rel = (n: { position: [number, number] }) => ({
    x: n.position[0] - minX + offsetX,
    y: n.position[1] - minY + offsetY,
  });

  /* ---- execution schedule ------------------------------------------ */
  const runStart = runAtFrame ?? Math.max(...beats.map((b) => b.appearF)) + 40;
  const statusOf = (i: number): { status: NodeStatus; atFrame: number } => {
    const start = runStart + i * runStepF;
    const done = start + runStepF;
    if (frame < start) return { status: "idle", atFrame: start };
    if (frame < done) return { status: "running", atFrame: start };
    return { status: "success", atFrame: done };
  };

  /* ---- cursor choreography ----------------------------------------- */
  // The cursor must ARRIVE before the click frame, not at it — a click
  // rendered at the same frame the pointer lands reads as teleporting.
  const clickSteps = beats
    .filter((b) => b.addClickF !== undefined)
    .map((b) => {
      const n = byName.get(b.node)!;
      const p = rel(n);
      return {
        x: p.x + GRID.nodeW + ADD_GAP,
        y: p.y + GRID.nodeH / 2,
        click: true,
        // back the travel out so the pointer settles, dwells, then clicks
        atFrame: Math.max(
          0,
          (b.addClickF as number) -
            CURSOR_TIMING.hoverBeforeClickF -
            CURSOR_TIMING.moveMaxF,
        ),
      };
    });

  const actions = cursor
    ? choreograph({ x: PAD_LEFT, y: h - 20 }, clickSteps)
    : [];

  /* ---- scale ---------------------------------------------------------
   * Fit the padded canvas inside the frame with a safe margin, never
   * upscaling past 2x (past that the 96px node art starts to soften).
   */
  const SAFE_W = 1920 * 0.82;
  const SAFE_H = 1080 * 0.82;
  const autoZoom = Math.min(SAFE_W / w, SAFE_H / h, 2);
  const scale = zoom ?? (fit ? autoZoom : 1);

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
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          {/* edges — drawn once BOTH endpoints have appeared */}
          {Object.entries(workflow.connections).map(([src, conn]) =>
            (conn.main ?? []).flatMap((outs, oi) =>
              outs.map((c, ci) => {
                const a = byName.get(src);
                const b = byName.get(c.node);
                if (!a || !b) return null;
                const bBeat = beatOf.get(c.node);
                const drawF = bBeat ? bBeat.appearF : 0;
                const progress = interpolate(
                  frame,
                  [drawF, drawF + 14],
                  [0, 1],
                  {
                    easing: Easing.bezier(0.22, 1, 0.36, 1),
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  },
                );
                if (progress <= 0) return null;

                const pa = rel(a);
                const pb = rel(b);
                const srcBeat = beatOf.get(src);
                const srcIdx = beats.findIndex((x) => x.node === src);
                const itemsAt =
                  srcIdx >= 0 ? runStart + (srcIdx + 1) * runStepF : Infinity;

                return (
                  <React.Fragment key={`${src}-${oi}-${ci}`}>
                    <Connection
                      from={pa}
                      to={pb}
                      progress={progress}
                      dark={dark}
                    />
                    {srcBeat?.items != null && (
                      <ItemCountBadge
                        count={srcBeat.items}
                        x={(pa.x + GRID.nodeW + pb.x) / 2}
                        y={pa.y + GRID.nodeH / 2 - 22}
                        atFrame={itemsAt}
                        dark={dark}
                      />
                    )}
                  </React.Fragment>
                );
              }),
            ),
          )}

          {/* nodes */}
          {workflow.nodes.map((n) => {
            const b = beatOf.get(n.name);
            const appearF = b?.appearF ?? 0;
            if (frame < appearF) return null;

            const progress = interpolate(
              frame,
              [appearF, appearF + 12],
              [0, 1],
              {
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            );
            const p = rel(n);
            const idx = beats.findIndex((x) => x.node === n.name);
            const st = idx >= 0 ? statusOf(idx) : { status: "idle" as NodeStatus, atFrame: 0 };

            return (
              <div key={n.name}>
                <div
                  style={{
                    position: "absolute",
                    left: p.x,
                    top: p.y,
                    width: GRID.nodeW,
                    height: GRID.nodeH,
                  }}
                >
                  <StatusRing
                    status={st.status}
                    atFrame={st.atFrame}
                    isTrigger={n.type.includes("trigger") || n.type.includes("webhook")}
                  />
                </div>
                <WorkflowNode
                  type={n.type}
                  name={n.name}
                  x={p.x}
                  y={p.y}
                  progress={progress}
                  dark={dark}
                />
                {b?.subs?.length ? (
                  <SubNodeRow
                    parentX={p.x}
                    parentY={p.y}
                    parentW={GRID.nodeW}
                    subs={b.subs}
                    gapY={SUB_GAP_Y}
                    gapX={SUB_GAP_X}
                    atFrame={appearF + 14}
                    dark={dark}
                  />
                ) : null}
                {b?.addClickF !== undefined && (
                  <OutputAddButton
                    nodeX={p.x}
                    nodeY={p.y}
                    gap={ADD_GAP}
                    atFrame={appearF + 12}
                    clickAtFrame={b.addClickF}
                    dark={dark}
                  />
                )}
              </div>
            );
          })}

          {cursor && actions.length > 0 && (
            <Cursor actions={actions} start={{ x: PAD_LEFT, y: h - 20 }} />
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
