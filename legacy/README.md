# legacy/

Preserved, working snapshots of the pre-migration system. **Not part of the new
build** — kept as reference material so Codex can mine real, proven code and
assets instead of starting blind.

## `project-kasena-web/`

The complete pre-migration web application (the premium Project Kasena public
marketing site **plus** the contributor/validator/admin web app), exactly as it
was before the Indigen World monorepo migration. It is self-contained and still
runnable:

```bash
cd legacy/project-kasena-web
npm install
npm run dev
```

Highlights worth reusing:

- `src/marketing/` — the full premium public website (→ informs `indigen-world-web`)
- `src/pages/` + `src/pages/admin/` + `src/components/admin/` — the workspace/admin
  app (→ informs `tribestudio`)
- `src/content/` — typed, honest marketing copy modules
- `src/lib/`, `src/hooks/`, `src/contexts/` — Firebase, auth, profile, ranks,
  achievements logic
- `src/config/firebase.ts` — Firebase web initialisation pattern
- `public/` — the full app icon / rank / achievement / carousel asset set

> Its own `.env.local` (Firebase **public** web config + Paystack **public test**
> key) was moved here with it and remains git-ignored. No private keys or
> service-account credentials exist in this repo.

See [`brand-migration.md`](../brand-migration.md) for naming rules (the legacy
code historically used "TribeStudio" and "Project Kasena" — do **not** blindly
rename it) and [`migration-report.md`](../migration-report.md) for what moved
where.
