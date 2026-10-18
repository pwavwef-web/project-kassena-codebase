# Firestore collections

This document is the MVP data-contract reference for Indigen World. The schema is
prepared for Firebase and local emulator work only; it is not connected to a
production database by this implementation.

## Roles

Supported roles:

- `user`
- `contributor`
- `creator`
- `validator`
- `elder`
- `cultural custodian`
- `community manager`
- `administrator`
- `researcher`
- `partner`

Privileged roles must be assigned by an administrator or future custom-claims
workflow. Users must not be able to grant themselves elevated access.

## Cultural content tiers

| Tier | Examples | Default handling |
| --- | --- | --- |
| `OPEN` | Ordinary dictionary words, approved educational phrases, public learning materials | Authenticated read after approval. |
| `RESTRICTED` | Proverbs, oral histories, stories, cultural symbols, performances, elder-sourced knowledge | Validator, custodian, owner or admin access. |
| `SENSITIVE` | Sacred knowledge, disputed history, private cultural practices, personal stories, content involving minors, non-public locations | Custodian/admin access only until community rules allow more. |

## Required cultural metadata

Every relevant cultural record must support:

```ts
{
  language: string
  dialect: string
  community: string
  source: string
  contributorId: string
  validatorId?: string
  validationStatus:
    | 'draft'
    | 'submitted'
    | 'pending_review'
    | 'approved'
    | 'rejected'
    | 'needs_revision'
    | 'archived'
    | 'takedown_requested'
  contentTier: 'OPEN' | 'RESTRICTED' | 'SENSITIVE'
  consentStatus:
    | 'not_required'
    | 'contributor_consented'
    | 'source_consented'
    | 'pending'
    | 'withdrawn'
    | 'rejected'
  licence: string
  permittedUses: string[]
  aiTrainingPermission: boolean
  commercialUsePermission: boolean
  attribution: string
  reviewHistory: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

Additional cultural fields used by stories, proverbs, notes and media:

```ts
{
  title: string
  text: string
  literalTranslation?: string
  semanticMeaning?: string
  culturalContext?: string
  ageSuitability?: string
  takedownStatus?: string
}
```

## Collections

| Collection | Purpose | Access model |
| --- | --- | --- |
| `users` | Account identity, role, status and minimal private user fields. | Owner/admin read; owner can create user role only; admin manages roles. |
| `profiles` | User interests, communities, languages, privacy and consent acknowledgement. | Owner/admin read-write; no public profile reads in this prototype. |
| `communities` | Community records and governance status. | Authenticated read; community manager/admin write. |
| `languages` | Language records, including Kasem. | Authenticated read; community manager/admin write. |
| `dialects` | Dialect and region metadata. | Authenticated read; community manager/admin write. |
| `lexicalEntries` | Dictionary words and phrase records. | Contributor drafts; validator/admin review; approved open records readable to authenticated users. |
| `sentencePairs` | Source sentence and translation pairs. | Same cultural-record model. |
| `stories` | Story records and public summaries. | Restricted by content tier and validation status. |
| `proverbs` | Proverb records and meaning/context metadata. | Restricted by content tier and validation status. |
| `culturalNotes` | Cultural education notes, etiquette and contextual explanations. | Restricted by content tier and validation status. |
| `mediaAssets` | Audio, image, video and document metadata. | Tier-gated reads; owner upload metadata; validator/custodian review. |
| `contributions` | Unified intake records for all content types. | Contributor create/update during draft; validator/admin review. |
| `reviews` | Review decisions, notes, rejection reasons and verification flags. | Validator/admin read-write; immutable reviewer and creation timestamp. |
| `campaigns` | Language campaigns, story drives and sponsored bounty shells. | Authenticated read; manager/admin write. |
| `bounties` | Campaign reward/bounty placeholders. | Authenticated read; manager/admin write; no payout integration. |
| `rewardAccounts` | User points, levels and quality summaries. | Owner/validator/admin read; admin write. |
| `badges` | Badge catalogue. | Authenticated read; admin write. |
| `consentRecords` | Consent, withdrawal and permitted-use records. | Owner/custodian/admin read; owner create; custodian/admin update. |
| `culturalPermissions` | Community-level permission decisions. | Cultural authority/admin only. |
| `notifications` | User notifications. | Owner read; validator/admin create; owner can mark read. |
| `auditLogs` | Structured audit events. | Admin read; validator/admin create; no updates or deletes. |
| `reports` | Moderation, takedown and governance reports. | Community manager/admin. |
| `featureFlags` | Firebase Remote Config mirror/default documentation. | Authenticated read; admin write. |

## Storage paths

```txt
media/{OPEN|RESTRICTED|SENSITIVE}/{community}/{ownerId}/{fileName}
contributions/{ownerId}/{contributionId}/{fileName}
```

Storage accepts image, audio, video, text and PDF files under 20 MB in the
prototype rules. Sensitive media is readable only by elder, cultural custodian,
community manager or administrator roles.
