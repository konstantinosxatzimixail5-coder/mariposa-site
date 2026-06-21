# Hero video encodes

The hero plays an optimized loop on **both** desktop and mobile, over a poster
that is the LCP element. We never serve the 12 MB 4K master
(`public/video/mariposa-hero-4k.mp4`) — it's kept only as the encoding source.

`ffmpeg` wasn't available in the build environment, so run these locally (or in
CI), commit the outputs to `public/video/`, and the hero will upgrade to them
automatically. Until they exist, the hero falls back to the small in-repo
`hero.webm` / `hero.mp4`, so it still plays.

```bash
# Poster (1600px wide, frame at ~2s) — the LCP image
ffmpeg -i public/video/mariposa-hero-4k.mp4 -ss 00:00:02 -frames:v 1 \
  -vf "scale=1600:-2" public/video/hero-poster.jpg

# 1080p MP4 (H.264), audio stripped, web-optimized
ffmpeg -i public/video/mariposa-hero-4k.mp4 -an -vf "scale=1920:-2" \
  -c:v libx264 -crf 28 -preset slow -movflags +faststart public/video/hero-1080.mp4

# 1080p WebM (VP9)
ffmpeg -i public/video/mariposa-hero-4k.mp4 -an -vf "scale=1920:-2" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 public/video/hero-1080.webm

# 720p MP4 (H.264) — served to small screens
ffmpeg -i public/video/mariposa-hero-4k.mp4 -an -vf "scale=1280:-2" \
  -c:v libx264 -crf 30 -preset slow -movflags +faststart public/video/hero-720.mp4
```

Filenames the markup expects (see `src/lib/brand.ts` → `BRAND.hero*`):
`hero-poster.jpg`, `hero-1080.webm`, `hero-1080.mp4`, `hero-720.mp4`.

Target sizes: 1080p a few MB at most, 720p smaller. After committing, hard-refresh
and confirm in DevTools → Network that the hero requests `hero-1080.*` on desktop
and `hero-720.mp4` on mobile (and no `mariposa-hero-4k.mp4`).
