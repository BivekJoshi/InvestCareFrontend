# Image assets

Every slot on the site renders a labelled placeholder until the matching file
exists here. Drop a file in with the exact name below and it appears
automatically — no code change needed.

## `board/` — director portraits (800 × 1000, portrait, plain background)

| File | Person |
| --- | --- |
| `madhu-paudel.jpg` | Mr. Madhu Paudel — Chairman |
| `basanta-chandra-marahatta.jpg` | Prof. Dr. Er. Basanta Chandra Marahatta — Director |
| `cn-pandey.jpg` | Mr. CN Pandey — Director |
| `chandramani-niroula.jpg` | Mr. Chandramani Niroula — Director |
| `narayan-adhikari.jpg` | Mr. Narayan Adhikari — Director |
| `deepak-pandey.jpg` | Mr. Deepak Pandey — Company Secretary |

## `portfolio/` — holding photography (1600 × 1000, landscape)

| File | Company |
| --- | --- |
| `sankalpa-hospitality.jpg` | Landmark Kathmandu — hotel exterior or lobby |
| `diamond-hill-resort.jpg` | Diamond Hill Resort, Panauti — grounds or valley view |
| `classic-industries.jpg` | Classic Industries — factory floor or product line |
| `kisan-agrobase.jpg` | KABIL — bottling plant or product range |
| `dobhan-khola-hydropower.jpg` | Dobhan Khola — river or powerhouse site |

## `company/` — editorial imagery

| File | Used on | Notes |
| --- | --- | --- |
| `kathmandu-skyline.jpg` | Home → Overview | Portrait crop, 1200 × 1500 |
| `office-interior.jpg` | About | Landscape, 1600 × 1200 |
| `office-map.jpg` | Contact | Wide, 2400 × 1000 — map screenshot or building photo |

## `brand/`

Place the official logo here (`logo.svg` preferred). The current mark is drawn
inline in `src/components/layout/Logo.jsx`; swap `LogoMark` for a
`next/image` pointing at the real file when it is available.

Prefer `.webp` or `.avif` where possible — update the paths in `src/data/*.js`
to match whichever extension you ship.
