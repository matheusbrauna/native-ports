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
Design system source: `src/styles/global.css`; the Paper guide (file "Native Ports", page "Guide") mirrors it, sync state in `design-sync.json` (39 tokens: three graphite surfaces, two hairlines, three inks, link blue and its hover, on-tier ink, selection, five tier colours, two font stacks, a six-step type scale, three radii, a seven-step spacing scale, gutter, measure, one motion duration and easing). Detailed spec and component rules: [docs/design-system.md](docs/design-system.md).
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
- 2026-11-16 — The game page leads with a big verdict (best tier), the first thing seen — the ProtonDB "verdict at a glance"; today it is a small block beside the title, so this is a pending design task. Done 2026-11-17, see the verdict entries below.
- 2026-11-16 — Imported the design system into Paper: 25 tokens registered (--step--1 as --step-m1; --gutter, --measure, --ease, --dur shown as text), Tier block, Tier strip + legend, Chip, Button and Search drawn; the rest indexed as "in code only".
- 2026-11-16 — New tokens `--radius-hair` 2px, `--radius-tag` 3px, `--selection` #35558f (selected text now `--ink`) and the spacing scale `--space-xs…3xl` (6/8/12/16/28/48/64) — no loose values left to drift.
- 2026-11-16 — Spacing snapped to the scale, ties rounded down (7→6, 10→8, 11/13/14→12, 18/20/22→16, 24/30/32/36→28, 40/44→48) — the brief is dense; one scale beats tuned one-offs. Kept literal: values of 5px and under (hairline offsets), the 44px tree-guide indent and the baseline-alignment cell offsets.
- 2026-11-16 — One disabled rule: primary `--raised` fill + `--ink-3` text, ghost `--line` outline + `--ink-3`, no hover.
- 2026-11-16 — Zero-count tier toggles and chips dim (`--ink-3`, swatch 40%, chip loses its fill) but stay clickable; pressed wins — other filters can empty a pressed tier, and it must stay releasable.
- 2026-11-17 — Visual review of the spacing snap (37bb12a vs ebf9251, 8 pages at 1360, 1280 and 390 px): page heights moved −2% to +2% (Catalog −1.4%, ConsolePage +2% from its 11→12 cell padding), no new wrapping or horizontal overflow, tree guide, nav and legend negative-margin alignments intact, disabled/zero-count/focus states verified. No fixes needed.
- 2026-11-17 — Game-page verdict is a full-width band under the title and meta, before the lede (option B of two drawn; the side panel lost) — it keeps the title on one line even for the longest titles and reads as a table-width strip. On phone it is one panel: tier, meaning, counts, source (the order of option A, which the person asked to combine).
- 2026-11-17 — The verdict band shows the tier's one-line meaning, the count of ports declaring it with the tier strip and legend, and the declared source of the best-tier port ("Source · port"), clamped to two lines. No date: only 72 of 395 ports have GitHub facts, so a date would be missing on most pages.
- 2026-11-17 — With one port (84% of games) the band drops the counts cell and the strip: the tier already is that port's declaration. Strip and legend also hide when only one tier is present. Raw README table rows are never shown as a source.
- 2026-11-17 — New pieces, in code before the guide (Paper hit its weekly limit): `.tier.lg` (large tier block, step-3 label) and the Verdict band; no new tokens. Affects the 344 game pages in EN and PT-BR; the old `.summary` row is gone.

## Open questions
- The game-page verdict is in code but not yet drawn in the Paper guide (weekly limit, resets about 2026-11-20): draw Tier block · large and Verdict band with their stacked layouts, and empty the "Exploration · Game verdict (temporary)" page. The board "Guide · Proposed · Tokens & states" still carries "Proposed" in its name.
- 49 of 255 declared sources contain the word "playable" while the entry's tier is In-game (for example "README: Playable. Tested on Linux…" under In-game). Under a large tier block that can read as a contradiction: curate the data, label sources as quotes, or leave as is?
- Only one mood word was given ("nerdy / of the scene"); the older spec also implied dense and precise (assumed).
- PRODUCT.md lists the final domain as undecided, but README points to ports.matheusbrauna.com.br — is that settled?
