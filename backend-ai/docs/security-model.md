# Security model

The current rules are prototype Security Rules for a local MVP. They are
designed around default deny, ownership checks, role gates, strict schemas and
content-tier restrictions. They still need full emulator unit tests and owner
review before production.

## Access model

| Area | Rule |
| --- | --- |
| Public writes | Denied. |
| User documents | Owner/admin read; owner can only create `user` role; role/status protected. |
| Profiles | Owner/admin only. |
| Contributor submissions | Contributor can create own draft/submission records. |
| Validator reviews | Validator/community manager/admin roles can review. |
| Consent records | Owner can create own consent; custodian/admin can update. |
| Cultural permissions | Cultural authority/admin only. |
| Audit logs | Admin read; validator/admin create; no updates/deletes. |
| Sensitive media | Elder, cultural custodian, community manager or administrator only. |

## Firestore rules validation

Local parser checks run:

```bash
npx -y firebase-tools@latest emulators:exec --only firestore backend-ai/tests/emulator-smoke.cmd
```

The smoke check validates emulator startup and rules loading. It does not replace
unit tests with representative authenticated requests.

## Storage rules validation

Local parser checks run:

```bash
npx -y firebase-tools@latest emulators:exec --only storage backend-ai/tests/emulator-smoke.cmd
```

## Known hardening work

- Move privileged authorization from Firestore role documents to custom claims
  or admin-only functions before production.
- Add `@firebase/rules-unit-testing` cases for every collection and tier.
- Add App Check before production clients are broadly shared.
- Add rate limiting and abuse monitoring for Functions.
- Review cultural data policies with community representatives and legal
  advisors.

I've set up prototype Security Rules to keep the data in Firestore safe. They
are designed to be secure for the MVP because they default-deny unknown paths,
block unauthenticated access, protect roles from self-assignment, validate
schemas on create and update, and gate restricted/sensitive cultural records by
role. However, you should review and verify them before broadly sharing your
app. If you'd like, I can help you harden these rules.
