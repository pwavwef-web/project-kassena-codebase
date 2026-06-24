# Emulator Suite

Run Firebase locally without touching live resources.

## Start

From the **repo root**:

```bash
firebase emulators:start
```

## Ports (root `firebase.json` → `emulators`)

| Emulator | Port |
| --- | --- |
| Authentication | 9099 |
| Functions | 5001 |
| Firestore | 8080 |
| Storage | 9199 |
| Hosting | 5000 |
| Emulator UI | (enabled) |

## Notes

- Point web/studio apps at the emulators in local dev (connect helpers are added
  during the real build).
- Functions must be built first (`cd backend-ai/firebase/functions && npm run build`).
- The emulator is the **only** Firebase interaction the migration endorses —
  never run `firebase deploy` as part of the migration.
