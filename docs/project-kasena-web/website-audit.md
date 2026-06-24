# Project Kasena — Website Audit (Phase 1)

_Date: 2026-06-20 · Branch checkpoint: `backup/pre-redesign-2026-06-20`_

## 1. Stack & architecture (as found)

| Area | Finding |
|---|---|
| Framework | React 19 + TypeScript ~6, built with **Vite 8** |
| Routing | `react-router-dom` v7 `createBrowserRouter` (single SPA) |
| Styling | **Tailwind CSS 3.4** (+ a hand-written splash screen in `globals.css`) |
| Animation | **Framer Motion 12** present (lightly used) |
| Backend | **Firebase 12** — Auth (Google), Firestore, Storage, Cloud Functions, Analytics |
| Payments | **Paystack** (GHS) via public env key + `verifyPaystackDonation` callable |
| PWA | `vite-plugin-pwa` (Workbox, autoUpdate) |
| Package name | `tribestudio` — UI branded **“TribeStudio”** despite the project being **Project Kasena** |

## 2. Baseline health

- `tsc -b` (typecheck): **passes, exit 0** (clean).
- Working tree: **clean** at audit time.
- Production build: **succeeds**.
- No hardcoded secrets found — all Firebase/Paystack config via `VITE_*` env vars. ✅

## 3. Routes (as found)

Public-ish (under `MainLayout`): `/` (app home), `/login`, `/dictionary`,
`/culture` (approved-uploads gallery), `/support`, `/support/donate`,
`/support/success`.
Protected: `/dashboard`, `/complete-profile`, `/contributions`, `/leaderboard`,
`/announcements`, `/achievements`, `/rewards`, `/submit`, `/uploads`, `/profile`.
Admin/validator: `/admin` + `submissions`, `uploads`, `users`, `dictionary`,
`donations`, `announcements`, `settings`.

The public marketing content and the application were **intermingled** under one
layout — the core problem this redesign addresses.

## 4. Firestore data model (relevant to the public site)

Public-readable: `dictionaryEntries` (published), `publicStats/overview`,
`campaignMetrics/overview`, `publicSupporters`, approved `uploads`.
Public-create (validated rules): `donations`, `sponsors`.
Rich domain types already exist in `src/types/index.ts` (`Donation`,
`CampaignMetrics`, `PublicSupporter`, `SponsorLead`, `DictionaryEntry`, …).

## 5. Assets present

`assets/project-kasena-logo.png` (2.3 MB — too heavy for web; replaced by an SVG
logo in the marketing shell), favicons, achievement/rank PNGs, mission-carousel
JPGs, PNG UI icon set.

## 6. Cloud Functions

`verifyPaystackDonation`, `sendWelcomeEmail`, `sendDonationThankYouEmail`
(+ email templates). **All preserved unchanged.**

## 7. Issues / risks identified

1. **Brand mismatch** — “TribeStudio” throughout vs. “Project Kasena”. → Rebranded public surfaces, manifest, title.
2. **No premium display font / type system** — only system Inter. → Added self-hosted Sora + Inter variable fonts (subsetted, privacy-friendly).
3. **Single large JS bundle** (~1.4 MB / 405 KB gzip, no route splitting). → Tracked for code-splitting (see QA report / known limitations).
4. **Marketing & app share one shell** → New `MarketingLayout` added; app `MainLayout` untouched.
5. **No SEO system, sitemap, robots, or per-page metadata** → Added `Seo` component, sitemap & robots (deployment phase).
6. **No content architecture** — copy would live in JSX → Added typed `src/content/*` modules.

## 8. Decisions taken

- **Non-breaking routing**: `/` becomes the marketing home; **every existing app
  route is preserved unchanged** under `MainLayout`. “Launch app” → `/dictionary`.
- **Preserve all working features**: auth, Firestore, donations/Paystack, email,
  admin — untouched.
- **Rebrand public surfaces** to Project Kasena; app internals left functional.
- **New `/heritage`** route for the editorial Culture & Heritage page so the
  existing `/culture` app gallery keeps working.
