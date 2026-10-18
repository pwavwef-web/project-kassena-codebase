# Firebase data model

The canonical collection list lives in
[`../schemas/firestore-collections.md`](../schemas/firestore-collections.md).
This page summarizes implementation expectations for Firebase.

## Core rules

- No unauthenticated Firestore access in the prototype.
- No public writes.
- User-owned private profile documents remain owner/admin only.
- Privileged roles are not user-writable.
- Cultural records carry content tier, consent, licence, permitted use,
  AI-training permission and commercial-use permission fields.
- Restricted and sensitive content is never treated as open public data.
- Audit logs are append-only from privileged roles.

## Cultural record families

The following collections use the shared cultural metadata shape:

- `lexicalEntries`
- `sentencePairs`
- `stories`
- `proverbs`
- `culturalNotes`
- `mediaAssets`
- `contributions`

Each record must include language, dialect, community, source, contributor,
validator, validation status, content tier, consent status, licence, permitted
uses, AI-training permission, commercial-use permission, attribution, review
history and timestamps.

## Governance collections

- `reviews`: validator decisions, notes, rejection reasons and verification
  flags.
- `consentRecords`: owner/custodian/admin consent state.
- `culturalPermissions`: community-level permission decisions.
- `reports`: moderation and takedown reports.
- `auditLogs`: structured audit events.
- `featureFlags`: local mirror of Remote Config defaults.

## Demo data rule

Seed data must use labels such as `Demo Contributor`, `Sample Validator`,
`Example Community`, `Placeholder Story` and `Unverified Demo Data`. Do not add
real chiefs, elders, institutions, partnerships or endorsements without owner
approval and documentation.
