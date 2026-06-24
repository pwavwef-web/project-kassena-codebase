# Indigen World — Web

Public marketing website for the **Indigen World** cultural technology ecosystem.

> **Status:** starter shell only. This is a clean, compile-ready foundation —
> the full marketing site has **not** been built here yet. The previous premium
> site is preserved for reference at
> [`legacy/project-kasena-web`](../legacy/project-kasena-web) and its docs at
> [`docs/project-kasena-web`](../docs/project-kasena-web).

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · React Router · Vitest

## What exists

- App shell with header / footer placeholders and an error boundary
- Router (home + 404)
- Brand theme tokens (`src/theme/tokens.ts` + `tailwind.config.js`)
- Global styles
- One smoke test (`tests/smoke.test.tsx`)

## Commands

Run from the repo root (npm workspaces) or inside this folder:

```bash
npm run dev --workspace indigen-world-web        # or: npm run dev:web   (root)
npm run build --workspace indigen-world-web      # or: npm run build:web (root)
npm run test --workspace indigen-world-web       # or: npm run test:web  (root)
npm run typecheck --workspace indigen-world-web
npm run lint --workspace indigen-world-web
```

## Environment

Copy `.env.example` → `.env.local` and fill in the **public** Firebase web
config. Never put secret keys here.
