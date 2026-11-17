# DESIGN.md · Native Ports

> If this file and the code disagree, the code wins until the person decides. Note the conflict under Open questions.

## Product
A curated, searchable directory of unofficial native ports of console games (static recompilation and native execution), built with Astro as a static site, bilingual EN / PT-BR. People use it on desktop, Steam Deck and phones. The catalog's main job: answer "is there a port of this game, for my console and device, how mature is it, and where is the code" on the first screen, in seconds. Full context in [PRODUCT.md](PRODUCT.md).

## Audience and voice
Players who own a console game and want to know whether a native port exists for their device, and developers following the recompilation scene. Mixed technical level: players may not know the jargon; developers do.
Voice: direct but friendly. Short sentences with a human touch ("Not stated yet — check the repo for updates."), no hype. English by default, Brazilian Portuguese at `/pt-br/`; dates and numbers formatted per locale.

## Mood
Words: nerdy, of the scene (feels like a tool the community made, not a product).
Never like: a game store (Steam, Epic), a gaming news blog, a landing page with gradients and a giant hero, "gamer" aesthetics with neon and RGB.

## Brand
Design system source: `src/styles/global.css`; the Paper guide (file "Native Ports", page "Guide") mirrors it, sync state in `design-sync.json` (29 tokens: three graphite surfaces, two hairlines, three inks, link blue, five tier colours, a six-step type scale, one motion duration and easing). Detailed spec and component rules: [docs/design-system.md](docs/design-system.md).
- Name: Native Ports. Wordmark: three stacked bars of decreasing length in the three ink strengths.
- Dark graphite, flat; saturated colour only for status tiers; link blue only for things that open or navigate.
- Fonts: Atkinson Hyperlegible for all UI; JetBrains Mono with tabular figures for data only.
- Icons: Lucide, 2px stroke.
- Must not imitate any port's, toolchain's, console maker's or publisher's branding.

## References
- RPCS3 compatibility list — take: the coloured tier ladder, the per-status count bar, table density, IDs in mono, last-updated date as a trust signal; avoid: weak visual hierarchy, the dated forum look, red as a tier.
- ProtonDB — take: the verdict at a glance (big tier at the top of a game page), search as the main entry point, counts of sources as proof, the per-device cut (Deck verified and the like); avoid: the store look, metal tier names, long pages of reports.

## Constraints
- Web, responsive: desktop (1360 px max column) down to phone; Steam Deck is a key device.
- WCAG 2.2 AA, full keyboard operation of search and filters, visible focus.
- Dark theme only (as built).
- Lucide icons. Motion: one 160 ms expo ease-out duration; zero under `prefers-reduced-motion`.
- Never host or link game files, ROMs, images, dumps, keys or firmware; the own-copy reminder and non-affiliation disclaimer are always visible.
- Status shown is only what each port's README declares; never upgraded or guessed.

## Decisions log
- 2026-11-16 — Moved from the Impeccable spec to this craft brief; the detailed spec lives in `docs/design-system.md` — keep the brief short, keep the rules.
- 2026-11-16 — No game cover art anywhere — the goal was recognition, not cards; covers read as a game store and are publisher artwork.
- 2026-11-16 — Voice is direct but friendly — the audience mixes players and developers.
- 2026-11-16 — The platform filter is the per-device cut; no per-device verdict on pages — it already answers "what runs on my device".
- 2026-11-16 — The game page leads with a big verdict (best tier), the first thing seen — the ProtonDB "verdict at a glance"; today it is a small block beside the title, so this is a pending design task.
- 2026-11-16 — Imported the design system into Paper: 25 tokens registered (--step--1 as --step-m1; --gutter, --measure, --ease, --dur shown as text), Tier block, Tier strip + legend, Chip, Button and Search drawn; the rest indexed as "in code only".

## Open questions
- Only one mood word was given ("nerdy / of the scene"); the older spec also implied dense and precise (assumed).
- Gaps found on import: tag (3px) and swatch (2px) radii and the spacing steps are hard-coded, not tokens; `::selection` uses a fixed #35558f; no control has a disabled state. Tokenise them?
- Proposed (drawn, not in code): a zero-count tier toggle, dimmed. Adopt it?
- PRODUCT.md lists the final domain as undecided, but README points to ports.matheusbrauna.com.br — is that settled?
