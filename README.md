# Indigen World

**Indigen World** is a cultural-technology ecosystem for preserving Indigenous
languages and heritage in the AI age. This repository is a monorepo containing
three products and one shared backend/AI workspace.

**Project Kasena** — the flagship **Kasem** language, data, translation and
AI-readiness programme — lives on inside Indigen World. See
[`brand-migration.md`](brand-migration.md) for how the two names relate (and the
rule: *don't blindly rename Project Kasena*).

> **Repository status:** post-migration. The four workspaces are clean,
> compile-ready **starter shells** — the full product features are **not** built
> yet. The previous, fully-featured app is preserved at
> [`legacy/project-kasena-web/`](legacy/project-kasena-web). The next agent
> (**Codex**) builds the MVPs from here — see [Handoff to Codex](#handoff-to-codex).

## Ecosystem

| Workspace | Product | What it is |
| --- | --- | --- |
| [`indigen-world-web/`](indigen-world-web) | **Indigen World Web** | Public marketing website (React + TS + Vite + Tailwind). |
| [`tribestudio/`](tribestudio) | **TribeStudio** | Workspace for creators, contributors, translators, validators, elders and admins (React + TS + Vite + Tailwind). |
| [`indigen-world-mobile/`](indigen-world-mobile) | **Indigen World Mobile** | Consumer mobile app (Flutter, Material 3). |
| [`backend-ai/`](backend-ai) | **Backend & AI** | Shared Firebase config/functions + the (design-only) AI workspace. |

Supporting: [`legacy/`](legacy) (preserved prior app), [`docs/`](docs),
[`assets/`](assets), [`reference-materials/`](reference-materials).

Full picture: [`architecture.md`](architecture.md).

## Prerequisites

- Node.js ≥ 20 (developed on 24) and npm ≥ 10 (developed on 11)
- Flutter (stable) for the mobile app
- Firebase CLI for backend/emulator work

## Install

```bash
npm install        # installs both web workspaces (indigen-world-web + tribestudio)
```

The mobile app and functions have their own dependencies:

```bash
cd indigen-world-mobile && flutter pub get
cd backend-ai/firebase/functions && npm install
```

## Start a starter app

```bash
npm run dev:web        # Indigen World website  -> http://localhost:5173
npm run dev:studio     # TribeStudio workspace  -> http://localhost:5174
```

Mobile:

```bash
cd indigen-world-mobile
flutter create . --platforms=android,ios   # first time only: generate native folders
flutter run
```

## Root commands

| Command | Does |
| --- | --- |
| `npm run dev:web` / `npm run dev:studio` | Run a web app in dev. |
| `npm run build:web` / `npm run build:studio` | Production build. |
| `npm run test:web` / `npm run test:studio` / `npm run test` | Vitest. |
| `npm run lint` | ESLint across web workspaces. |
| `npm run typecheck` | `tsc --noEmit` across web workspaces. |

Flutter (run inside `indigen-world-mobile/`):

```bash
flutter pub get
flutter analyze
flutter test
flutter run
```

## Run tests

```bash
npm run test                       # web + studio (Vitest)
cd indigen-world-mobile && flutter test
```

## Firebase status

- Project id: `project-kassena-7e026` (`.firebaserc`).
- Root [`firebase.json`](firebase.json): two hosting targets (`web`, `studio`),
  rules/indexes/functions pointing at `backend-ai/firebase/`, and Emulator Suite
  ports.
- **Nothing was deployed.** Hosting targets still need mapping before first
  deploy. See [`migration-report.md`](migration-report.md) §8 and
  [`backend-ai/firebase/README.md`](backend-ai/firebase/README.md).
- Local-only: `firebase emulators:start` (from repo root).

## Current limitations

- Web/studio are **starter shells** (shell + 1 page + 1 test each), not the real
  products.
- Mobile `android/`/`ios/` are placeholders until `flutter create` is run.
- `backend-ai/ai/` is **design-only** — no model, provider, or credentials.
- No Indigen World parent-brand logo yet; OG PNG pending.

## Reference docs

- [`architecture.md`](architecture.md) — system architecture
- [`brand-migration.md`](brand-migration.md) — naming rules
- [`asset-manifest.md`](asset-manifest.md) — asset inventory
- [`migration-report.md`](migration-report.md) — what changed + validation
- [`docs/project-kasena-web/`](docs/project-kasena-web) — preserved legacy site docs
- [`docs/reports/READINESS-REPORT.md`](docs/reports/READINESS-REPORT.md) — historical report

---

## Handoff to Codex

### ✅ Completed migration work
- Four-workspace monorepo created: `indigen-world-web`, `tribestudio`,
  `indigen-world-mobile`, `backend-ai`.
- Clean, compile-ready starters for all four. **Validated** (real runs): install,
  typecheck, lint, tests, and production builds pass for both web apps; Flutter
  `pub get` / `analyze` / `test` pass for mobile. See
  [`migration-report.md`](migration-report.md) §6.
- npm workspaces + root scripts wired (`dev/build/test/lint/typecheck`).
- Firebase config consolidated under `backend-ai/firebase/` and rewired in root
  `firebase.json` (two hosting targets + emulator config).
- Documentation set authored (this README + the four root docs).
- Safety tag `pre-indigen-world-monorepo-migration` created; history preserved
  via `git mv`.

### 📦 Preserved assets & code (mine these, don't rebuild blind)
- `legacy/project-kasena-web/` — the **entire** prior app, runnable. Reuse:
  - `src/marketing/` → real `indigen-world-web` pages, layout, motion, visuals.
  - `src/pages/`, `src/pages/admin/`, `src/components/admin/` → `tribestudio`.
  - `src/lib`, `src/hooks`, `src/contexts`, `src/config/firebase.ts` → backend
    integration, auth, ranks, achievements.
  - `src/content/` → honest, typed marketing copy.
- `backend-ai/firebase/functions/` — working Paystack + email functions.
- `backend-ai/schemas/firestore-collections.md` — data contracts.
- `assets/`, `legacy/.../public/` — brand + ~125 app image assets.
- `docs/project-kasena-web/` — design system, content model, SEO, a11y, IA, etc.

### 🚧 Unfinished implementation work (your job)
1. **indigen-world-web** — build the real public site from `src/marketing/` +
   `docs/project-kasena-web/` (honest-content rules apply — see below).
2. **tribestudio** — build contribution/review/translation/validation/admin
   surfaces from the legacy app; wire auth + role guards.
3. **indigen-world-mobile** — run `flutter create` for native folders, then build
   the consumer experience; add Firebase via `flutterfire configure`.
4. **backend-ai/ai** — design then implement translation/speech/embeddings/
   moderation/evaluation behind a provider interface (no model is connected).
5. Tests beyond the smoke/widget tests; backend rules + functions tests.

### ⚙️ Technical constraints & decisions — do not reverse without approval
- **Starters are intentionally minimal.** The legacy app was archived, not
  promoted, so the new products start clean. Don't "restore" the monolith.
- **Brand:** Indigen World is the parent; Project Kasena is the Kasem programme.
  **Do not blindly rename "Project Kasena"** or "Kassena" identifiers (Firebase
  id `project-kassena-7e026`, the readiness report). See
  [`brand-migration.md`](brand-migration.md).
- **Honest content rule (carried from the legacy site):** never invent partners,
  funding, stats, team, testimonials, or endorsements; future AI is
  `research`/`planned`, never "operational"; legal pages are drafts pending
  review.
- **No secrets in client apps or git.** Firebase web config is public and fine;
  secret keys go in Functions config / Secret Manager. `.env.local` files are
  git-ignored.
- **Firebase:** no deploy, no App Check changes, no auth-provider changes, no
  live AI calls were made — keep it that way until explicitly approved.
- **Web stack pinning:** React 19 / Vite 7 / Vitest 3 / TS 5.7 / Tailwind 3 are a
  validated, conflict-free set. Bump deliberately.

### 📁 Important paths
- Root scripts & workspaces: [`package.json`](package.json)
- Firebase: [`firebase.json`](firebase.json), [`.firebaserc`](.firebaserc),
  [`backend-ai/firebase/`](backend-ai/firebase)
- Web entry: `indigen-world-web/src/main.tsx` → `src/app/router.tsx`
- Studio entry: `tribestudio/src/main.tsx` → `src/app/router.tsx`
- Mobile entry: `indigen-world-mobile/lib/main.dart` → `lib/app/app.dart`

### 🛠️ Build commands
`npm install` · `npm run dev:web` · `npm run dev:studio` ·
`npm run build:web` · `npm run build:studio` · `npm run test` ·
`npm run lint` · `npm run typecheck` · (mobile) `flutter pub get|analyze|test|run`

### 🐞 Known issues
See [`migration-report.md`](migration-report.md) §7 — mobile native folders are
placeholders, hosting targets need mapping, no parent-brand logo yet, asset
licensing undocumented, 1 low-severity npm advisory.
