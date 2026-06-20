# Project Kasena — Deployment Guide

## Prerequisites

- Node 18+ and npm.
- A populated `.env.local` (copy from `.env.example`) with `VITE_FIREBASE_*` and
  `VITE_PAYSTACK_PUBLIC_KEY`.
- Firebase CLI access to the project (`.firebaserc` set).

## Local development

```bash
npm install
npm run dev
```

## Quality gates (run before deploying)

```bash
npm run build      # tsc -b + vite build  (must succeed)
npm run lint       # eslint
```

## Build the production site

```bash
npm run build
```

Outputs to `dist/` (this is what Firebase Hosting serves; SPA rewrite to
`index.html` is already configured in `firebase.json`).

## Deploy

**Hosting only (the website):**

```bash
npm run build
npm run firebase:deploy:hosting
```

**Exact command to deploy to Firebase Hosting:**

```bash
npm run build && npx firebase deploy --only hosting
```

**Firestore + Storage rules (deploy after rule changes — required for the new
newsletter/contact forms to work):**

```bash
npm run firebase:deploy:rules        # firestore:rules + storage
npx firebase deploy --only firestore:indexes
```

**Cloud Functions (unchanged in this redesign; deploy only if functions change):**

```bash
npx firebase deploy --only functions
```

**Everything:**

```bash
npm run build && npx firebase deploy
```

## Post-deploy verification

1. Visit `/` → marketing home renders; `/dictionary` (Launch app) still works.
2. Sign-in still works; `/admin` gated correctly.
3. `/support` donation (Paystack) completes and email confirmation arrives.
4. Newsletter + contact forms submit (requires rules deployed).
5. Social preview: paste the URL into a debugger and confirm OG image/title.
6. `robots.txt` and `sitemap.xml` resolve at the site root.

## Rollback

The pre-redesign state is preserved on branch `backup/pre-redesign-2026-06-20`.
To roll back: `git checkout backup/pre-redesign-2026-06-20`, rebuild, redeploy.
