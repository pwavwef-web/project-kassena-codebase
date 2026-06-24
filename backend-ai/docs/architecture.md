# Backend & AI architecture

How the shared backend serves the three Indigen World products.

## Overview

```
indigen-world-web ─┐
tribestudio ───────┼──> Firebase (Auth, Firestore, Storage, Functions) ──> [future] AI services
indigen-world-mobile ┘
```

All three clients talk to the **same Firebase project** (`project-kassena-7e026`).
AI services are a future layer behind the backend, never called directly from
clients with secrets.

## Firebase services

| Service | Role | Status |
| --- | --- | --- |
| Authentication | Google sign-in (existing), role via `users/{uid}.role` | preserved |
| Firestore | Primary datastore (see `../schemas`) | preserved (rules + indexes) |
| Storage | Audio/image uploads | preserved (rules) |
| Cloud Functions | Donations (Paystack) + transactional email | preserved (`../firebase/functions`) |
| Remote Config | Feature flags / kill-switches | see `remote-config.md` (not yet used) |
| Emulator Suite | Local dev | configured in root `firebase.json` |
| App Check | Abuse protection | **not enabled** (owner action, post-migration) |

## AI layer (future)

Implemented under `../ai` behind a provider interface. Translation, speech,
embeddings, moderation and evaluation are separate modules so each can be built,
evaluated and deployed independently. No model is connected in this migration.

## Authentication & roles

See [`authentication.md`](authentication.md). Frontend role checks read
`users/{uid}.role`; rules block self-elevation. Production should move trusted
role assignment to custom claims / admin-only callable functions.

## Non-goals for the migration

- No deploy, no live-resource change.
- No production App Check, no auth-provider changes.
- No real AI/Vertex calls, no model wiring, no real credentials.
