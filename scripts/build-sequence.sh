#!/usr/bin/env bash
# Rebuilds the hero scroll-film frame sequences from the Higgsfield master clips.
#
#   media/v1.mp4 … v5.mp4   five first/last-frame-chained clips (1280x720, 24fps, 121 frames each)
#
# Output:
#   public/sequence/desktop/f_###.webp   every 2nd frame, 1280x720          (301 frames)
#   public/sequence/mobile/f_###.webp    every 4th frame, centre-cropped      (151 frames)
#                                        800x720 → 640x576 for portrait screens
#   public/sequence/final-*.webp         last frame, used as the reduced-motion still
#
# Requires ffmpeg with libwebp. If you change frame counts, update DESKTOP/MOBILE
# in components/hero/ThreadSequence.tsx.
set -euo pipefail
cd "$(dirname "$0")/.."

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Concatenate, dropping the first frame of clips 2–5 (it duplicates the previous clip's last frame).
ffmpeg -v error -y -i media/v1.mp4 -i media/v2.mp4 -i media/v3.mp4 -i media/v4.mp4 -i media/v5.mp4 -filter_complex \
  "[0:v]setpts=PTS-STARTPTS[a];[1:v]trim=start_frame=1,setpts=PTS-STARTPTS[b];[2:v]trim=start_frame=1,setpts=PTS-STARTPTS[c];[3:v]trim=start_frame=1,setpts=PTS-STARTPTS[d];[4:v]trim=start_frame=1,setpts=PTS-STARTPTS[e];[a][b][c][d][e]concat=n=5:v=1:a=0[out]" \
  -map "[out]" -c:v libx264 -crf 12 -preset slow -pix_fmt yuv420p "$tmp/full.mp4"

rm -rf public/sequence/desktop public/sequence/mobile
mkdir -p public/sequence/desktop public/sequence/mobile

ffmpeg -v error -y -i "$tmp/full.mp4" -vf "select=not(mod(n\,2)),scale=1280:720:flags=lanczos" -fps_mode passthrough \
  -c:v libwebp -quality 72 -compression_level 6 -preset photo public/sequence/desktop/f_%03d.webp

ffmpeg -v error -y -i "$tmp/full.mp4" -vf "select=not(mod(n\,4)),crop=800:720:240:0,scale=640:576:flags=lanczos" -fps_mode passthrough \
  -c:v libwebp -quality 70 -compression_level 6 -preset photo public/sequence/mobile/f_%03d.webp

ffmpeg -v error -y -i media/keyframes/k5.png -vf "scale=1600:-2" -c:v libwebp -quality 78 public/sequence/final-desktop.webp
ffmpeg -v error -y -i "$tmp/full.mp4" -vf "select=eq(n\,600),crop=800:720:240:0" -fps_mode passthrough -frames:v 1 \
  -c:v libwebp -quality 78 public/sequence/final-mobile.webp

echo "desktop: $(ls public/sequence/desktop | wc -l) frames, mobile: $(ls public/sequence/mobile | wc -l) frames"
