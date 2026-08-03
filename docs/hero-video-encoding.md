# Hero video encodes

The hero plays an optimized loop on **both** desktop and mobile, over a poster
that is the LCP element. The 12 MB source (`public/video/mariposa-hero-4k.mp4`,
42.1 s, 1080p AV1) is the **encode source only** and is never served to visitors.

What ships (both committed to `public/video/`):

| File | Served to | Size | Duration | Codec |
|---|---|---|---|---|
| `hero-1080.mp4` | desktop (>640px) | ~4.1 MB | 42 s | H.264 High L4.0, 1920×1080, 24fps |
| `hero-720.mp4` | mobile (≤640px) | ~2.2 MB | 42 s | H.264 **Main** L3.1, 1280×720, 24fps |
| `hero-poster.jpg` | everywhere (LCP) | ~50 KB | — | JPEG, 1600px wide |

## Regenerating

⚠️ **Do not add `-ss`/`-t`** unless you intend to trim. An earlier encode used
`-t 12` and shipped only the first 12 s of the 42 s footage — the video appeared
to "stop early" on every device. Always verify duration after encoding.

```bash
# Poster (frame at ~2s, 1600px wide) — the LCP image
ffmpeg -y -i public/video/mariposa-hero-4k.mp4 -ss 00:00:02 -frames:v 1 \
  -vf "scale=1600:-2" public/video/hero-poster.jpg

# 1080p desktop — full length, VBV-capped so total size stays ~4MB
ffmpeg -y -i public/video/mariposa-hero-4k.mp4 -an \
  -vf "scale=1920:-2,fps=24" -c:v libx264 -crf 34 -maxrate 850k -bufsize 1700k \
  -profile:v high -level 4.0 -pix_fmt yuv420p -preset slow -movflags +faststart \
  public/video/hero-1080.mp4

# 720p mobile — full length, Main profile for widest iOS/Android support
ffmpeg -y -i public/video/mariposa-hero-4k.mp4 -an \
  -vf "scale=1280:-2,fps=24" -c:v libx264 -crf 34 -maxrate 450k -bufsize 900k \
  -profile:v main -level 3.1 -pix_fmt yuv420p -preset slow -movflags +faststart \
  public/video/hero-720.mp4

# VERIFY — duration must read 42s, not 12s
ffmpeg -i public/video/hero-1080.mp4 2>&1 | grep Duration
ffmpeg -i public/video/hero-720.mp4  2>&1 | grep Duration
```

Why these flags matter:
- `-an` — no audio track (the hero is muted; audio would be dead weight).
- `-pix_fmt yuv420p` — the only chroma format Safari/iOS reliably decodes.
- `-movflags +faststart` — moves the moov atom to the front so the video can
  **stream** instead of needing a full download before playback.
- `-profile:v main -level 3.1` on mobile — maximum compatibility with older iOS
  and low-end Android decoders.
- `-maxrate`/`-bufsize` — caps the bitrate so a longer clip can't balloon in size.

No `ffmpeg` locally? `pnpm add -D ffmpeg-static`, run
`node node_modules/.pnpm/ffmpeg-static@*/node_modules/ffmpeg-static/install.js`
to fetch the binary, use it, then `pnpm remove ffmpeg-static`.

## How it's loaded (`src/components/HeroBackground.tsx`)

- The poster is server-rendered with `priority` → it is the LCP element.
- The `<video>` mounts only on **browser idle** (after first paint) with
  `preload="metadata"`, then streams — so it never competes with the LCP paint.
- Sources are resolved server-side (`src/lib/hero-media.ts`) to **exactly one
  file per breakpoint**, so a browser never downloads multiple encodes.
- Skipped entirely under `prefers-reduced-motion`, `Save-Data` and 2g → poster only.
- iOS: `muted`/`playsInline` are set imperatively before `play()` (React's prop
  timing can otherwise make Safari refuse autoplay), `play()` is retried on
  `canplay` and on the first user gesture, and the poster→video cross-fade is
  driven by the `playing` event — so a blocked autoplay leaves the poster showing
  rather than a frozen frame.
