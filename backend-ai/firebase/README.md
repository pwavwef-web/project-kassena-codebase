# Firebase

Firebase configuration preserved from the prior Project Kasena / TribeStudio
system. Paths are referenced by the repo-root [`firebase.json`](../../firebase.json).

## Contents

| Path | Purpose |
| --- | --- |
| `functions/` | Cloud Functions (TypeScript): Paystack donation verification, welcome + thank-you email |
| `firestore.rules` | Firestore security rules |
| `firestore.indexes.json` | Composite indexes (leaderboard queries) |
| `storage.rules` | Storage security rules |

## Functions

```bash
cd backend-ai/firebase/functions
npm install
npm run build      # tsc -> lib/
npm run lint
```

Functions still target the existing collections and were authored for the
current Firebase project. Review before reusing in new flows.

## Emulator Suite (local, safe)

From the **repo root** (uses root `firebase.json`):

```bash
firebase emulators:start
```

Ports are declared under `emulators` in the root `firebase.json`
(auth 9099, functions 5001, firestore 8080, storage 9199, hosting 5000, UI on).

## Deployment — owner action, NOT done by the migration

- No deploy was performed. No live resource was changed.
- Hosting uses **targets** (`web`, `studio`). Before first deploy the owner must
  create the Hosting sites and map them:

  ```bash
  firebase target:apply hosting web   <web-site-id>
  firebase target:apply hosting studio <studio-site-id>
  npm run build:web && npm run build:studio   # from repo root
  firebase deploy --only hosting
  ```

- Do **not** enable production App Check or change auth providers as part of the
  migration. See [`../docs/authentication.md`](../docs/authentication.md).
