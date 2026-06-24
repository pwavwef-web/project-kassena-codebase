# Authentication architecture

> Preserved from the existing system. **No auth provider was changed during the
> migration.**

## Current model

- **Provider:** Google sign-in (Firebase Authentication).
- **Roles:** stored on `users/{uid}.role` (`visitor` / `contributor` /
  `validator` / `admin`).
- **Enforcement:** Firestore security rules block users from changing their own
  `role` or `status`. The web/admin clients read the role for UI gating.

## Making the first admin (existing procedure)

1. Sign in once with Google.
2. In Firestore, open your `users/{uid}` document.
3. Set `role` to `admin`.
4. Manage further users from the workspace admin tools.

## Production hardening (TODO — owner/Codex)

- Move trusted role assignment / privilege elevation to **custom claims** set by
  an **admin-only Cloud Function**, rather than a Firestore field.
- Add **App Check** (owner action; not enabled by the migration).
- Consider re-auth for sensitive actions.
