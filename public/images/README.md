# Images — drop-in slots

Every path below is the **exact filename** the site requests. Replace a file by
dropping your own asset at the same path and name — no code change needed.

All assets currently ship as **branded placeholders** (dark gradient + label), so
nothing renders broken. Swap in real art whenever you have it.

Already real — no action needed:

| Asset | Source |
|---|---|
| `profile/portrait.webp` | converted from `profile/IMG-20250204-WA0042.jpg` (your original 720×1280 photo is kept in this folder) |
| `../Moulendra_Balaji_Resume.pdf` | your resume, so the Resume button is live |

## How to replace

1. Put your file in this folder tree at the exact path listed.
2. Keep the same extension, or update the path in `src/data/portfolio.js`.
3. Recommended: **`.webp`**, ~1600px wide for covers, ~800px for detail shots,
   under 200 KB per image.

## Folders

| Folder | Purpose |
|---|---|
| `profile/` | Hero portrait |
| `logos/` | Company / institution wordmarks |
| `research/` | Paper preview figure, desktop + mobile crops |
| `brand/` | Social share card (used by OG / Twitter tags) |
| `projects/` | **Not currently rendered** — project cards are text-only (see below) |

> **Projects are text-only.** Each card shows the project name, description and
> links over a colour wave; there is no cover image. The `projects/` files are
> kept so they are there if art is ever added back, but nothing loads them and
> the `image` / `cover` fields in `src/data/portfolio.js` are currently unused.

## Required sizes

| Asset | Size | Notes |
|---|---|---|
| `brand/og-cover.png` | 1200 × 630 | Link previews. The most visible one. |
| `profile/portrait.webp` | 720 × 1280 | 9:16, the original frame (uncropped) |
| `research/paper-preview.webp` | 1600 × 1000 | 16:10 |
| `research/paper-preview-mobile.webp` | 900 × 1200 | 3:4 mobile crop |
| `logos/*.svg` | ~240 × 80 | Wordmarks |

## Portrait framing

`profile/portrait.webp` is the **uncropped** 720×1280 original. The hero renders
it in a `4 / 5` box, so `object-fit: cover` trims the top and bottom; a focal
point of `50% 8%` (`position` prop on `SmartImage`) keeps your head in frame.
Lower that percentage if the crop still feels tight, raise it to show more sky.

## Also expected, outside this folder

`public/Moulendra_Balaji_Resume.pdf` — the Resume nav button stays hidden until
this file resolves, so nothing 404s in the meantime.