# Indigen World — Architecture

A monorepo with three product workspaces and one shared backend/AI workspace.

## High-level

```
                         ┌─────────────────────────────┐
                         │        Indigen World        │
                         │  cultural technology ecosystem
                         └─────────────────────────────┘
            ┌──────────────────────┬───────────────────────┬──────────────────────┐
            ▼                      ▼                       ▼                      ▼
   indigen-world-web         tribestudio          indigen-world-mobile        backend-ai
   (public website)        (workspace/studio)     (consumer mobile app)   (Firebase + AI)
     React+TS+Vite           React+TS+Vite             Flutter/Dart          functions, rules,
     Tailwind                Tailwind                  Material 3            schemas, ai/*
            │                      │                       │                      ▲
            └──────────────────────┴───────────────────────┴──────────────────────┘
                                        shared Firebase project
                                        (project-kassena-7e026)
```

## Workspaces

| Folder | Product | Stack | Build tooling |
| --- | --- | --- | --- |
| `indigen-world-web/` | Indigen World public website | React 19, TypeScript, Vite, Tailwind, React Router | npm workspace |
| `tribestudio/` | Contributor/validator/admin workspace | React 19, TypeScript, Vite, Tailwind, React Router | npm workspace |
| `indigen-world-mobile/` | Consumer mobile app | Flutter, Dart, Material 3 | Flutter (separate) |
| `backend-ai/` | Shared Firebase + AI infra | TypeScript (Functions), docs | Firebase CLI |

The two React apps are **npm workspaces** under the root `package.json`. The
Flutter app and the backend are managed by their own toolchains (Flutter, Firebase CLI).

## Supporting directories

| Folder | Purpose |
| --- | --- |
| `legacy/project-kasena-web/` | The full pre-migration app, preserved & runnable, for reference/reuse. |
| `docs/` | Architecture + the preserved Project Kasena website docs (`project-kasena-web/`) and reports (`reports/`). |
| `assets/` | Shared brand assets (`brand/`) + the Project Kasena logo. |
| `reference-materials/` | UI reference imagery from prior design sessions. |

## Frontend conventions (web + studio)

- `src/main.tsx` → `RouterProvider` → `src/app/router.tsx`.
- `src/app/App.tsx` is the layout shell, wrapped in an `ErrorBoundary`.
- Pages in `src/pages/`, layout/chrome in `src/components/layout/`.
- Theme tokens in `src/theme/tokens.ts`, mirrored in `tailwind.config.js`.
- Tests in `tests/` (Vitest + Testing Library, jsdom).

## Mobile conventions

- Feature-first: `lib/features/<feature>/presentation/...`.
- App wiring in `lib/app/` (`app.dart`, `router.dart`); theme in
  `lib/core/theme/`.
- Material 3, brand-seeded `ColorScheme`, light + dark.

## Backend

- Single Firebase project shared by all clients.
- Cloud Functions, Firestore/Storage rules, and indexes live under
  `backend-ai/firebase/`; data contracts under `backend-ai/schemas/`.
- The `backend-ai/ai/` tree is **design-only** — no model is connected.
- See [`backend-ai/docs/architecture.md`](backend-ai/docs/architecture.md).

## Data flow (current/preserved)

1. Clients authenticate via Firebase Auth (Google).
2. Reads/writes go to Firestore, gated by `firestore.rules`; media to Storage.
3. Server-side work (donation verification, email) runs in Cloud Functions.
4. AI services are a **future** layer behind the backend, never called from
   clients with secrets.
