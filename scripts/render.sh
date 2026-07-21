#!/usr/bin/env bash
# =============================================================================
# render.sh — unified render entry for the n8n-remotion-library engine.
#
# Replaces the Gist-based single-file render path. Renders compositions/Lesson.tsx
# (full engine: SceneController + CameraRig + Transition + Mockup) instead of the
# flat Gist Lesson.tsx.
#
# Usage:
#   render.sh render        <lesson_id> [suffix]   -> full 1080p mp4
#   render.sh preview-proxy <lesson_id> [suffix]   -> fast scale=0.33 crf=32 proxy
#   render.sh stills        <lesson_id> [n]        -> n QA still frames (default 4)
#
# Contract (caller responsibilities, done by the SSH node BEFORE calling this):
#   - repo checked out / updated at $REPO
#   - $REPO/src/scene-script.json written (component-refs resolved, audio_duration set)
#   - $REPO/public/audio.wav present (or scene-script has no audio_file)
#
# Output:
#   render        -> $OUT/lesson_<id><suffix>.mp4
#   preview-proxy -> $OUT/lesson_<id><suffix>_preview.mp4
#   stills        -> $OUT/stills_<id>/frame_*.png  (+ echoes paths)
# =============================================================================
set -euo pipefail

MODE="${1:?mode required: render|preview-proxy|stills}"
LID="${2:?lesson_id required}"
ARG3="${3:-}"

REPO="/media/n8n-remotion-library"
export REPO
OUT="/media/remotion/out"
ENTRY="remotion.root.tsx"       # repo entry (registerRoot); NOT src/index.tsx
COMP="Lesson"

mkdir -p "$OUT"
cd "$REPO"

# ---- deps: install once, repin only on Remotion version drift --------------
if [ ! -d node_modules ]; then
  echo "[render.sh] installing node_modules (first run)…"
  npm install --silent 2>&1 | tail -3
fi
RV=$(node -p "require('remotion/package.json').version" 2>/dev/null || echo "")
CV=$(node -p "require('@remotion/cli/package.json').version" 2>/dev/null || echo "")
if [ -n "$RV" ] && [ "$RV" != "$CV" ]; then
  echo "[render.sh] REMOTION_DRIFT $RV vs $CV -> repinning"
  npm install remotion@"$RV" @remotion/cli@"$RV" @remotion/bundler@"$RV" \
    @remotion/renderer@"$RV" @remotion/media-utils@"$RV" @remotion/player@"$RV" \
    --save-exact --silent 2>&1 | tail -3
fi
[ -d node_modules/gsap ] || npm install gsap@3.12.5 --save-exact --silent 2>&1 | tail -2

# ---- sanity: scene-script present ------------------------------------------
if [ ! -f "$REPO/src/scene-script.json" ]; then
  echo "[render.sh] FATAL: $REPO/src/scene-script.json missing" >&2
  exit 3
fi

case "$MODE" in
  render)
    TARGET="$OUT/lesson_${LID}${ARG3}.mp4"
    echo "[render.sh] render -> $TARGET"
    npx remotion render "$ENTRY" "$COMP" "$TARGET" --log=error 2>&1 | tail -30
    ls -la "$TARGET"
    ;;

  preview-proxy)
    TARGET="$OUT/lesson_${LID}${ARG3}_preview.mp4"
    echo "[render.sh] preview-proxy -> $TARGET"
    npx remotion render "$ENTRY" "$COMP" "$TARGET" \
      --scale=0.33 --crf=32 --log=error 2>&1 | tail -30
    ls -la "$TARGET"
    ;;

  stills)
    N="${ARG3:-4}"
    SDIR="$OUT/stills_${LID}"
    mkdir -p "$SDIR"
    # derive total frames from scene-script (audio_duration / last scene end) * 30
    TOTF=$(node -e '
      const s=require(process.env.REPO+"/src/scene-script.json");
      const ad=Number(s.audio_duration)||0;
      const last=Array.isArray(s.scenes)&&s.scenes.length?s.scenes[s.scenes.length-1]:null;
      const se=last&&last.end?Number(last.end):0;
      const sec=Math.max(ad,se,3);
      process.stdout.write(String(Math.max(1,Math.round(sec*30))));
    ' 2>/dev/null || echo 90)
    echo "[render.sh] stills n=$N total_frames=$TOTF -> $SDIR"
    for i in $(seq 1 "$N"); do
      # evenly spaced, avoid frame 0 and last frame edge
      F=$(( TOTF * i / (N + 1) ))
      [ "$F" -lt 1 ] && F=1
      OUTF="$SDIR/frame_$(printf '%03d' "$F").png"
      npx remotion still "$ENTRY" "$COMP" "$OUTF" --frame="$F" --log=error 2>&1 | tail -3
      echo "STILL $OUTF"
    done
    ls -la "$SDIR"
    ;;

  *)
    echo "[render.sh] unknown mode: $MODE" >&2
    exit 2
    ;;
esac
