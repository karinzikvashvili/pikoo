# Pikoo — DESIGN.md

Direction: warm storybook paper, grown-up and trustworthy. The books are the hero; the interface stays quiet, like a well-made printed book. Based on the existing Pikoo brand and the rules of the web-design-system skill, **not** on real-site comparisons (UXKIN is not connected in this session).

## Color
Neutral scale (text, surfaces, borders), one primary, one accent used for decoration only.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | #FBF6EC | #171A2B | page background (cream paper / night ink) |
| `--paper` | #FFFFFF | #20243A | cards, form |
| `--ink` | #1F2A44 | #F2EBDD | body and headings |
| `--muted` | #5B6379 | #AEB4C8 | secondary text (>=4.5:1 on bg) |
| `--line` | #E6DCC8 | #343A58 | borders, dividers |
| `--accent` (primary) | #6B5CA5 | #B3A6E8 | buttons, links, focus ring |
| `--accent-ink` | #FFFFFF | #171A2B | text on primary |
| `--soft` | #F1ECF8 | #2A2842 | chips, price tags |
| `--gold` | #C98B3C | #E0A55A | decoration only: rule bars, stars, underline. Never as a text background with white text (fails contrast) |
| `--wa` | #137A3F | #3DBE73 | WhatsApp button (white text 5:1 on light) |
| `--ok` / `--warn` | #2F7D5B / #9A3B2E | #6FCF9C / #F0A090 | form states |

## Typography
- One family: **Assistant** (Hebrew + Latin), self-hosted woff2, weights 400, 700, 800. Fallback: system-ui, Arial.
- Scale (px / line-height): 14/1.5 · 16/1.6 · 18/1.6 (body) · 22/1.35 · 28/1.2 · 40/1.12 · 56/1.08 (h1, clamp on mobile).
- Headings 800, `text-wrap:balance`. Lines capped at ~65 characters.

## Spacing and layout
- 8px scale: 8, 16, 24, 32, 48, 72. Section padding 48 mobile / 72 desktop.
- Content width 1040px, text column 640px. 16px side gutter on phones.

## Shape and depth
- Radius: 12 (inputs, cards), 20 (feature images, form), 999 (buttons, chips).
- One shadow, for book images only: `0 14px 34px rgba(31,42,68,.22)`. No other shadows, no glass, no gradients.

## Components
- **Button primary**: accent fill, 48px min height, hover darkens 8%, focus ring 3px accent + 2px offset, disabled 60% opacity.
- **Button WhatsApp**: `--wa` fill. **Button ghost**: accent border, transparent.
- **Inputs**: 48px height, 1.5px `--line` border, visible labels (no placeholder-only), error text under the field.
- **Cards**: paper, 1.5px line border, radius 12. Recommended plan gets accent border and a tag.
- **Nav**: logo + 3 anchor links + one primary button. Mobile: logo + button, sticky bottom bar only for the order CTA.
- **Footer**: contact, business details, privacy, terms, accessibility statement.

## Imagery
- Real book pages only (cover, spreads, printed copy video). Each carries an honest label ("דוגמה מספר אמיתי").
- Karin's illustrated portrait in the about section. No stock photos, no emoji as icons. Icons: simple line SVG, 1.75px stroke, ink color.
- Motion: subtle fade/lift on scroll, disabled under `prefers-reduced-motion`.
