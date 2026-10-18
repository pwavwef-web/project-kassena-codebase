# Backend & AI

Shared Firebase and AI scaffolding for the Indigen World ecosystem.

This workspace is prepared for local development and emulator validation only.
No production Firebase deployment, payment processing or external AI call is
made by this MVP.

## Layout

```txt
backend-ai/
  firebase/
    functions/              Cloud Functions v2 mock callables
      legacy-production/    Inactive preserved Paystack/email reference code
    firestore.rules          Prototype Firestore rules
    firestore.indexes.json   MVP query index scaffolding
    storage.rules            Prototype Storage rules
  ai/
    interfaces.ts            Provider-independent AI interfaces
    types.ts                 Result metadata, config and typed errors
    providers/               Mock, Vertex placeholder, local placeholder
    evaluation/              Evaluation harness interfaces
  schemas/
    firestore-collections.md Canonical Firestore contracts
  docs/
    firebase-setup.md
    firebase-data-model.md
    ai-roadmap.md
    security-model.md
  tests/
    emulator-smoke.cmd
    firestore-rules-analysis.md
```

## Functions

The exported Functions are safe scaffolds:

- `createUserProfile`
- `submitContribution`
- `createReviewTask`
- `reviewContribution`
- `calculateRewardPoints`
- `publishApprovedContent`
- `requestContentTakedown`
- `generateDatasetExport`
- `sendNotification`
- `recordAuditEvent`
- `aiGateway`

They validate basic payload shape and return mock responses. They do not write
to Firestore, send email, verify payments or call an AI provider.

## Local commands

```bash
cd backend-ai/firebase/functions
npm install
npm run build
npm run lint
```

From the repository root:

```bash
npx -y firebase-tools@latest emulators:exec --only firestore backend-ai/tests/emulator-smoke.cmd
npx -y firebase-tools@latest emulators:exec --only storage backend-ai/tests/emulator-smoke.cmd
```

## Documentation

- [`docs/firebase-setup.md`](docs/firebase-setup.md)
- [`docs/firebase-data-model.md`](docs/firebase-data-model.md)
- [`docs/ai-roadmap.md`](docs/ai-roadmap.md)
- [`docs/security-model.md`](docs/security-model.md)
