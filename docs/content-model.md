# Project Kasena — Content Model

All marketing copy lives in typed modules under `src/content/` — **not** buried
in JSX. Editors change content here without touching components.

## Modules

| File | Exports | Used by |
|---|---|---|
| `site.ts` | `site`, `productStatusLabels`, `metricKindLabels`, `allianceStatement`; types `ProductStatus`, `MetricKind` | global |
| `navigation.ts` | `primaryNav`, `footerColumns`, `legalNav` | header/footer |
| `home.ts` | `home` | Home |
| `products.ts` | `products` (`ProductModule[]`) | Home, Build |
| `roadmap.ts` | `roadmapPhases`, `datasetTarget` | Home, AI & Data |
| `impact.ts` | `audiences`, `impactCategories`, `targetMetrics` | Home, Impact |
| `howItWorks.ts` | `howItWorksSteps` | Home, How It Works |
| `about.ts` | About content | About |
| `alliance.ts` | Alliance content | Alliance |
| `partners.ts` | `PartnerPathway[]` | Partners |
| `transparency.ts` | milestones, governance, `publicDocuments[]` | Transparency |
| `updates.ts` | `Update[]` | Updates |
| `team.ts` | team groups (empty by default) | Team |
| `heritage.ts` | `CulturalRecord[]` (public only rendered) | Culture & Heritage |
| `legal.ts` | `legalDocs[]`, `getLegalDoc()` | Legal |

## Conventions

- **Honest status vocabulary**: `ProductStatus` = `available | in-development |
  planned | research`; `MetricKind` = `current | target | pilot-target |
  in-progress`. The `StatusBadge`/`MetricLabel` components render these so future
  capability can never read as operational.
- **Optional fields hide safely**: empty arrays/sections render nothing (e.g.
  `team.ts` groups, `transparency` documents) instead of placeholders.
- **No fabrication**: no invented stats, partners, funding, team or endorsements.
  Unknown facts use clearly-labelled placeholders (`// PLACEHOLDER`, visible
  “Project target” / “Draft pending review”).
- **Live data** comes from Firestore via `usePublicStats`, never hardcoded.
- **Kasem text** is wrapped in `font-kasem` for correct diacritic rendering.

## Adding a news/update post

Append to the `updates` array in `src/content/updates.ts` (typed `Update`):
`id, slug, title, excerpt, body, category, author, date (ISO), featured`.
Reading time is computed from `body`. For long-form, migrate `body` to
Markdown/MDX or Firestore later — the component reads from the typed array today.

## Connecting cultural content to a CMS/Firestore later

`heritage.ts` `CulturalRecord` already carries governance fields (region,
contributor, validator, `consentStatus`, `publicationStatus`,
`sourceAttribution`). Swap the static array for a Firestore query returning the
same shape; only `consentStatus: 'public'` records are rendered.
