# Indigen World

Indigen World is a cultural-technology ecosystem for preserving Indigenous
languages and heritage in the AI age. Project Kasena remains the flagship
Kasem-language programme inside the wider Indigen World platform, and
TribeStudio is the creator, contributor, validator, elder and administrator
workspace.

## Workspaces

| Workspace | Product | Status |
| --- | --- | --- |
| [`indigen-world-web/`](indigen-world-web) | Indigen World public website | MVP routes, local content fixtures, SEO, sitemap, forms and legal placeholders. |
| [`tribestudio/`](tribestudio) | TribeStudio workspace | Firebase Auth Google sign-in, Firestore contributor profiles/drafts, plus MVP dashboard, creation, content, reviews, campaigns, rewards, analytics and admin. |
| [`indigen-world-mobile/`](indigen-world-mobile) | Indigen World mobile app | Flutter Material 3 MVP with five-tab navigation and local seeded data. |
| [`backend-ai/`](backend-ai) | Firebase and AI scaffolding | Prototype rules, mock Functions, schemas and provider-independent AI interfaces. |

Supporting directories: `assets/`, `docs/`, `legacy/` and
`reference-materials/`.

## Install

```bash
npm install
cd backend-ai/firebase/functions && npm install
cd ../../..
cd indigen-world-mobile && flutter pub get
```

## Run

Web:

```bash
npm run dev:web
npm run dev:studio
```

Mobile:

```bash
cd indigen-world-mobile
flutter run
```

Firebase emulators:

```bash
npx -y firebase-tools@latest emulators:start
```

## Test and Build

```bash
npm run typecheck
npm run lint
npm run test
npm run build:web
npm run build:studio

cd indigen-world-mobile
dart format lib test
flutter analyze
flutter test

cd ../backend-ai/firebase/functions
npm run build
npm run lint
```

Rules parser smoke checks from the repo root:

```bash
npx -y firebase-tools@latest emulators:exec --only firestore backend-ai/tests/emulator-smoke.cmd
npx -y firebase-tools@latest emulators:exec --only storage backend-ai/tests/emulator-smoke.cmd
```

## MVP Notes

- TribeStudio's core contributor path uses Firebase Auth and Firestore for
  Google sign-in, owner profile sync and owner contribution drafts.
- Secondary sample surfaces still use local seeded data while their production
  permissions and governance flows are finalized.
- Donation/support UI is a placeholder and processes no payments.
- Firebase client wiring is active only for Spark-safe TribeStudio MVP paths.
- AI provider code defaults to mock and makes no external model calls.
- Legal and cultural-data pages are drafts pending owner, community and legal
  review.
- Prototype Security Rules should be hardened with emulator unit tests before
  launch.

## Documentation

- [`architecture.md`](architecture.md)
- [`brand-migration.md`](brand-migration.md)
- [`asset-manifest.md`](asset-manifest.md)
- [`backend-ai/docs/firebase-setup.md`](backend-ai/docs/firebase-setup.md)
- [`backend-ai/docs/firebase-data-model.md`](backend-ai/docs/firebase-data-model.md)
- [`backend-ai/docs/ai-roadmap.md`](backend-ai/docs/ai-roadmap.md)
- [`backend-ai/docs/security-model.md`](backend-ai/docs/security-model.md)

## Production Owner Actions

1. Review and harden Firestore/Storage rules with emulator unit tests.
2. Decide Firebase project/site target mappings before deploy.
3. Configure App Check, Auth providers and custom-claims role management.
4. Provide production Firebase config only after approval.
5. Keep secrets in Functions config or Secret Manager, never in client apps.
6. Approve cultural-data governance and legal drafts.
7. Approve any real payment or AI provider integration before enabling it.
