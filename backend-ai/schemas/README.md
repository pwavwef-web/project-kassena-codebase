# Data schemas

Canonical data contracts for the Indigen World backend. These describe the
Firestore collections used by the apps and enforced by
[`../firebase/firestore.rules`](../firebase/firestore.rules).

- [`firestore-collections.md`](firestore-collections.md) — collection shapes.

These schemas are carried over from the existing system and should be treated as
the source of truth when Codex generates typed models for each app. Keep them in
sync with the security rules and indexes.
