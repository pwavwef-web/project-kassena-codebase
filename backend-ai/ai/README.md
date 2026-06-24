# AI workspace

Design surface for Indigen World's language AI. **Nothing is connected yet** —
no models, no providers, no credentials, no endpoints. Each subfolder is a
placeholder describing intended scope.

| Folder | Intended scope |
| --- | --- |
| `providers/` | Adapters for model providers (kept behind an interface so providers are swappable). Default to the latest Claude models when an LLM is wired in. |
| `translation/` | Kasem ↔ English translation pipelines, glossary/termbase integration, human-in-the-loop review hooks. |
| `speech/` | Speech-to-text and text-to-speech for Kasem audio contributions. |
| `embeddings/` | Vector embeddings for dictionary/corpus search and retrieval. |
| `moderation/` | Safety and quality moderation for community contributions. |
| `evaluation/` | Offline evaluation + regression harnesses for translation/ASR quality and safety. |

## Principles

- **No live model calls** until explicitly designed and approved.
- **Provider-agnostic** behind a thin interface; keep keys server-side only.
- **Cultural data is sensitive** — Kasem language data, elder recordings and
  community contributions must follow the consent/ownership rules defined by the
  programme before any AI training or inference use.

See [`../docs/architecture.md`](../docs/architecture.md) for how this fits the
broader backend.
