# Firestore rules analysis

Generated during the MVP scaffold pass before updating
`backend-ai/firebase/firestore.rules`.

## Codebase findings

- The new web and mobile clients use local seeded data only.
- TribeStudio uses typed local fixtures and service interfaces only.
- No client performs production Firestore queries in this implementation.
- The backend exposes safe mock Functions callables. They return mock responses
  and do not write to Firestore.
- Required future query shapes are represented by `firestore.indexes.json`:
  cultural record review queues, approved open content, notifications,
  campaigns, reward leaderboards and audit logs.

## Attack audit

| Attack | Result |
| --- | --- |
| Public list exploit | Denied by default. No unauthenticated read rules exist. |
| Public write exploit | Denied by default. All creates require auth and role/ownership checks. |
| Self-assigned admin role | Denied. User create forces `role == 'user'`; owner update must preserve role/status. |
| Update bypass on cultural records | Mitigated by `validCulturalRecord()` on create and update plus immutable `contributorId` and `createdAt`. |
| Ownership hijacking | Mitigated by owner checks and immutable contributor fields. |
| Schema pollution | Mitigated by `keys().hasOnly()` validators. |
| Resource exhaustion | Mitigated by string/list/map size checks on prototype validators and Storage 20 MB file cap. |
| Consent record tampering | Owner can create own record; only cultural authority/admin can update; deletes denied. |
| Audit-log tampering | Admin read; validator/admin create; updates/deletes denied. |
| Sensitive media read | Sensitive Storage paths require elder/custodian/community manager/admin. |

## Remaining review notes

- These are prototype Security Rules. They need emulator unit tests with
  representative auth tokens before production use.
- Custom claims should replace Firestore role reads for privileged production
  authorization.
- Query-specific rule tests should be added when real client Firestore queries
  are implemented.
