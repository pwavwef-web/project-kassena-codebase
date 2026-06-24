# TribeStudio

The Indigen World **workspace** for creators, contributors, translators,
validators, elders and administrators.

> **Status:** starter shell only. The dashboard chrome compiles and runs, but
> the real workspace features (review queues, translation, validation, member
> management) are **not** built here yet. The legacy admin/contributor app is
> preserved at [`legacy/project-kasena-web`](../legacy/project-kasena-web) for
> reference and reuse.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · React Router · Vitest

## What exists

- Dashboard layout: sidebar placeholder + topbar placeholder
- Router (dashboard + 404)
- Error boundary
- Theme tokens (`src/theme/tokens.ts` + `tailwind.config.js`)
- One smoke test (`tests/smoke.test.tsx`)

## Commands

```bash
npm run dev --workspace tribestudio        # or: npm run dev:studio   (root)
npm run build --workspace tribestudio      # or: npm run build:studio (root)
npm run test --workspace tribestudio       # or: npm run test:studio  (root)
npm run typecheck --workspace tribestudio
npm run lint --workspace tribestudio
```

## Environment

Copy `.env.example` → `.env.local`. Only public Firebase web config — no secrets.
Authentication and role guards are added during the real build (see the legacy
app's `RouteGuards` and `AuthContext` for the prior approach).
