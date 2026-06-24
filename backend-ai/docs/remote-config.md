# Remote Config

Firebase Remote Config is **not yet used** by any app. This note records the
intended usage so Codex can wire it deliberately.

## Intended usage

- **Feature flags** to roll out new workspace/app areas gradually.
- **Kill-switches** for AI features (so any AI surface can be disabled instantly).
- **Content/config** that should change without a redeploy.

## Guidance

- Keep flag keys documented and typed in each client.
- Never put secrets in Remote Config — it is client-readable.
- Default every AI-related flag to **off** until the feature is approved.
