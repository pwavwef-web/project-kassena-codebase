# TribeStudio Firebase MVP Firestore Findings

Date: 2026-07-06

## Codebase Surface

- `tribestudio` is a React/Vite web workspace.
- Current Firebase config placeholders live in `tribestudio/.env.example`.
- Current auth is UI-only in `tribestudio/src/pages/StudioPages.tsx`.
- Current contributor data is local-only through `tribestudio/src/services/studioService.ts` and `tribestudio/src/data/studioData.ts`.
- Firestore rules live in `backend-ai/firebase/firestore.rules`.

## Target MVP Access Pattern

- Auth:
  - Google sign-in through Firebase Authentication.
  - Observe signed-in user state in the client.
  - Sign out through Firebase Authentication.

- User profile documents:
  - `users/{uid}`: owner creates/updates own non-privileged user record.
  - `profiles/{uid}`: owner creates/updates own contributor profile settings.
  - Reads are owner-only or admin-only because `users` contains email.

- Contributor draft documents:
  - Collection: `contributions`.
  - Create: signed-in owner can create only their own MVP draft.
  - Read/query: signed-in owner reads their own contribution documents.
  - Query shape: `where("contributorId", "==", uid)`, `where("validationStatus", "in", [...])`, `orderBy("updatedAt", "desc")`, `limit(50)`.
  - Write shape: open-tier drafts only; AI training and commercial-use permissions remain `false`.

## Rule Constraints

- Do not allow users to self-assign privileged roles.
- Do not make PII-bearing `users` documents public.
- Do not allow unauthenticated reads or writes.
- Do not enable payments, AI calls, Cloud Functions, scheduled jobs, Storage uploads, or other Blaze-dependent services for this MVP path.
- Keep default-deny for unknown collections.

## Devil's Advocate Checklist

- Public list exploit: no unauthenticated reads are added.
- Unauthorized read/write: own UID is required for `users`, `profiles`, and MVP `contributions`.
- Ownership hijacking: `contributorId` must equal `request.auth.uid` on create and remains immutable on update.
- Privilege escalation: self-created `users/{uid}` must keep role `user`.
- Schema pollution: existing validators use `keys().hasOnly(...)`.
- Resource exhaustion: existing string and list validators enforce size limits.
- Blaze path exposure: no Functions, payments, Storage uploads, or AI provider calls are added to client writes.
