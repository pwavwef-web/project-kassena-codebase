# AI workspace

Provider-independent AI scaffolding for Indigen World language and cultural data
workflows. Nothing here makes a live model call.

## Files

| Path | Purpose |
| --- | --- |
| `types.ts` | Shared metadata, typed results, config and typed errors. |
| `interfaces.ts` | Provider interfaces for translation, speech, embeddings, moderation, duplicate detection, dataset preparation, evaluation and human-review escalation. |
| `providers/mock-provider.ts` | Safe mock provider for local tests. |
| `providers/vertex-ai-placeholder.ts` | Placeholder that throws `LIVE_CALL_DISABLED`. |
| `providers/local-provider-placeholder.ts` | Placeholder that throws `PROVIDER_NOT_CONFIGURED`. |
| `providers/provider-factory.ts` | Factory defaulting to mock with `allowLiveCalls: false`. |
| `evaluation/evaluation-interfaces.ts` | Evaluation case and harness interfaces. |

## Principles

- No Gemini, Vertex AI, OpenAI, Hugging Face or external speech calls.
- No repository content is uploaded to a model.
- Restricted or sensitive cultural content requires explicit governance review.
- AI-training permission and commercial-use permission are explicit fields.
