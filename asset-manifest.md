# Asset manifest

Inventory of assets used or preserved in the Indigen World monorepo.

## Root brand assets

| Path | Status | Notes |
| --- | --- | --- |
| `assets/project-kasena-logo.png` | active | Project Kasena flagship programme mark. |
| `assets/brand/favicon.png` | active | Shared favicon source. |
| `assets/brand/favicon.svg` | active | Copied into web and studio public folders. |
| `assets/brand/og-default.svg` | active | Copied into the web app public root as `og-default.svg`. |

## Indigen World Web assets

Copied from preserved legacy assets so the public site can build standalone:

| Path | Source | Use |
| --- | --- | --- |
| `indigen-world-web/public/images/mission-carousel/01-oral-heritage.jpg` | `legacy/project-kasena-web/public/mission-carousel/` | Home hero. |
| `indigen-world-web/public/images/mission-carousel/02-dictionary-builders.jpg` | legacy | Mission/gallery imagery. |
| `indigen-world-web/public/images/mission-carousel/03-community-validation.jpg` | legacy | Mission/gallery imagery. |
| `indigen-world-web/public/images/mission-carousel/04-learning-tools.jpg` | legacy | Mission/gallery imagery. |
| `indigen-world-web/public/images/mission-carousel/06-cultural-archive.jpg` | legacy | Reserved public-site imagery. |
| `indigen-world-web/public/brand/project-kasena-logo.png` | `assets/project-kasena-logo.png` | Flagship programme card. |
| `indigen-world-web/public/og-default.svg` | `assets/brand/og-default.svg` | Open Graph default. |

## TribeStudio assets

Copied from preserved legacy assets for standalone workspace build:

| Path | Use |
| --- | --- |
| `tribestudio/public/icons/ui/*.png` | Reserved workspace UI icon set. |
| `tribestudio/public/achievements/*.png` | Full achievement badge catalogue promoted from preserved legacy assets. |
| `tribestudio/public/ranks/*.png` | Reserved rank imagery. |

## Mobile platform assets

`flutter create . --platforms=android,ios` generated default Android and iOS app
icons and launch images under `indigen-world-mobile/android/` and
`indigen-world-mobile/ios/`. These are default Flutter scaffold assets and
should be replaced with approved Indigen World app icons before production.

## Preserved legacy assets

The prior app remains at `legacy/project-kasena-web/public/` with achievements,
ranks, UI icons, mission carousel images, favicon assets, social assets and
historical files. These are preserved for reference and selective reuse.

## Known gaps

- No dedicated Indigen World parent-brand logo exists yet.
- Per-file cultural asset licensing is still undocumented.
- Production app icons and store assets are pending.
- TribeStudio achievement catalogue currently has 30 mapped badge images and no known missing badge artwork.
