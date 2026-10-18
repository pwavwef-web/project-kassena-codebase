# Remote Config

Firebase Remote Config is documented but not wired to production.

## Draft keys

| Key | Default | Purpose |
| --- | --- | --- |
| `ai_gateway_enabled` | `false` | Kill-switch for AI gateway UI and Functions. |
| `dataset_export_enabled` | `false` | Controls dataset export workflows. |
| `mobile_offline_sync_enabled` | `false` | Future local draft sync. |
| `support_payments_enabled` | `false` | Future payment processing. |
| `sensitive_content_reviews_enabled` | `true` | Keeps review warnings active. |

## Guidance

- Never put secrets in Remote Config because client apps can read it.
- Default AI-related flags to off.
- Mirror important defaults in documentation and typed client config.
