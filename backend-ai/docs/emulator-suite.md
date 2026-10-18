# Emulator Suite

Run Firebase locally without touching live resources.

## Start

From the repository root:

```bash
npx -y firebase-tools@latest emulators:start
```

## Parser smoke checks

```bash
npx -y firebase-tools@latest emulators:exec --only firestore backend-ai/tests/emulator-smoke.cmd
npx -y firebase-tools@latest emulators:exec --only storage backend-ai/tests/emulator-smoke.cmd
```

## Ports

| Emulator | Port |
| --- | --- |
| Authentication | 9099 |
| Functions | 5001 |
| Firestore | 8080 |
| Storage | 9199 |
| Hosting | 5000 |
| Emulator UI | enabled by Firebase CLI |

## Notes

- Functions must be built before local function testing.
- The current web, studio and mobile apps use local seeded data by default.
- Do not run deploy commands as part of MVP validation.
