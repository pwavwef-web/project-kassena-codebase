# TribeStudio

MVP workspace for Indigen World creators, contributors, translators,
validators, elders, cultural custodians and administrators.

## Built Routes

`/auth`, `/onboarding`, `/dashboard`, `/create`, `/content`, `/languages`,
`/reviews`, `/campaigns`, `/rewards`, `/analytics`, `/profile`, `/settings`,
`/admin`.

## Features

- Firebase Authentication Google sign-in with owner-scoped Firestore
  `users/{uid}` and `profiles/{uid}` creation/update.
- Onboarding for role, community, languages, expertise, cultural knowledge
  areas, creator interests, consent and Firestore profile setup.
- Dashboard for signed-in contributor draft/review-state summaries, recent
  Firestore activity, feature-flag notices and quick actions.
- Create workspace for dictionary word, sentence pair, proverb, story, cultural
  note, oral history, lesson, image collection, audio concept and artisan
  profile drafts saved as open Firestore contribution drafts.
- Content library with search, filters, status badges, cards and tables for the
  signed-in contributor's own Firestore records.
- Language contribution fields with duplicate warning and audio placeholder.
- Validator workspace with review queue, side-by-side content, decisions, notes,
  source/consent verification, sensitivity flag and history.
- Campaigns, rewards, analytics, profile, settings and admin surfaces.
- Typed local fixtures for secondary sample surfaces, plus a Firestore-backed
  `StudioService` for contributor reads/writes.

## Commands

```bash
npm run dev --workspace tribestudio
npm run typecheck --workspace tribestudio
npm run lint --workspace tribestudio
npm run test --workspace tribestudio
npm run build --workspace tribestudio
```

## Data and Integrations

TribeStudio uses Firebase Auth and Cloud Firestore for the MVP contributor path
when the public web config is present in `.env.local`.

Live MVP paths:

- Google sign-in.
- `users/{uid}` and `profiles/{uid}` owner reads/writes.
- `contributions` owner draft creates and owner contribution reads.

Feature-flagged off:

- Payments, payouts and redemptions.
- AI/model calls and AI-training export workflows.
- Blaze-dependent services such as Cloud Functions-backed user flows, Storage
  uploads and scheduled jobs.
