# Backend tests

Placeholder. No backend tests exist yet.

Intended coverage when implemented:

- **Security rules tests** via `@firebase/rules-unit-testing` against the
  Firestore + Storage emulators.
- **Cloud Functions** unit tests via `firebase-functions-test` (already a
  devDependency in `../firebase/functions`).
- **AI evaluation** harnesses live under `../ai/evaluation`.

Run rules/function tests against the Emulator Suite — never against production.
