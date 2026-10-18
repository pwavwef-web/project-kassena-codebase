# AI roadmap

The AI layer is provider-independent and mock-first. No Gemini, Vertex AI,
OpenAI, Hugging Face or external speech service is called by this MVP.

## Interfaces prepared

Files under `backend-ai/ai/` define interfaces for:

- translation;
- dictionary augmentation;
- semantic retrieval;
- embeddings;
- duplicate detection;
- moderation;
- speech-to-text;
- text-to-speech;
- audio quality scoring;
- transcription alignment;
- dataset preparation;
- model evaluation;
- human-review escalation.

## Providers

| Provider | Status |
| --- | --- |
| `MockAiProvider` | Returns typed mock responses for local tests. |
| `VertexAiPlaceholderProvider` | Throws `LIVE_CALL_DISABLED`; no live call. |
| `LocalProviderPlaceholder` | Throws `PROVIDER_NOT_CONFIGURED`; no local model bundled. |
| `createAiProvider` | Factory defaults to mock with `allowLiveCalls: false`. |

## Required AI result metadata

Every AI result supports:

- provider;
- model;
- model version;
- prompt version;
- source references;
- language;
- dialect;
- confidence;
- safety flags;
- cultural review status;
- human validation status;
- timestamp.

## Future gates

Before any production AI work:

1. Confirm governance rules for the relevant community.
2. Use only records with explicit AI-training permission.
3. Exclude restricted/sensitive records unless custodians explicitly approve the
   exact use.
4. Add evaluator fixtures and human review workflows.
5. Store prompts and model versions with outputs.
6. Keep provider credentials server-side only.
