#!/usr/bin/env bash
#
# V2 render — Scene IR -> MP4.
#
#   render-v2.sh <lesson_id> <ir_json_path> [audio_url]
#
# Called from the n8n SSH node. Replaces the Gist-download path:
# the renderer lives in this repo and is version-controlled.
#
set -euo pipefail

LID="${1:?usage: render-v2.sh <lesson_id> <ir.json> [audio_url]}"
IR="${2:?missing ir json path}"
AUDIO_URL="${3:-}"

REPO_DIR="${REPO_DIR:-/media/remotion-v2}"
OUT_DIR="${OUT_DIR:-/media/remotion/out}"
BRANCH="${BRANCH:-main}"
REPO_URL="${REPO_URL:-https://github.com/moehtetofficial/n8n-remotion-library.git}"

mkdir -p "$OUT_DIR"

# Serialise renders — Remotion is memory-hungry and the box has 8 GB.
exec 9>/tmp/remotion-v2.lock
flock -w 1800 9

# --- sync repo -------------------------------------------------------
if [ -d "$REPO_DIR/.git" ]; then
  git -C "$REPO_DIR" fetch --depth 1 origin "$BRANCH"
  git -C "$REPO_DIR" reset --hard "origin/$BRANCH"
  git -C "$REPO_DIR" clean -fd -e node_modules -e public/audio
else
  git clone --depth 1 -b "$BRANCH" "$REPO_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"

# --- deps (only when the lockfile actually changed) -------------------
NEED_INSTALL=1
if [ -d node_modules ] && [ -f .deps-hash ]; then
  if [ "$(sha1sum package.json | cut -d' ' -f1)" = "$(cat .deps-hash)" ]; then
    NEED_INSTALL=0
  fi
fi
if [ "$NEED_INSTALL" = "1" ]; then
  npm install --no-audit --no-fund
  sha1sum package.json | cut -d' ' -f1 > .deps-hash
fi

# --- inject the IR ---------------------------------------------------
cp "$IR" src/kit/scene-ir.json
node -e "
  const ir = require('./src/kit/scene-ir.json');
  if (!ir.meta || !Array.isArray(ir.scenes)) throw new Error('bad IR: missing meta/scenes');
  if (!ir.meta.totalFrames) throw new Error('bad IR: totalFrames is 0');
  console.log('IR ok:', ir.scenes.length, 'scenes,', ir.meta.totalFrames, 'frames');
"

# --- audio -----------------------------------------------------------
if [ -n "$AUDIO_URL" ]; then
  mkdir -p public/audio
  curl -fsSL "$AUDIO_URL" -o "public/audio/lesson_${LID}.wav"
  node -e "
    const fs=require('fs');
    const p='./src/kit/scene-ir.json';
    const ir=JSON.parse(fs.readFileSync(p,'utf8'));
    ir.meta.audioFile='audio/lesson_${LID}.wav';
    fs.writeFileSync(p, JSON.stringify(ir,null,2));
    console.log('audio wired:', ir.meta.audioFile);
  "
fi

# --- render ----------------------------------------------------------
OUT="$OUT_DIR/lesson_${LID}.mp4"
npx remotion render remotion.root.tsx V2Lesson "$OUT" \
  --log=error \
  --concurrency=1 \
  --timeout=180000

# --- report ----------------------------------------------------------
SIZE=$(stat -c%s "$OUT")
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT" || echo 0)
echo "{\"ok\":true,\"lesson_id\":\"${LID}\",\"path\":\"${OUT}\",\"size_bytes\":${SIZE},\"duration_s\":${DUR}}"
