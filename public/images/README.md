# Images — drop-in slots

Every path below is the **exact filename** the site requests. Replace a file by
dropping your own asset at the same path and name — no code change needed.

All assets currently ship as **branded placeholders** (dark gradient + label), so
nothing renders broken. Swap in real art whenever you have it.

Already real — no action needed:

| Asset | Source |
|---|---|
| `profile/portrait.webp`, `profile/portrait-alt.webp` | cropped from `profile/IMG-20250204-WA0042.jpg` (your original 720×1280 photo is kept in this folder) |
| `../Moulendra_Balaji_Resume.pdf` | your resume, so the Resume button is live |

## How to replace

1. Put your file in this folder tree at the exact path listed.
2. Keep the same extension, or update the path in `src/data/portfolio.js`.
3. Recommended: **`.webp`**, ~1600px wide for covers, ~800px for detail shots,
   under 200 KB per image.

## Folders

| Folder | Purpose |
|---|---|
| `profile/` | Hero portrait + About-section portrait |
| `logos/` | Company / institution wordmarks |
| `research/` | Paper preview figure, desktop + mobile crops |
| `projects/` | One cover + one detail image per project card |
| `brand/` | Social share card (used by OG / Twitter tags) |

## Required sizes

| Asset | Size | Notes |
|---|---|---|
| `brand/og-cover.png` | 1200 × 630 | Link previews. The most visible one. |
| `profile/portrait.webp` | 1200 × 1500 | 4:5 portrait |
| `profile/portrait-alt.webp` | 1200 × 1500 | Alternate crop for About |
| `projects/*-cover.webp` | 1600 × 1000 | 16:10 card art |
| `projects/*-detail-1.webp` | 1600 × 1000 | Second shot, revealed on hover |
| `research/paper-preview.webp` | 1600 × 1000 | 16:10 |
| `research/paper-preview-mobile.webp` | 900 × 1200 | 3:4 mobile crop |
| `logos/*.svg` | ~240 × 80 | Wordmarks |

## Project image filenames

One `<slug>` per project in `src/data/portfolio.js`:

```
conflict-free-collaborative-oltp   scrybe-io
support-triage-environment         drishti-transit
lunar-ice-engine                   gestureforge
leaklens                           sprygen
ai-stadium-companion               message-notification-router
mediflow-ai-healthcare             indiaruns-ranking
et-ai-voltiq                       carbonpulse
student-performance-ml-analysis    chocolate-shipments-report
```

The featured research card reuses `research/paper-preview.webp`.

## Also expected, outside this folder

`public/Moulendra_Balaji_Resume.pdf` — the Resume nav button stays hidden until
this file resolves, so nothing 404s in the meantime.