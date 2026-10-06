---
paths:
  - "src/**/*.tsx"
  - "src/**/*.ts"
  - "src/**/*.css"
---

# UI rules

The site is dark (black background), Inter, IEEE blue. Keep that brand; do not restyle pages you were not asked to touch.

1. **Check your work visually.** Before finishing UI work, screenshot every page you changed at 360 px and 1440 px wide, list what looks off, fix it, and look again. No horizontal scroll at 360 px.
2. **Use the shared primitives** in `src/components/hackathon/ui/`: `Button`/`ButtonLink`, `Card`, `Badge`, `Alert`, form fields, `Dialog`, `Tabs`, `icons`. Despite the folder name they are site-wide. If a variant is missing, add it to the primitive instead of styling a one-off.
3. **No new global element selectors** (`button {}`, `a {}`, `h2 {}`) in `index.css`. Style through classes.
4. **Colours from tokens only.** Accent fill: `bg-hk-accent` (#00629C), hover `bg-hk-accent-hover`. Accent text, links, icons: `text-hk-accent-fg` (#5cb3ea). Text: `text-white` for headings, `text-zinc-300` for body, `text-zinc-400` for secondary, `text-zinc-500` for captions. Borders and surfaces: `border-white/10`, `bg-white/[0.03]`. No raw hex values or arbitrary colours in class names.
5. **Never use #00629C (`text-ieee-blue`, `text-hk-accent`) for text below 24 px.** It is about 3:1 on black and fails WCAG. Use `text-hk-accent-fg` instead.
6. **Fixed type scale.** Page title `text-3xl sm:text-4xl`, section title `text-2xl sm:text-3xl`, card title `text-lg`, body `text-base`, secondary `text-sm`, captions and badges `text-xs`. Weight: `font-semibold` for headings and labels only; body text is regular. No `text-[30px]`-style arbitrary sizes. Long text stays within `max-w-prose`.
7. **Hierarchy through weight and colour, not size.** One primary button per view; everything else is `secondary` or `ghost`.
8. **Mobile first.** Base classes target a 360 px phone; add `sm:`/`md:`/`lg:` upward. Tap targets are at least 44 px tall (`h-11`/`min-h-11`).
9. **Accessibility.** `<Link>` for navigation, `<button>` for actions. Every interactive element gets a visible focus style (`focusRing` from `ui/styles.ts`); never `outline-none` on its own. Images get `alt`, plus `width`/`height` (or an aspect-ratio box) and `loading="lazy"` below the fold.
10. **Motion.** Animate only `transform` and `opacity`, keep it under 300 ms, and turn it off under `motion-reduce:`. No `transition-all`.
11. **Avoid:** carousels and auto-rotating sliders, gradient text, cards nested in cards, emoji as icons, scroll-triggered content that is invisible until animated.
12. **Dates** go through `src/lib/datetime.ts` (English, `en-GB`, visitor's time zone), never bare `toLocaleString()`.
13. **Images we host:** serve web-sized files (about 640–1280 px wide, WebP), not camera originals.
