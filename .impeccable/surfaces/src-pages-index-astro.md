---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/ports/[slug].astro","src/pages/submit.astro"]
---

## Scope

Catalog site for bbport-derived native ports: index (catalog), per-port detail, submit page; EN at `/`, PT-BR at `/pt-br/`. Visitor mode: **Operate** (search, filter, reach the repo).

## Audience and job

Players and contributors asking "is there a port of game X for platform Y, how mature is it, where is the code?" Answer on the first screen. Proof = the curated entries themselves plus GitHub-fetched facts, dated. Constraints: code links only, own-dump reminder, non-affiliation always visible, status only as each README declares it.

## Direction contract

THESIS: The scene's own reference format, the emulator compatibility list: one dense sortable row per port, status as a coloured tier. It refuses the category default of a centred hero search over a grid of soft dark cards.

OWN-WORLD: Dark graphite workspace (ground #16181d, panels #1d2027, raised #22262e, hairlines #2c313a), cool off-white ink #e6e8ec, secondary ink tinted #a7afbd. Tier colours carry status only, in the compat-list ladder (green Playable #3ecf6e, yellow In-game #f2c94c, orange Intro #f2994a, as RPCS3/Dolphin order them), plus violet In progress #b195f5 (kept off the link hue) and outlined grey Not stated (PRODUCT: truth from the source). Archived is a neutral tag, not a tier. Pressed filters use the raised panel, never link blue. Link blue #7aa5ff only on things that open. Atkinson Hyperlegible for UI; JetBrains Mono only for data (repo slugs, title IDs, counts, dates) with tabular figures. Square-ish 4px corners, no cards-as-structure, no coloured side borders.

STORY: Visitor sees how many ports exist per game and tier, narrows by game, platform and tier, scans rows, opens a repo or the detail page; finds how to submit a missing port.

FIRST VIEWPORT: 60px top bar: wordmark, Catalog / Submit / About, EN·PT switch. Below: full-width search input, then filter row (game select chips, platform chips, tier chips) with result count. Then the tier strip, then the table grouped by game (game header rows replace a Game column): Port (name + repo slug on one line, one-line note), Platforms, Graphics (folded into the platform line below 1080px), Tier, Stars, Last push; at least 7 rows in a 1440x900 first viewport; upstream bbport row pinned first and marked "upstream". Sortable headers. Empty state with submit link.

FORM: The Compatibility List, the model's own top-ranked grounded candidate (pick card, chosen by the user over the rolled Specimen Cabinet, which held position 7). The direction roll ran and is recorded in .impeccable/questions/roll.json; this CLI build printed no SEED REFERENCE line, so no reference is available to cite. seed: none (unavailable)

Signature move: the tier strip, a stacked horizontal bar of tier counts for the current filter whose segments are buttons that toggle that tier; each game group header repeats a mini strip. Status cells are filled tier blocks. Archived or vanished repos stay listed, dimmed, tagged Archived. Motion: 160ms ease-out on strip segment width and row filtering, one duration everywhere; reduced motion = instant.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

Final domain and repository name; final curated list awaits user review.
