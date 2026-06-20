# Project Kasena — Information Architecture

## Two shells, one codebase

| Shell | Layout | Purpose |
|---|---|---|
| **Marketing website** | `MarketingLayout` | Public storytelling, governance, support, contact |
| **Web application** | `MainLayout` (existing, untouched) | Dictionary, contribution, rewards, admin |

“Launch app” / “Explore the dictionary” bridges marketing → app at `/dictionary`.

## Public marketing routes

| Path | Page | Notes |
|---|---|---|
| `/` | Home | Cinematic hero + 13 sections |
| `/about` | About Project Kasena | Origin, mission, vision, values, why Kasem |
| `/build` | What We Are Building | Product ecosystem (honest statuses) |
| `/how-it-works` | How It Works | 8-step contribution → verified data flow |
| `/ai-data` | AI & Data Roadmap | 3 phases; “why verified data matters” |
| `/impact` | Community & Impact | Audiences, impact categories, live + target stats |
| `/heritage` | Culture & Heritage | Editorial archive (consent-aware) |
| `/alliance` | Project Kasena × Indigen World | Disciplined alliance, ecosystem layers |
| `/partners` | Partners & Collaborate | Pathways + partnership enquiry form |
| `/support` | Support Project Kasena | **Existing app donation flow (Paystack) — preserved** |
| `/transparency` | Transparency & Reports | Milestones, public-document registry |
| `/updates` | News & Updates | Editorial, content-driven, search + categories |
| `/team` | Team | Confirmed members only; auto-hide empty groups |
| `/contact` | Contact | Typed enquiries → `contactMessages` |
| `/legal/:slug` | Legal & Governance | privacy, terms, contributor-terms, data-governance, cultural-content, accessibility, cookies, takedown, data-protection |
| `*` | 404 | Marketing-branded |

## Application routes (preserved, unchanged)

`/login`, `/dictionary`, `/culture` (uploads gallery), `/support/donate`,
`/support/success`, `/dashboard`, `/complete-profile`, `/contributions`,
`/leaderboard`, `/announcements`, `/achievements`, `/rewards`, `/submit`,
`/uploads`, `/profile`, `/admin/*`.

## Primary navigation

About · What we build (Build, How it works, AI & data) · Impact (Impact,
Culture & heritage, Transparency) · Alliance · Partner (Partners, Team, Contact)
· Updates — plus **Support** and **Launch app** CTAs.

## Content architecture

Typed modules in `src/content/` (`site`, `navigation`, `home`, `products`,
`roadmap`, `impact`, `howItWorks`, `about`, `alliance`, `partners`,
`transparency`, `updates`, `team`, `heritage`, `legal`). Pages render from these;
optional fields let incomplete information be hidden safely. No `lorem ipsum`.
