# Brand migration — Indigen World ⟷ Project Kasena

This migration introduces **Indigen World** as the parent brand. **Project
Kasena** is **not** deprecated — it becomes the flagship programme inside Indigen
World. Naming must be applied deliberately, not by find-and-replace.

## Brand relationships

| Brand | Meaning |
| --- | --- |
| **Indigen World** | Parent cultural-technology ecosystem (org, platform, public site, mobile app). |
| **Project Kasena** | Flagship **Kasem** language, data, translation and AI-readiness programme. |
| **TribeStudio** | The workspace for creators, contributors, translators, validators, elders and administrators. |
| **Indigen World Mobile** | The consumer mobile application. |
| **Backend & AI** | Shared Firebase + future AI infrastructure. |

## Use **“Indigen World”** for

- the overall organisation / ecosystem;
- the public marketing website (`indigen-world-web`);
- the broader platform and brand voice;
- the mobile application (`indigen-world-mobile`).

## Use **“Project Kasena”** for

- the flagship Kasem-language programme;
- Kasem dictionary, translation and dataset work;
- Kasem validators and community contribution flows specific to Kasem;
- **historical Project Kasena documents** (keep their original titles);
- Kasem-specific AI development.

## Do NOT

- **Do not blindly replace every occurrence of “Project Kasena.”** It remains a
  real, current programme name.
- **Do not rename historical reports/documents** where “Project Kasena” (or the
  variant spelling **“Project Kassena”**, used by the Firebase project id and the
  readiness report) is their correct original title. Examples kept verbatim:
  - `docs/reports/READINESS-REPORT.md` (titled “Project Kassena — App Readiness Report”)
  - everything under `legacy/project-kasena-web/`
  - the Firebase project id `project-kassena-7e026`
- Do not rename cultural assets without documenting the change in
  [`asset-manifest.md`](asset-manifest.md).

## Spelling note

Three spellings coexist intentionally and should be preserved in their existing
contexts:

- **Kasena / Project Kasena** — the programme and the language community (primary, correct brand spelling).
- **Kassena** — appears in the Firebase project id (`project-kassena-7e026`) and
  the historical readiness report title. Treat as fixed identifiers; do not
  “correct” them, or you will break Firebase references.
- **Kasem** — the language itself.

## Code-level guidance

- The legacy app package was historically named `tribestudio` and the public
  surfaces were branded “Project Kasena.” The new repo separates these:
  - `indigen-world-web` → Indigen World public site
  - `tribestudio` → the workspace (now a first-class Indigen World product)
- New user-facing copy should lead with **Indigen World**, and refer to
  **Project Kasena** when talking specifically about the Kasem programme.
