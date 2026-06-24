# Project Kasena — Animation & Interaction System

Motion is cinematic but purposeful: it reinforces meaning and never blocks
content. Framer Motion 12 (already a dependency) + Tailwind keyframes. **No new
competing animation libraries.**

## Capability gate

`usePrefersReducedMotion()` (`src/marketing/lib/motion.ts`) returns true when
**any** of: `prefers-reduced-motion: reduce`, `navigator.connection.saveData`,
or `deviceMemory <= 2`. When true, all marketing motion primitives render their
content **immediately, untransformed**. A CSS guard in `globals.css` also
neutralises `.pk-animate` / `animate-*` utilities under reduced motion.

## Primitives

| Primitive | Behaviour |
|---|---|
| `Reveal` | fade + rise on scroll into view (`whileInView`, once) |
| `Stagger` + `RevealItem` | staggered children reveal |
| `AnimatedCounter` | count-up from 0 when in view (rAF, eased) |
| `AnimatedWordNetwork` | hero SVG: pulsing nodes, travelling signal, soundwave; SMIL drops out under reduced motion |
| `CulturalPatternLayer` | static decorative geometry |

## Tailwind motion utilities

`animate-marquee` / `animate-marquee-slow` (concept ticker, masked with
`pk-marquee-mask`), `animate-float`, `animate-aurora` (hero blobs),
`animate-shimmer`, `animate-spin-slow`. Easing token: `ease-emphasized`.

## Microinteractions

- Buttons: hover elevation + `active:scale-[0.97]` press feedback.
- Cards: `hover:-translate-y-1` + shadow lift (restrained).
- Header: transparent → blurred/solid on scroll.
- Mega-menu chevron rotate; mobile drawer slide + scrim fade.
- Forms: button loading text, success/error transitions.

## Performance & accessibility rules

- No autoplay background video; no heavy WebGL.
- Hero visual is lightweight SVG (works on low-end mobile).
- Animations never delay access to important content; no scroll hijacking.
- Respect `prefers-reduced-motion` and `Save-Data` everywhere (see gate above).
- `will-change` only on the few elements that animate continuously (aurora).
