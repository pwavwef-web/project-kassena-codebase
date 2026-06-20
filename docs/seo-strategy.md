# Project Kasena — SEO Strategy

## Per-page metadata

Every marketing page renders `<Seo>` (`src/marketing/lib/seo.tsx`), which sets,
at runtime (no extra dependency):

- `<title>` — `"{Page} — Project Kasena"` (home uses the tagline).
- `<meta name="description">` — unique per page.
- `<link rel="canonical">` — absolute, from the route.
- Open Graph: `og:title/description/type/url/image/site_name`.
- Twitter: `summary_large_image` card.
- `<meta name="robots">` — `noindex` on drafts (legal drafts, 404).
- JSON-LD: an `Organization` graph on every page, plus page-specific schema
  (`WebSite`, `HowTo`, `Article`, `BreadcrumbList`, `FAQPage`) where relevant.

`index.html` carries sensible static defaults so first paint / non-JS scrapers
still see brand metadata and the OG image.

## Structured data

- `Organization` — name, url, logo, location, `knowsLanguage: [Kasem, English]`.
- `WebSite` — home.
- `Article` — featured/updates posts.
- `HowTo` — how-it-works steps.
- Add `BreadcrumbList` and `FAQPage` where pages introduce Q&A or deep nesting.

## Crawl & indexing

- `public/robots.txt` — allows crawling, points to the sitemap.
- `public/sitemap.xml` — lists all public marketing routes (app/admin excluded).
- Clean, descriptive URL structure (`/how-it-works`, `/ai-data`, `/legal/privacy`).
- Internal linking between related pages (footer, in-section ArrowLinks).
- Descriptive image file names + alt text.

## Preserving existing indexed URLs

The redesign **does not move or delete** existing app routes, so previously
indexed URLs (`/dictionary`, `/support`, `/culture`, …) keep resolving — no
redirects required. Only `/` changed *content* (app home → marketing home); its
URL is unchanged.

## Keywords / topical focus (no stuffing)

Kasem, Kasena-Nankana, Ghana, language preservation, language technology,
indigenous-language AI, digital heritage, verified datasets, community data
governance — woven naturally into copy and headings.

## Social preview

`public/social/og-default.svg` is the design source. **Action:** export a
1200×630 **PNG** for maximum scraper compatibility (some platforms ignore SVG OG
images) and point `site.ogImage` at it.
