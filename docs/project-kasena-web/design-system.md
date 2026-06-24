# Project Kasena — Design System

A premium, culturally-grounded, mobile-first system. All tokens live in
`tailwind.config.js` and `src/styles/globals.css`. The marketing site is scoped
under the `.pk` class (focus rings, etc.).

## Brand colours (tonal scales 50–950)

| Token | Base | Role |
|---|---|---|
| `indigo` | `#1E365D` | Primary technology foundation, dark sections, headings |
| `terracotta` | `#B65A3A` | Warm accent, secondary CTAs |
| `kente` | `#D69B00` | Gold highlight, primary accent / “gold” buttons |
| `savannah` | `#245C3B` | Success/“available”, supporting accent |
| `cream` | `#FBF7EE` | Plaster cream surfaces / light backgrounds |
| `charcoal` | `#111827` | Body text (`charcoal`, `charcoal-light`, `charcoal-muted`) |
| `sand` | warm grey 50–900 | Neutral surfaces, skeletons |

> The legacy `kassena.*` palette is **kept** so existing app screens are
> unaffected. New marketing UI uses the scales above. Indigo + neutrals lead;
> terracotta / gold / green are deliberate accents — never all at once.

## Typography

- **Display**: `font-display` → Sora Variable (falls back to Inter for missing glyphs).
- **Body**: `font-sans` → Inter Variable.
- **Kasem text**: `font-kasem` → Inter Variable (carries Á á É é Ɛ ɛ Ŋ ŋ Ɔ ɔ via the latin-ext subset). Always wrap Kasem words in `font-kasem`.
- Self-hosted via `@fontsource-variable/*` (no Google CDN). Only the `wght` axis is imported; subsets download on demand by `unicode-range`.
- **Fluid scale** (`clamp()`): `text-fluid-sm … text-fluid-5xl`.

## Spacing, radius, elevation

- Container: `.container` (centered, responsive padding, max `1200px`).
- Radius: Tailwind defaults + `rounded-4xl` (2rem), `rounded-5xl` (2.5rem).
- Shadows: `shadow-soft`, `shadow-card`, `shadow-lifted`, `shadow-glow`.
- Easing: `ease-emphasized` `cubic-bezier(0.16,1,0.3,1)`.
- Z-index tokens in CSS vars (`--pk-z-*`).

## Core components (`src/marketing/components`)

| Component | Purpose |
|---|---|
| `ui/Button` (+ `ArrowLink`) | primary/secondary/outline/ghost/gold; sm/md/lg; link/anchor/native |
| `ui/Section`, `Container`, `Eyebrow`, `SectionHeader` | layout + section rhythm/tone |
| `ui/Glyph` | inline SVG icon set (no image requests) |
| `ui/StatusBadge` → `ProductStatusBadge`, `MetricLabel` | **enforces honest status/metric labels** |
| `ui/Logo` | SVG node-branch mark + wordmark |
| `motion/Reveal` (`Reveal`, `Stagger`, `RevealItem`) | scroll reveal, reduced-motion aware |
| `motion/AnimatedCounter` | count-up on view |
| `visuals/AnimatedWordNetwork` | hero SVG language→network constellation |
| `visuals/CulturalPatternLayer` | Sirigu/weave/dots decorative layers |
| `visuals/ResponsiveImage` | CLS-safe AVIF/WebP `<picture>` + skeleton |
| `forms/NewsletterForm` | validated newsletter capture |

## Layout shell (`src/marketing/layout`)

`MarketingLayout` (skip link + scroll-to-top) → `SiteHeader` (sticky,
scroll-aware, accessible mega-menus) + `MobileNav` (scroll-locking drawer, focus
trap, Escape) + `Footer` (links, newsletter, status pills, alliance statement).

## Cultural pattern usage

Sirigu geometry / basketry / weave motifs are used **only** as subtle borders,
masks, separators and low-opacity backgrounds (`opacity` 0.04–0.08). They are
original geometric motifs and are **never labelled as authentic artefacts**.

## Accessibility defaults

WCAG 2.2 AA target — semantic HTML, one `<h1>` per page, `.pk-focus` visible
rings, 44px touch targets, `prefers-reduced-motion` + `Save-Data` honoured,
descriptive alt text, labelled forms with `role="status"` / `role="alert"`.
