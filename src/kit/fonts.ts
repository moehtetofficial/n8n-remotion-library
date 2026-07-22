import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Burmese text needs Padauk. Remotion's headless Chrome has no system
 * Myanmar font, so the glyphs render as tofu unless we load it ourselves.
 *
 * The TTFs ship in public/fonts/ so the render is self-contained — it
 * does NOT depend on fontconfig on the render host.
 */
let loaded = false;

export function ensureBurmeseFont(): void {
  if (loaded || typeof document === "undefined") return;
  loaded = true;

  const handle = delayRender("Loading Padauk");

  const faces = [
    new FontFace(
      "Padauk",
      `url(${staticFile("fonts/Padauk-Regular.ttf")}) format("truetype")`,
      { weight: "400" },
    ),
    new FontFace(
      "Padauk",
      `url(${staticFile("fonts/Padauk-Bold.ttf")}) format("truetype")`,
      { weight: "700" },
    ),
  ];

  Promise.all(faces.map((f) => f.load()))
    .then((fs) => {
      fs.forEach((f) => document.fonts.add(f));
      continueRender(handle);
    })
    .catch((err) => {
      console.error("Padauk failed to load:", err);
      continueRender(handle);
    });
}
