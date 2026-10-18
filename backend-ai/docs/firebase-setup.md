# Firebase setup

Firebase remains the selected backend platform, but this MVP does not wire any
client to production Firebase and does not deploy anything.

## Prepared services

| Service | MVP status |
| --- | --- |
| Firebase Authentication | UI and role model prepared; no provider changes made. |
| Firestore | Schemas, prototype rules and indexes prepared under `backend-ai/firebase/`. |
| Cloud Storage | Prototype rules prepared for tiered cultural media paths. |
| Cloud Functions v2 | Safe mock callable scaffolds compile in `backend-ai/firebase/functions`. |
| Firebase Hosting | Root `firebase.json` has `web` and `studio` hosting targets. |
| Remote Config | Intended feature flags documented; no live template updated. |
| App Check | Documented as an owner action before production. |
| Analytics | Taxonomy below; no analytics SDK wiring in this MVP. |
| Emulator Suite | Local-only validation path configured in root `firebase.json`. |

## Local commands

From the repository root:

```bash
npm install
npm run build:web
npm run build:studio
npx -y firebase-tools@latest emulators:start
```

Functions:

```bash
cd backend-ai/firebase/functions
npm install
npm run build
```

Rules parser smoke checks:

```bash
npx -y firebase-tools@latest emulators:exec --only firestore backend-ai/tests/emulator-smoke.cmd
npx -y firebase-tools@latest emulators:exec --only storage backend-ai/tests/emulator-smoke.cmd
```

## Environment variables and secrets

Client apps may use public Firebase web config later, but no secret belongs in a
client app or committed file.

Future production secrets belong in Functions config or a secret manager:

- payment provider secret keys;
- SMTP/API credentials;
- future AI provider credentials;
- service account credentials.

## Remote Config flag draft

Default every AI or payment-adjacent feature to off:

| Key | Default | Purpose |
| --- | --- | --- |
| `ai_gateway_enabled` | `false` | Kill-switch for AI gateway surfaces. |
| `dataset_export_enabled` | `false` | Enables approved export jobs. |
| `mobile_offline_sync_enabled` | `false` | Future sync from local drafts. |
| `support_payments_enabled` | `false` | Future donation/payment UI. |
| `sensitive_content_reviews_enabled` | `true` | Keeps review warnings visible. |

## Analytics taxonomy draft

Do not track sacred, private or sensitive content text. Event names should use
metadata only:

- `language_search_performed`
- `dictionary_entry_saved`
- `contribution_draft_saved`
- `review_decision_previewed`
- `campaign_card_viewed`
- `consent_acknowledgement_checked`
- `takedown_request_started`
- `ai_gateway_mock_invoked`

## App Check

App Check is intentionally not enabled by this implementation. Before launch,
owners should configure App Check for web, Android, iOS and Functions, then test
emulators and preview channels before enforcing it.
