# Project Kasena — Accessibility Checklist (WCAG 2.2 AA target)

## Built-in by the design system

- [x] Semantic landmarks: `<header> <main id="main-content"> <footer> <nav>`.
- [x] Skip-to-content link (`.pk-skip-link`) as the first focusable element.
- [x] Visible focus rings everywhere via `.pk-focus` (3px kente outline).
- [x] One `<h1>` per page (page hero); sections use `<h2>`/`<h3>`.
- [x] `prefers-reduced-motion` **and** `Save-Data` / low-memory → motion disabled (`usePrefersReducedMotion`, CSS guard).
- [x] Minimum 44px touch targets on nav, buttons, form controls.
- [x] Mobile drawer: `role="dialog"`, `aria-modal`, focus trap, Escape to close, background scroll lock, closes on route select.
- [x] Desktop menus: `aria-expanded` / `aria-haspopup`, Escape closes, keyboard reachable.
- [x] Forms: associated `<label>`s, `aria-invalid`, `role="alert"` (errors), `role="status"` (success), honeypot for spam.
- [x] Colour is never the only signal (status badges pair colour + text + dot).
- [x] Images via `ResponsiveImage` require `alt`; decorative layers are `aria-hidden`.
- [x] Reduced-motion-safe SVG hero (SMIL animations drop out under reduced motion).

## Per-page review checklist (run on each page)

- [ ] Exactly one `<h1>`; heading order is logical (no skipped levels).
- [ ] All actionable elements reachable and operable by keyboard.
- [ ] Focus order matches visual order; focus visible at every step.
- [ ] All images have meaningful `alt` (or empty `alt` if decorative).
- [ ] Text contrast ≥ 4.5:1 (≥ 3:1 for large text) — verify dark sections.
- [ ] Forms announce loading/success/error to screen readers.
- [ ] No content depends on hover only.
- [ ] Zoom to 200% / 320px width: no loss of content or horizontal scroll.

## Manual test matrix (Final QA)

- [ ] Keyboard-only pass of: primary nav, mobile drawer, contact & partner forms, donation flow, interactive roadmap.
- [ ] Screen reader smoke test (NVDA/VoiceOver) on home, contact, support.
- [ ] `prefers-reduced-motion: reduce` enabled → confirm calm experience.
- [ ] axe / Lighthouse a11y audit ≥ 95 (see qa-report.md).
