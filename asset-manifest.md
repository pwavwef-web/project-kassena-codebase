# Asset manifest

Inventory of assets carried through the Indigen World monorepo migration.

**Conventions**
- *Status* — `active` (used by a current/new product), `reference` (preserved
  for reuse, not wired into a new app yet), `historical` (kept as record).
- No cultural assets were **renamed**. A small set of brand files was **copied**
  (not moved) into `assets/brand/` for the new apps; the originals remain with
  the preserved legacy app.
- *Licence* — none of these assets ship a per-file licence. They are
  project-owned cultural/brand assets. Confirm/author formal licensing before
  external distribution (see Known gaps).

## Brand assets (root `assets/`)

| Original path | New path | Type | Intended product | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `assets/project-kasena-logo.png` | `assets/project-kasena-logo.png` *(unchanged)* | logo (PNG) | Indigen World / Project Kasena | active | Primary brand mark. Name preserved (Project Kasena spelling). |
| `public/favicon.png` | `assets/brand/favicon.png` *(copied)* | favicon (PNG) | web + studio | active | Original also preserved in legacy `public/`. |
| `public/favicon.svg` | `assets/brand/favicon.svg` *(copied)* | favicon (SVG) | web + studio | active | Also copied into each app's `public/`. |
| `public/social/og-default.svg` | `assets/brand/og-default.svg` *(copied)* | OG/social image (SVG) | web | active | PNG export still a TODO (carried over from legacy follow-ups). |

The copied favicons also live in `indigen-world-web/public/` and
`tribestudio/public/` so each app builds standalone.

## Application asset set (preserved with the legacy app)

All moved as part of `public/ → legacy/project-kasena-web/public/`. These are the
Project Kasena / TribeStudio app assets — preserved for reuse by `tribestudio`
(gamification) and `indigen-world-web`.

| Original group | New location | Type | Count | Intended product | Status |
| --- | --- | --- | --- | --- | --- |
| `public/achievements/*.png` | `legacy/project-kasena-web/public/achievements/` | achievement badges | 30 | TribeStudio | reference |
| `public/ranks/*.png` | `legacy/project-kasena-web/public/ranks/` | rank badges | 27 | TribeStudio | reference |
| `public/icons/ui/*.png` + `public/icons/*.png` | `legacy/project-kasena-web/public/icons/` | UI icons | ~56 | web + studio | reference |
| `public/mission-carousel/*.jpg` | `legacy/project-kasena-web/public/mission-carousel/` | photography | 6 | web | reference |
| `public/icons.svg`, `public/social/*` | `legacy/project-kasena-web/public/` | misc SVG | — | web | reference |

> These were intentionally **not** bulk-duplicated into the new apps (≈120 files).
> Copy only what each new product actually uses, from the legacy `public/`.

## Reference imagery

| Original path | New path | Type | Status | Notes |
| --- | --- | --- | --- | --- |
| `.codex-remote-attachments/**/*.jpg` (7 files) | `reference-materials/ui-references/**` | UI reference photos | historical | Prior design/attachment imagery; kept for context. |

## Fonts

| Asset | Source | Licence | Notes |
| --- | --- | --- | --- |
| Inter (variable) | `@fontsource-variable/inter` (npm) | SIL Open Font License 1.1 | Used by legacy app; new apps reference `Inter` in tokens (add the package when wiring fonts). |
| Sora (variable) | `@fontsource-variable/sora` (npm) | SIL Open Font License 1.1 | Same as above (display font). |

Fonts are npm packages, not committed files. The new starters declare the font
families in their theme tokens but do not yet bundle the packages.

## Documents preserved (not assets, but historical materials)

| Original path | New path | Status |
| --- | --- | --- |
| `READINESS-REPORT.md` | `docs/reports/READINESS-REPORT.md` | historical (title preserved) |
| `docs/*.md` (11 website docs) | `docs/project-kasena-web/*.md` | reference |

## Known gaps / follow-ups

- **Licensing:** no explicit per-asset licence is recorded. Author a licensing /
  usage statement for cultural and brand assets before any external use.
- **OG image:** export a PNG version of `og-default.svg` (carried over from the
  legacy site follow-ups).
- **Indigen World logo:** only the Project Kasena logo exists; a dedicated
  Indigen World parent-brand mark is still to be designed.
