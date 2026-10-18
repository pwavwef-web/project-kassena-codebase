# Backend & AI architecture

The shared backend serves three Indigen World products:

- `indigen-world-web`
- `tribestudio`
- `indigen-world-mobile`

The MVP is local-first. Clients use seeded data and local service abstractions.
Firebase is prepared, but production Firebase services are not wired to the
clients by this implementation.

## Firebase services

| Service | MVP status |
| --- | --- |
| Authentication | UI, roles and docs prepared; no production provider changes. |
| Firestore | Data model, indexes and prototype rules prepared. |
| Storage | Tiered cultural media rules prepared. |
| Functions v2 | Safe callable mock scaffolds compile. |
| Hosting | `web` and `studio` hosting targets declared in root `firebase.json`. |
| Remote Config | Flag defaults documented; no live template updated. |
| App Check | Documented owner action before production. |
| Analytics | Event taxonomy drafted; no SDK wiring. |
| Emulator Suite | Local validation path configured. |

## Function boundary

All exported MVP functions validate input and return mock responses. They do not
write to production Firestore, send email, process payments or call AI providers.

## AI boundary

AI code lives under `backend-ai/ai`. The factory defaults to `MockAiProvider`.
Vertex AI and local providers are placeholders that throw typed errors instead
of making live calls.

## Production hardening path

1. Replace Firestore role reads with custom claims or admin-only role functions.
2. Add emulator unit tests for each rule path.
3. Configure App Check.
4. Decide Remote Config rollout flags.
5. Add real Firebase client configuration only after owner approval.
6. Add AI providers only after consent and governance requirements are satisfied.
