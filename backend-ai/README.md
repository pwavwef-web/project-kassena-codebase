# Backend & AI

Shared backend and AI infrastructure for the Indigen World ecosystem
(consumed by `indigen-world-web`, `tribestudio` and `indigen-world-mobile`).

> **Status:** structure + documentation. The Firebase project configuration and
> Cloud Functions are **preserved from the existing system** (Paystack donations
> + transactional email). The AI workspace is **folders and design notes only** —
> no model is connected, no production API exists, no credentials are configured.

## Layout

```
backend-ai/
  firebase/            Firebase config preserved from the prior system
    functions/         Cloud Functions (TypeScript) — donations + email
    firestore.rules    Firestore security rules
    firestore.indexes.json
    storage.rules      Storage security rules
  ai/                  AI workspace (design + future implementation)
    providers/         model/provider adapters (none connected yet)
    translation/       Kasem <-> English translation pipelines
    speech/            ASR / TTS for Kasem audio
    embeddings/        vector embeddings for search / retrieval
    moderation/        contribution safety / content moderation
    evaluation/        quality + safety evaluation harnesses
  schemas/             Firestore data schemas / contracts
  docs/                backend architecture & operations docs
  tests/               backend tests (to be added)
```

## Firebase

- **Project id:** `project-kassena-7e026` (in repo root `.firebaserc`).
- Root [`firebase.json`](../firebase.json) points hosting at the two web apps and
  rules/functions at this workspace.
- See [`firebase/README.md`](firebase/README.md) and
  [`docs/`](docs) for emulator, auth, and Remote Config notes.

## AI — important constraints

This migration deliberately does **not**:

- connect any AI model or provider,
- initialise Vertex AI / Gemini / external LLM calls,
- store real API keys or credentials,
- create production endpoints.

The `ai/` tree captures the **intended** architecture so Codex can implement it
deliberately. See [`docs/architecture.md`](docs/architecture.md).

## Environment

Copy `.env.example` → `.env` (gitignored). Secrets (Paystack secret key, SMTP
credentials, future AI provider keys) belong **only** in Cloud Functions config
or a secret manager — never in client apps or committed files.
