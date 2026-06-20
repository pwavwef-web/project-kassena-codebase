# Project Kasena — Image Generation Prompts

This file is the production source for every photographic / illustrative image
the website needs. Direct image generation was **not available** in the build
environment, so the site currently ships with original CSS/SVG visuals and
`ResponsiveImage` placeholders (default `/social/og-default.svg`). Replace the
placeholders with generated assets using the prompts below — the components are
built so images can be swapped **without layout changes** (every `ResponsiveImage`
has fixed `width`/`height`).

## Global art direction (prepend to every prompt)

> Northern Ghana cultural authenticity, documentary realism with a subtle
> African‑futurism edge, premium editorial quality, warm human scenes, natural
> cinematic but believable lighting. Colour accents drawn from a palette of deep
> indigo (#1E365D), terracotta (#B65A3A), kente gold (#D69B00), savannah green
> (#245C3B) and plaster cream (#FBF7EE). No text or lettering in the image, no
> watermarks, no logos, no fake writing, no unreadable AI text, no generic
> “tribal” styling, no stereotypical or generic “African village” clichés, no
> glowing-brain / robot AI clichés, no stock-photo collage look. Real, dignified
> people and places.

## Negative prompt (append to every prompt)

> text, watermark, logo, signature, distorted hands, extra fingers, lowres,
> jpeg artifacts, oversaturated, HDR halo, plastic skin, fake script, gibberish
> letters, robot, glowing brain, neon cyberpunk, tribal-mask clipart.

## Output & format spec

| Use | Aspect | Export sizes | Formats |
|---|---|---|---|
| Hero (desktop) | 16:9 / 3:2 | 2400×1350, 1600×900 | AVIF + WebP (+ JPG fallback) |
| Hero (mobile crop) | 4:5 | 1080×1350 | AVIF + WebP |
| Editorial content | 16:9 | 1600×900, 800×450 | AVIF + WebP |
| Portrait storytelling | 4:5 | 1080×1350 | AVIF + WebP |
| Social card (OG) | 1.91:1 | 1200×630 | **PNG** (SVG source in `/public/social`) |
| Social square | 1:1 | 1080×1080 | PNG/WebP |
| Page header band | 21:9 | 2400×1000 | AVIF + WebP |
| Texture overlay | tileable | 1024×1024 | PNG (transparent) |

Always export AVIF + WebP, keep a high-quality original, add responsive
`srcset`/`sizes`, set explicit dimensions, lazy-load below the fold, and write
descriptive alt text. Do **not** serve desktop-resolution images to small
phones.

---

## Required images

### 1. Elder & young person sharing language knowledge
> An elder and a teenager sitting together outdoors in northern Ghana, the elder
> speaking and the young person listening intently while taking notes on a phone.
> Warm late‑afternoon light, mudbrick architecture softly blurred behind them,
> genuine connection between generations. 4:5 portrait. [global + negative]

### 2. Youth contributing through mobile devices
> A young Ghanaian woman in a bright everyday outfit using a smartphone to record
> a word, focused and confident, market or schoolyard softly out of focus.
> Documentary realism, 4:5. [global + negative]

### 3. Community validation with teachers and elders
> Three to four community members — a teacher, two elders — reviewing printed and
> on‑screen language entries around a wooden table, discussing and pointing.
> Collaborative, respectful mood. 16:9. [global + negative]

### 4. Kasem language data becoming a digital network (abstract)
> Abstract editorial illustration: handwritten‑feeling word cards dissolving into
> a clean constellation of connected glowing data nodes, branching upward like a
> baobab tree. Indigo background, kente‑gold nodes, terracotta and green accents.
> No readable text. 16:9. [global + negative]

### 5. Cultural architecture and patterns
> Close, dignified photograph of Sirigu‑style painted wall geometry and basketry
> texture in warm daylight, shallow depth of field. 16:9 and a 1024² tileable
> crop for texture overlays. [global + negative]

### 6. Diaspora reconnection
> A multi‑generational Ghanaian family at home abroad on a video call with
> relatives, warm interior light, phone/laptop screen glow on faces (screen
> content not legible). 16:9. [global + negative]

### 7. Education & bilingual learning
> A bright classroom in northern Ghana, a teacher at a simple board and engaged
> students, a tablet showing a learning app on a desk (UI not legible). 16:9.
> [global + negative]

### 8. Voice & audio preservation
> An elder speaking into a simple field recorder / phone mic while a younger
> person monitors levels, quiet respectful documentation session, soft window
> light. 4:5. [global + negative]

### 9. Community data drives
> A small group at a community centre or schoolyard running a language‑collection
> session, people queuing to record words at simple stations. Energetic,
> hopeful. 16:9. [global + negative]

### 10. Ethical AI & language sovereignty (abstract)
> Editorial abstract: a protective cupped pair of hands made of woven basketry
> lines holding a softly glowing network of language nodes. Indigo + gold,
> communicates stewardship and care, not surveillance. 1:1 and 16:9.
> [global + negative]

### 11. Kasem words flowing through a digital system (abstract)
> Stream of warm‑toned word particles flowing left‑to‑right through stylised
> validation gates into an ordered grid of verified entries. No readable text.
> 21:9 header band. [global + negative]

### 12. Future voice interfaces grounded in Northern Ghanaian identity (abstract)
> An elder’s portrait in profile dissolving gently into a soundwave that becomes
> a clean interface waveform, indigo→gold gradient, dignified and human. 16:9.
> [global + negative]

---

## Where each image is used (wire-up map)

- **OG/social**: `/public/social/og-default.svg` (replace with PNG export of #4/#11 styling).
- **Home hero**: currently the `AnimatedWordNetwork` SVG (keep, or pair with #4).
- **About**: #1, #3.
- **Community & Impact**: #2, #9, #6.
- **Culture & Heritage**: #5 (+ texture), #8.
- **AI & Data**: #10, #11, #12 (abstract only — never imply operational AI).
- **How it works**: #3.
- **Updates / editorial**: per‑article 16:9 from the relevant theme.

When you generate finals, drop them in `/public/images/<page>/` and update the
`ResponsiveImage` `src`/`sources`/`alt` in the corresponding page component.
