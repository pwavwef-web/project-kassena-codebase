# Firebase

Firebase configuration for the Indigen World MVP. Paths are referenced by the
repo-root [`firebase.json`](../../firebase.json).

## Contents

| Path | Purpose |
| --- | --- |
| `functions/` | Cloud Functions v2 safe mock callables for profile, contribution, review, reward, publication, takedown, export, notification, audit and AI gateway scaffolds. |
| `firestore.rules` | Prototype Firestore Security Rules. |
| `firestore.indexes.json` | MVP query index scaffolding. |
| `storage.rules` | Prototype Storage Security Rules for tiered media. |

## Functions

```bash
cd backend-ai/firebase/functions
npm install
npm run build
npm run lint
```

Legacy Paystack/email Functions from the pre-migration app are preserved under
`functions/legacy-production/` for reference. They are outside the deployable
`functions/src/` tree and are not exported by the MVP.

## Emulator Suite

From the repository root:

```bash
npx -y firebase-tools@latest emulators:start
```

Parser smoke checks:

```bash
npx -y firebase-tools@latest emulators:exec --only firestore backend-ai/tests/emulator-smoke.cmd
npx -y firebase-tools@latest emulators:exec --only storage backend-ai/tests/emulator-smoke.cmd
```

## Deployment

No deployment was performed. Before any production deploy, owners must review
rules, create hosting target mappings, configure secrets, decide App Check, and
replace role-document authorization with a hardened custom-claims flow.
