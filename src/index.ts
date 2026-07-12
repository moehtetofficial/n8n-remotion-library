/* =============================================================================
   n8n-remotion-library — barrel export.
   Import everything from one place:
     import { SceneController, N8NNode, useCamera } from "../src";
   ========================================================================== */

// core
export * from "./core/types";
export { SceneController } from "./core/SceneController";
export { Transition } from "./core/Transition";

// camera
export { useCamera } from "./camera/useCamera";
export { CameraRig } from "./camera/CameraRig";

// n8n
export { WorkflowCanvas, Toolbar } from "./n8n/WorkflowCanvas";
export { N8NNode } from "./n8n/N8NNode";
export { ConnectionLayer } from "./n8n/ConnectionLine";
export { ParameterPanel } from "./n8n/ParameterPanel";
export { NodeIcon, renderNodeIcon } from "./n8n/NodeIcon";
export { UIElementView } from "./n8n/UIElementView";

// animation
export { useCursor } from "./animation/useCursor";
export { CursorClick } from "./animation/CursorClick";
export { Typing } from "./animation/Typing";

// effects
export { Glow, Highlight, Grade } from "./effects/Glow";
export { Ambient, Particles } from "./effects/Ambient";
export { Caption, Kinetic, IconsRow } from "./effects/Caption";

// mockup
export { Mockup } from "./mockup/Mockup";
