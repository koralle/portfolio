# Portfolio Design Refinement

## Goal

Refine koralle's Astro portfolio so the first impression is unmistakably **brand-forward (koralle / seal personality)**, while hiring-oriented proof (skills, projects, contact) remains easy to find. Keep the existing visual identity and polish composition, hierarchy, motion, and accessibility. When visual polish conflicts with accessibility, **accessibility wins**.

## Decisions

| Topic | Decision |
| --- | --- |
| Primary goals | Brand/personality (B) weighted over hiring (A); both in scope |
| Visual identity | Keep dark base, pink accent `#ec93a1`, Rounded M Plus 1c, Mugicha |
| Approach | Brand-first composition + clearer proof path (Craft + IA), not surface-only polish and not heavy scroll storytelling |
| Hero layout | Brand-first full-bleed: `koralle` as hero-level signal; Mugicha as dominant edge-to-edge visual plane |
| Content system | Keep MDX-driven home sections; strengthen Projects frontmatter shape |
| Out of scope | Full rebrand, fake project content, immersive scroll narrative |

## Page narrative

Single-page story in this order:

1. **Hero** — brand and personality land immediately
2. **About** — short stance / values (not a tech laundry list)
3. **Skills** — scannable capability map for hiring readers
4. **Projects** — primary trust surface; structure first, real content when ready
5. **Contact + Footer** — clear outreach; footer no longer forced to full viewport height

### Navigation

- Light in-page anchor nav: About / Skills / Projects / Contact
- Language switcher reachable near the top (not footer-only)
- Skip link to `#main-content`

## Hero

### Content budget (first viewport)

- Brand name `koralle` as the strongest signal (not only nav/eyebrow text)
- One short greeting / lead line (seal + front-end)
- One supporting sentence bridging to craft values
- CTA group: primary **Projects**, secondary **Contact** (in-page anchors)
- One dominant Mugicha visual — no cards, badges, chips, or promo stickers over the hero

### Atmosphere

- Base `#1a1a1a` with a subtle pink radial wash (avoid flat single-color emptiness)
- Desktop: copy on the readable side; Mugicha dominates toward the opposite edge / background plane
- Mobile: brand + copy first; Mugicha below or recessed so text contrast stays primary

### Motion

- Keep Loader → Hero GSAP sequence
- Choreography: brand → lead → Mugicha/CTA
- `prefers-reduced-motion: reduce`: no SplitText character choreography; short fade or immediate show

## Mid sections

### Shared rules

- Keep alternating section tones (`#1a1a1a` / `#212121`)
- Each section: one heading, one short lead, then body
- Prose measure ~960px; project media rows may widen slightly

### About

- Short MDX prose about accessible UI, interaction quality, and maintainable front-end craft
- Move stack lists to Skills

### Skills

- No decorative cards
- Grouped scannable lists (e.g. Front-end / Accessibility & UX / Delivery)
- Dense enough to scan in seconds

### Projects

Split section chrome from items:

- Home MDX entry `section: projects` keeps **title + lead + tone** only
- Add a `projects` content collection for items, with required frontmatter:
  - `locale`, `title`, `summary`, `tags` (string array), `links` (label + href), `order`
  - optional `image`
- Present items as **row-based case entries** (interactive link containers allowed)
- Avoid decorative card grids
- If the collection is empty for the active locale: honest “準備中 / coming soon” — no fabricated case studies
- Deeper multi-page case studies are out of scope; listing rows are enough for this pass

### Contact / Footer

- Contact: invitation copy
- Footer: GitHub, X, language switcher, copyright
- Remove full-viewport footer height; size to content
- Fix invalid footer id (`id="#footer"` → `id="footer"`)

## Accessibility requirements

- Contrast: body, links, and pink headings checked to WCAG AA; if primary pink fails, raise lightness and/or limit pink to large heading text
- Visible focus rings on all interactive controls
- Skip link to main content
- `prefers-reduced-motion` honored for Loader and Hero
- Decorative Mugicha may keep empty `alt`; meaningful images need descriptive `alt`
- Correct landmarks and section ids; language switcher keeps `aria-current` for the active locale

## Design tokens (Panda)

Introduce semantic tokens instead of scattered hex where practical:

- Surfaces: `bg.base`, `bg.raised`
- Text: `text`, `text.muted`
- Brand: `primary` (and `primary.accessible` if a contrast-safe variant is needed)
- Shared spacing, max-width, and focus color tokens

Font family remains Rounded M Plus 1c.

## Motion inventory (intentional, limited)

1. Loader entrance (existing, reduced-motion safe)
2. Hero reveal sequence (brand → copy → visual/CTA)
3. Subtle scroll entrance for section headings only — no heavy parallax or scroll-jacking

All three respect `prefers-reduced-motion: reduce` (skip choreography; keep content visible).

## Architecture notes (implementation boundaries)

- Keep Astro + Panda CSS + GSAP + MDX content collections
- Prefer evolving `Hero`, `ContentSection` / section rendering, `Footer`, `Layout`, `content.config.ts`, and `panda.config.ts`
- Add a dedicated Projects list component fed by the `projects` collection; wire it from the home projects section path
- Unused stub section components (`About.astro`, `Projects.astro`, `Skills.astro`, `GetInTouch.astro` that are not on the page path) stay untouched in this pass unless deleting them is required to avoid confusion
- i18n (`src/i18n`, locale routes) stays; copy refinements may touch `ui.ts` and home MDX entries
- Anchor nav + skip link live in `Layout` (or a small header component introduced for that purpose)

## Success criteria

- Removing the nav still leaves an obvious koralle brand in the first viewport
- A hiring reader can reach Skills / Projects / Contact without hunting
- No known AA contrast or keyboard regressions introduced by the polish
- Reduced-motion users get a complete, non-broken experience
- Projects can be filled later via MDX without another layout redesign

## Non-goals

- Purple/glow/dark-mode trend restyle unrelated to the current brand
- Replacing Rounded M Plus or retiring Mugicha
- Building a multi-page case-study system in this pass
- Inventing project portfolio entries without real work to show
