# Indigen World Web

Public website MVP for the Indigen World cultural technology ecosystem.

## Built Routes

`/`, `/about`, `/programmes`, `/communities`, `/languages`, `/stories`,
`/impact`, `/partners`, `/contribute`, `/support`, `/updates`,
`/updates/:slug`, `/contact`, `/privacy`, `/terms`, `/cultural-data`.

## Features

- Premium home hero using migrated repository imagery.
- Mission, value proposition and Project Kasena flagship programme sections.
- Programme, community, language, story, impact, partner, contribute and support
  pages.
- Kasem dictionary preview and language discovery UI.
- Cultural record cards with Open, Restricted and Sensitive classification.
- Demo metrics clearly labelled as demonstration data.
- Local contact/partner/contribution forms with success and error states.
- Draft legal, privacy, terms and cultural-data governance pages.
- Responsive navigation, mobile menu, accessible footer and visible focus states.
- SEO metadata helper, Open Graph defaults, structured data, sitemap and robots.
- Reduced-motion handling and local loading/empty/error states.

## Commands

```bash
npm run dev --workspace indigen-world-web
npm run typecheck --workspace indigen-world-web
npm run lint --workspace indigen-world-web
npm run test --workspace indigen-world-web
npm run build --workspace indigen-world-web
```

## Data and Integrations

All content is local fixture data in `src/content/siteData.ts`. No production
Firebase, payment or AI service is called by the website.
