# Firestore collections

Carried over from the existing Project Kasena / TribeStudio system. Authoritative
rules: [`../firebase/firestore.rules`](../firebase/firestore.rules). Indexes:
[`../firebase/firestore.indexes.json`](../firebase/firestore.indexes.json).

> Verify against the live rules file before relying on any field — this is a
> migrated snapshot, not a generated schema.

## Core collections

| Collection | Purpose |
| --- | --- |
| `users` | Account profile, role, status, gamification points |
| `contributions` | Submitted dictionary/language contributions awaiting review |
| `dictionaryEntries` | Approved, published dictionary entries |
| `uploads` | Uploaded media (audio/images) pending verification |
| `auditLogs` | Admin/validator action audit trail |
| `settings` | App/admin configuration |
| `announcements` | Community announcements |
| `donations` | Donation records (Paystack) |

## `users/{uid}` (ranking-relevant fields)

```ts
users/{uid}: {
  uid: string
  displayName: string
  photoURL?: string
  role: 'visitor' | 'contributor' | 'validator' | 'admin'  // server-controlled
  status: string                                            // server-controlled
  totalPoints: number
  weeklyPoints: number
  monthlyPoints: number
  approvedEntries: number
  badgeTitle: string
  lastContributionAt: Timestamp
  createdAt: Timestamp
}
```

## Indexes

Composite/descending indexes exist for leaderboard queries on `weeklyPoints`,
`monthlyPoints`, and `totalPoints`.

## Storage paths

```
contributions/{uid}/{contributionId}/{filename}
uploads/{uid}/{uploadId}/{filename}
```

## Security model (summary)

- `role` and `status` are **not** user-writable (enforced in rules).
- Direct client writes to `dictionaryEntries` are blocked (admin/validated flow).
- Uploads require auth, MIME checks, and size limits.
- **Production hardening (TODO):** move trusted role assignment to Firebase
  custom claims and/or admin-only Cloud Functions.
