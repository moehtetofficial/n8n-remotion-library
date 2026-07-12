# n8n-remotion-library

Reusable Remotion component library for programmatic tutorial + niche videos.
Recreates the n8n editor UI in code (no screen recording) and animates it with
a fake cursor, keyframe camera, and node/connection components. All pieces are
niche-agnostic — the `n8n/` folder is the only n8n-specific part; `camera/`,
`animation/`, `effects/`, `mockup/`, and `core/` work for any video type.

## Structure

```
src/
  core/        SceneController, Transition, types      (scene routing + shared types)
  camera/      useCamera, CameraRig                     (keyframe zoom / pan / follow)
  n8n/         WorkflowCanvas, N8NNode, ConnectionLine,
               ParameterPanel, Toolbar, NodeIcon        (n8n UI recreated)
  animation/   useCursor, CursorClick, Typing           (cursor path, click, typewriter)
  effects/     Ambient, Particles, Caption, Kinetic,
               Glow, Highlight, Grade                   (backgrounds, text, emphasis)
  mockup/      Mockup                                   (mac / browser / terminal chrome)
  index.ts     barrel export
  index.tsx    Remotion root (dynamic duration)
  scene-script.json                                     (input — replaced per render)
compositions/
  Lesson.tsx   render entry (imports from src/)
```

## Reuse in another niche

Add a new composition next to `Lesson.tsx` that imports the same components:

```tsx
import { SceneController, Transition } from "../src";
// build Motivation.tsx / Dhamma.tsx using the same scene schema
```

Register it in `src/index.tsx` with another `<Composition />`.

## Scene schema (scene-script.json)

```jsonc
{
  "title": "…",
  "audio_file": "audio.wav",       // optional; staticFile()
  "audio_duration": 20,            // seconds — drives total frames
  "scenes": [
    {
      "start": 0, "end": 4,
      "type": "intro|concept|screen_demo|code|outro",
      "caption": "Burmese sentence", "caption_mode": "word",
      "transition": "fade|slide|wipe",

      // screen_demo:
      "mockup": "browser|mac|terminal|canvas|none",
      "mockup_title": "n8n — My workflow",
      "ui": [
        { "kind": "node", "label": "Webhook", "icon": "webhook",
          "x": 12, "y": 38, "w": 16, "h": 14,
          "status": "success|error|running|idle", "selected": true },
        { "kind": "panel", "label": "OpenAI", "icon": "openai", "w": 38 }  // w set = param drawer
      ],
      "connections": [{ "from": "Webhook", "to": "OpenAI", "animated": true }],
      "cursor": [{ "x": 20, "y": 45, "click": true, "drag": false, "dwell": 0.5 }],
      "typing": [{ "target": "Model", "value": "gpt-4o-mini", "at": 1, "speed": 16 }],

      // camera (cursor-independent):
      "camera": [
        { "at": 0, "zoom": 1, "x": 50, "y": 50 },
        { "at": 2.5, "zoom": 1.4, "x": 20, "y": 45, "ease": "power2.inOut" }
      ],

      // concept:
      "icons": [{ "slug": "webhook", "label": "Webhook", "x": 32, "y": 42 }],
      "kinetic": ["Line one", "Line two"],
      "code": "return items;", "language": "js",

      "grade": { "vignette": 0.3 }
    }
  ]
}
```

### NodeIcon slugs
`webhook, http, openai, gemini, gsheets, code, telegram, switch, if, set,
schedule, merge, agent, gear` (unknown → gear).

## Key technical notes
- **GSAP + Remotion**: timelines are built `paused` and seeked by frame
  (`tl.progress(frame/fps)` / `tl.seek(seconds)`) for deterministic renders.
- **Camera** is a keyframe system independent of the cursor.
- Pin all `remotion` + `@remotion/*` packages to the SAME version; `gsap` must
  be installed explicitly.

## Render
```
npm install
npx remotion render Lesson out/lesson.mp4
```
