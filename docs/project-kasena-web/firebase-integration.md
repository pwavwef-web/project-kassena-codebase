# Project Kasena — Firebase Integration

The redesign **preserves** the existing Firebase setup. No secrets are hardcoded;
all config comes from `VITE_*` env vars (`src/config/firebase.ts`).

## What was preserved (unchanged)

- Auth (Google provider), Firestore, Storage, Cloud Functions, Analytics.
- Hosting config (`dist`, SPA rewrite to `/index.html`).
- Paystack donation flow (`src/services/paystack.ts` + `verifyPaystackDonation`).
- Email functions (`sendWelcomeEmail`, `sendDonationThankYouEmail`).
- All Firestore security rules for existing collections.

## What the marketing site reads (public, read-allowed)

| Collection | Used by | Rule |
|---|---|---|
| `publicStats/overview` | `usePublicStats` (impact/transparency) | public read |
| `campaignMetrics/overview` | `usePublicStats` | public read |
| `dictionaryEntries` (published) | app dictionary (Launch app) | read if published |
| `publicSupporters` | support page | public read |

These reads **fail gracefully**: `usePublicStats` returns `unavailable: true` on
error/missing config, and the UI shows clearly-labelled targets instead of
fabricated numbers.

## What the marketing site writes (new — create-only)

Two new collections back the public forms (`src/marketing/lib/forms.ts`):

| Collection | Source | Rule (in `firestore.rules`) |
|---|---|---|
| `newsletterSubscribers` | `NewsletterForm`, footer | `create` if `validNewsletterCreate()`; read/update admin only |
| `contactMessages` | Contact + Partner forms | `create` if `validContactCreate()`; read/update admin only |

Both rules validate field shape, types and sizes, require `createdAt == request.time`,
and **block public reads** (no exposure of submitted contact details).

> ⚠️ Deploy the rules before these forms will work in production:
> `npm run firebase:deploy:rules`

## Analytics

`src/marketing/lib/analytics.ts` wraps the existing lazy `getFirebaseAnalytics()`.
`track(event, params)` is fire-and-forget and **never throws** — analytics can
never break the site. Event names are centralised in `events`.

## Environment variables

See `.env.example`. Required: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
`VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
`VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`,
`VITE_FIREBASE_MEASUREMENT_ID`, `VITE_PAYSTACK_PUBLIC_KEY`. Never commit real
values; the Paystack **secret** key stays server-side (Cloud Functions) only.
