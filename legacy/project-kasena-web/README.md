# Project Kasena

## 1. Project overview

Project Kasena is a Kasem language preservation and AI/data platform. It has two
parts in one codebase:

- **Public website** (premium marketing site) — `src/marketing/`, served at `/`.
- **Web application** (existing) — dictionary, contribution, rewards, admin —
  reached via “Launch app” → `/dictionary`.

The application provides secure Google sign-in, dictionary browsing, contribution
submission, upload review workflows, donations (Paystack), and an admin/validator
control panel.

### Public website

- Shell: `src/marketing/layout/` (`MarketingLayout`, `SiteHeader`, `MobileNav`, `Footer`).
- Pages: `src/marketing/pages/`. Routes wired in `src/app/routes.tsx`.
- Content (edit copy here, not in JSX): `src/content/*.ts` — see
  [docs/content-model.md](docs/content-model.md).
- Design system: [docs/design-system.md](docs/design-system.md). Tokens in
  `tailwind.config.js` + `src/styles/globals.css`.
- Full route map: [docs/website-information-architecture.md](docs/website-information-architecture.md).
- Other docs: audit, animation system, SEO, accessibility, Firebase integration,
  image-generation prompts, deployment, QA — all under `docs/`.

**Editing content:** open the matching file in `src/content/` (e.g. `home.ts`,
`products.ts`, `updates.ts`, `legal.ts`) and edit the typed objects/arrays.
Empty/optional fields hide gracefully. Never add fabricated stats, partners,
funding, team members or testimonials; use the honest status/metric labels.

## 2. Tech stack

- Vite
- React + TypeScript
- Firebase Web SDK v10+
- Firebase Authentication (Google provider)
- Firestore
- Firebase Storage
- Firebase Hosting
- React Router
- Tailwind CSS
- ESLint + Prettier

## 3. Folder structure

```txt
src/
  app/
    App.tsx
    routes.tsx
  components/
    layout/
    common/
    forms/
    admin/
  config/
    firebase.ts
  contexts/
    AuthContext.tsx
  hooks/
    useAuth.ts
    useUserRole.ts
  lib/
    firestore.ts
    storage.ts
    validators.ts
    constants.ts
    date.ts
  pages/
    HomePage.tsx
    LoginPage.tsx
    DashboardPage.tsx
    SubmitContributionPage.tsx
    DictionaryPage.tsx
    UploadsPage.tsx
    ProfilePage.tsx
    NotFoundPage.tsx
    admin/
      AdminDashboardPage.tsx
      AdminSubmissionsPage.tsx
      AdminUsersPage.tsx
      AdminUploadsPage.tsx
      AdminDictionaryPage.tsx
      AdminSettingsPage.tsx
  types/
    index.ts
  styles/
    globals.css
```

## 4. Environment variable setup

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Populate:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## 5. Firebase setup steps

1. Create a Firebase project.
2. Enable Authentication, Firestore, and Storage.
3. Copy `.firebaserc.example` to `.firebaserc` and set your project id.
4. Deploy rules:
   ```bash
   npm run firebase:deploy:rules
   ```

## 6. Enable Google Sign-In in Firebase Console

1. Open **Authentication → Sign-in method**.
2. Enable **Google** provider.
3. Add your authorized domain(s).

## 7. Firestore collections

- `users`
- `contributions`
- `dictionaryEntries`
- `uploads`
- `auditLogs`
- `settings`

Leaderboard reads from `users` with these public-facing ranking fields:

```ts
users/{uid}: {
  uid: string
  displayName: string
  photoURL?: string
  totalPoints: number
  weeklyPoints: number
  monthlyPoints: number
  approvedEntries: number
  badgeTitle: string
  lastContributionAt: Timestamp
  createdAt: Timestamp
}
```

Firestore indexes are registered in `firestore.indexes.json` for
`weeklyPoints`, `monthlyPoints`, and `totalPoints` descending leaderboard
queries. Deploy them with the normal Firebase deploy flow.

## 8. Storage path structure

- `contributions/{uid}/{contributionId}/{filename}`
- `uploads/{uid}/{uploadId}/{filename}`

## 9. How to run locally

```bash
npm install
npm run dev
```

## 10. How to deploy to Firebase Hosting

```bash
npm run build
npm run firebase:deploy:hosting
```

## 11. How to make the first admin user

1. Sign in once with Google in the app.
2. Open Firestore `users` collection.
3. Find your user document (`users/{uid}`).
4. Set `role` to `admin` manually.
5. Use Admin panel to manage later users.

## 12. Security notes

- Frontend role checks are read from `users/{uid}.role`.
- Firestore rules block users from changing their own `role` and `status`.
- Public/direct write to `dictionaryEntries` is blocked.
- Uploads require authentication, MIME checks, and size limits.
- **TODO (production hardening):** move trusted role assignment/privilege elevation to Firebase custom claims and/or admin-only Cloud Functions.

## 13. MVP test checklist

- [ ] Google Sign-In works
- [ ] User document created
- [ ] Contribution submitted
- [ ] File upload works
- [ ] Admin can approve contribution
- [ ] Approved entry appears in dictionary
- [ ] Admin can reject contribution
- [ ] Upload review works
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] Firebase hosting deploy successful

## 14. Next steps

- Add Cloud Functions for secure server-side approval flows
- Add pagination/index tuning for large datasets
- Add automated tests (unit + integration)
- Add custom claims based role management
- Add multilingual UX refinements and moderation analytics
