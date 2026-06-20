# Project Kasena — QA Report

_Date: 2026-06-20_

## Automated gates

| Gate | Command | Result |
|---|---|---|
| TypeScript | `tsc -b` | ✅ Pass (exit 0) |
| Lint (errors) | `eslint . --quiet` | ✅ 0 errors |
| Lint (warnings) | `eslint .` | ⚠️ 2 warnings (pre-existing, see below) |
| Production build | `vite build` | ✅ Pass (exit 0) |
| Runtime smoke | dev server + DOM/console inspection | ✅ Home + Partners render, **no console errors** |

### Lint warnings (non-blocking, pre-existing)
Two "unused eslint-disable directive (max-len)" warnings in `functions/src/templates/*`
— pre-existing, in Cloud Functions email templates untouched by this redesign.
The lint gate passes (warnings don't fail `eslint`).

### Pre-existing lint debt addressed
The repo uses `eslint-plugin-react-hooks@7`, whose new `set-state-in-effect`
rule flagged correct, pre-existing guard/sync patterns in 4 app files
(`FavoritesTab`, `RecentlyViewedTab`, `useKasemInput`, `KasemKeyboard`). These
predate the redesign. To keep `npm run lint` green without risking app
behaviour, each got a single justified `eslint-disable-next-line` with a comment.
All redesign code was written to satisfy the rule properly (no suppressions).

## Build / performance

- **Route-level code splitting** implemented (React.lazy + Suspense in both shells).
  The single 1.66 MB bundle became a small vendor chunk + per-route chunks.
- Marketing **home route** now loads: vendor chunk + `HomePage` (≈7 KB gzip) + CSS
  (≈23 KB gzip) + on-demand font subsets. App-only heavy code (Dictionary ≈ 217 KB
  raw, Profile, Admin) no longer loads for marketing visitors.
- Fonts self-hosted (Sora + Inter variable), `wght` axis only, per-subset woff2
  via `unicode-range` (latin-ext carries the Kasem diacritics).

### Lighthouse (to run on the deployed build)
Lighthouse was not run inside this environment. Targets and current expectations:

| Metric | Target | Expectation / note |
|---|---|---|
| Performance | ≥ 90 | Marketing pages are light; the **main blocker is the eager Firebase init** in the vendor chunk (~230 KB gzip). See "Known limitations". |
| Accessibility | ≥ 95 | Strong baseline (semantics, focus, labels, contrast, reduced-motion). |
| Best Practices | ≥ 95 | No console errors, HTTPS, `rel=noopener` on external links. |
| SEO | ≥ 95 | Per-page metadata, canonical, sitemap, robots, structured data. |

**Action:** run `npx lighthouse https://kassena.azlearner.me --view` after deploy
and record scores here.

## Manual checks performed

- ✅ App mounts; marketing `MarketingLayout` renders (header, nav, footer).
- ✅ Home renders all 13 content sections + hero `<h1>`; premium hero confirmed by screenshot.
- ✅ `/partners` renders (hero h1 cream-on-indigo, 6 sections, enquiry + newsletter forms).
- ✅ No console errors across navigation.
- ✅ Non-breaking routing: all existing app routes still declared under `MainLayout`.

## Manual checks still recommended before launch

- [ ] Keyboard-only pass of mobile drawer, contact/partner forms, donation flow.
- [ ] Screen-reader smoke test (home, contact, support).
- [ ] Real device test at 320 / 360 / 390 / 768 / 1024 / 1440.
- [ ] Submit contact + newsletter forms **after deploying Firestore rules**.
- [ ] Verify Paystack donation end-to-end + email confirmation on `/support`.
- [ ] Lighthouse run + social-preview debugger check.

## Honest-content audit (per the non-negotiable rules)

Audited all marketing content modules. **No fabrication found:**
- No invented partners/endorsements/funding/statistics/team/testimonials/press logos.
- Future AI is labelled `research`/`planned` everywhere; never "operational".
- Stats are either live (`usePublicStats`) or clearly labelled targets.
- Team groups are empty by design (auto-hidden) with an honest "building the team" state.
- Transparency document registry is empty/locked (`isPublic:false`) → graceful empty state.
- Funding "use of funds" is clearly labelled illustrative, with **no money figures**.
- Cultural records are illustrative, consent-gated (only `public` shown), with a
  Cultural Content Notice + takedown link.
- Legal pages are marked **"Draft pending legal review."**

## Known limitations / follow-ups

1. **Performance ceiling = eager Firebase.** Firebase (auth/firestore/functions/
   storage) initialises in the shared vendor chunk via `AuthProvider`. For
   Lighthouse ≥ 90 on slow mobile, defer/lazy-init Firebase for marketing routes
   (e.g. lazy `AuthProvider`, or split firebase into an async module loaded only
   when the app/auth is needed). Scoped follow-up.
2. **Support page styling.** `/support` still renders the existing app
   `SupportPage` (Paystack flow preserved, untouched). Reskinning it into the
   marketing shell is a follow-up that must keep the donation flow intact.
3. **OG image is SVG.** `public/social/og-default.svg` is the design source; export
   a 1200×630 **PNG** for full social-scraper compatibility and point `site.ogImage`
   at it.
4. **Photographic imagery** not generated (no image tooling available). Original
   SVG/CSS visuals ship now; production prompts are in `docs/image-generation-prompts.md`.
5. **Firestore rules must be deployed** for the new newsletter/contact forms
   (`npm run firebase:deploy:rules`).

## Content requiring human confirmation before launch

- Public contact email addresses (currently `*@projectkasena.org` placeholders in `site.ts`).
- Real social profile URLs (empty → not rendered until set).
- Legal documents (all drafts) → professional review.
- Project origin specifics (founders/dates intentionally omitted in `about.ts`).
- Exact public framing of the Indigen World alliance (`alliance.ts` placeholders).
- Team roster (empty until confirmed members consent to be named).
