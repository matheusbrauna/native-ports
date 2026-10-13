---
name: Native Ports
description: A dense, sortable compatibility list of unofficial native ports of console games, with status shown as coloured tiers.
colors:
  ground: "#16181d"
  panel: "#1c1f26"
  raised: "#23272f"
  line: "#2c313a"
  line-strong: "#3b414c"
  ink: "#e6e8ec"
  ink-2: "#b3bac6"
  ink-3: "#8d96a5"
  link: "#82acff"
  link-hover: "#a9c5ff"
  on-tier: "#101216"
  tier-playable: "#3ecf6e"
  tier-ingame: "#f2c94c"
  tier-intro: "#f2994a"
  tier-wip: "#b195f5"
  tier-unrated: "#4a515d"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.15
  body-lg:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  tag:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.92em"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  hair: "2px"
  tag: "3px"
  control: "4px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "28px"
  2xl: "48px"
  gutter: "clamp(16px, 3vw, 32px)"
components:
  button-primary:
    backgroundColor: "{colors.link}"
    textColor: "{colors.on-tier}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "38px"
  button-primary-hover:
    backgroundColor: "{colors.link-hover}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "38px"
  button-ghost-hover:
    backgroundColor: "{colors.raised}"
  input-search:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "46px"
  select:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 32px 0 12px"
    height: "36px"
  chip:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "32px"
  chip-pressed:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
  tier-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 10px 0 8px"
    height: "30px"
  tier-toggle-pressed:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
  tier-block-playable:
    backgroundColor: "{colors.tier-playable}"
    textColor: "{colors.on-tier}"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
  tier-block-ingame:
    backgroundColor: "{colors.tier-ingame}"
    textColor: "{colors.on-tier}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
  tier-block-intro:
    backgroundColor: "{colors.tier-intro}"
    textColor: "{colors.on-tier}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
  tier-block-wip:
    backgroundColor: "{colors.tier-wip}"
    textColor: "{colors.on-tier}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
  tier-block-unrated:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.tag}"
    padding: "2px 8px"
  flag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.tag}"
    rounded: "{rounded.tag}"
    padding: "1px 6px"
  flag-upstream:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.on-tier}"
    typography: "{typography.tag}"
    rounded: "{rounded.tag}"
    padding: "1px 6px"
  nav-link:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "6px 10px"
  nav-link-hover:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
---

# Design System: Native Ports

## Overview

**Creative North Star: "The Compatibility List"**

The site speaks the emulator scene's own reference format: one dense, sortable row per port on a dark graphite workspace, with status carried by a coloured tier block. Its job is to answer "game, platform, status, where is the code" on the first screen, so the system favours row density, legible small type and tabular data over atmosphere. Structure comes from hairline rules and tonal steps of the same graphite, never from floating cards.

Colour is almost entirely neutral. The five tier hues are the only saturated colour in the interface and they mean exactly one thing: the status a port's own README declares. Link blue is the second voice and marks things that take you somewhere. Everything else is graphite ink at three strengths.

The signature is the tier strip: a stacked horizontal bar of tier counts for the current filter, paired with a legend of tier toggles, repeated as a small strip beside each game's group header. Status cells in rows are filled tier blocks; an undeclared status is an outline, not a colour.

**Key Characteristics:**
- Dark graphite ground with two tonal steps (panel, raised) and two hairline strengths; flat, no outer shadows.
- Status-only colour: the tier ladder green, yellow, orange, violet, outlined grey.
- Atkinson Hyperlegible for all UI; JetBrains Mono with tabular figures only for data.
- Table rows grouped by game header rows; hairlines separate rows; row hover is a panel tint.
- Square-ish 4px controls, 3px tags, pill shape reserved for filter chips.
- One motion duration (160ms, expo ease-out); reduced motion makes it instant.

## Colors

A graphite neutral field where saturated colour is rationed to status and navigation.

### Primary
- **Signal Blue** (link): links, the primary button, the current-page underline in the top bar, the focus ring and the text caret. It marks things that open or navigate. **Pale Signal Blue** (link-hover) is its hover state.

### Status (tier ladder)
- **Playable Green** (tier-playable): filled tier block, strip segment and swatch for ports that declare themselves playable.
- **In-game Yellow** (tier-ingame): reaches gameplay with problems.
- **Intro Orange** (tier-intro): reaches intro or menus only.
- **In-progress Violet** (tier-wip): work in progress; violet is chosen to stay clear of the link hue.
- **Not-stated Slate** (tier-unrated): strip segment and swatch for ports with no declared status. In a row, the not-stated block is an outline, not this fill.
- **Tier Ink** (on-tier): near-black text on any filled tier block, the primary button and the upstream flag.

### Neutral
- **Graphite Ground** (ground): page background, top bar, sticky table header.
- **Graphite Panel** (panel): inputs, chips at rest, row hover, the strip track, callout boxes and code blocks.
- **Graphite Raised** (raised): the pressed state of chips and tier toggles, ghost-button hover.
- **Hairline** (line): row separators, top bar and footer rules.
- **Strong Hairline** (line-strong): control outlines (drawn as 1px inset), table header and group-header rules.
- **Paper Ink** (ink): primary text, port names, headings.
- **Secondary Ink** (ink-2): supporting copy, platform, graphics and toolchain cells, filter labels, flags.
- **Tertiary Ink** (ink-3): notes, title IDs, column headers, counts inside chips, footer, placeholder text.

### Named Rules
**The Status-Only Colour Rule.** The five tier colours appear only on tier blocks, strip segments and legend swatches. Never use them for decoration, buttons, links or emphasis.

**The Pressed-Is-Raised Rule.** A pressed filter (chip or tier toggle) shows the raised graphite, a stronger outline and bold text. It is never link blue and never tier-coloured.

**The Blue Opens Rule.** Link blue is for things that navigate or open (links, primary button, current-page marker) plus the focus ring. If clicking it does not take you somewhere, it is not blue.

## Typography

**Body Font:** Atkinson Hyperlegible (with system-ui, sans-serif), weights 400 and 700
**Data Font:** JetBrains Mono (with ui-monospace, monospace), weights 400 and 600

**Character:** A legibility-first humanist sans does all the talking; a monospace with tabular figures appears only where the content is machine-shaped (repo slugs, title IDs, counts, stars, dates, licence identifiers, code).

### Hierarchy
- **Display** (700, 2.5rem, 1.15, -0.02em): the port name on a detail page; drops to headline size below 900px.
- **Headline** (700, 1.875rem, 1.15, -0.01em): page titles on the catalog, Submit and About; drops to title size on the catalog below 760px.
- **Title** (700, 1.375rem, 1.15): game group headers in the table and section heads in prose pages.
- **Body large** (400, 1.0625rem, 1.5): result count (in bold), search input text, ledes, the brand wordmark.
- **Body** (400, 0.9375rem, 1.5): default text and port names (bold). Prose capped at a 68ch measure.
- **Label** (400 or 700, 0.8125rem, 1.5): column headers, chips, tier toggles, tier blocks (bold), table cells for platforms, graphics, toolchain and numbers, notes, footer.
- **Tag** (700, 0.75rem, uppercase, 0.06em): the state flags Upstream, Archived, Unavailable only.
- **Data** (JetBrains Mono, 0.92em of context, tabular figures): repo slugs, title IDs, counts, stars, relative ages, dates, licence, code blocks.

### Named Rules
**The Mono-Is-Data Rule.** JetBrains Mono is only for values a machine produced or a user might copy. Never for headings, labels or prose.

**The Tabular Numbers Rule.** Every number in a column or count uses the data face with tabular figures, right-aligned in table columns.

## Layout

A single 1360px max-width column with a fluid gutter (16px to 32px). The catalog stacks top bar (60px), title and one-line intro, full-width search, a wrapping filter row (console, game and technique selects, platform chips, reset), the status block (count and tier legend on one line, full-width strip beneath), then the table.

The table is fixed-layout: Port takes the remaining width, Runs on (platforms, with graphics API as a muted second line) and Toolchain 15% each, Tier 120px, Stars 84px, Last push 112px. Rows are grouped per game by a header row (title, original console in bold secondary ink, title IDs in mono, a count badge, the mini strip pushed right), which replaces a Game column. The column header is sticky. Cells pad 8px 12px; rows are separated by a hairline, not spacing.

Responsive behaviour, in order: below 1080px the Toolchain column folds into a muted line of the Runs on cell; below 900px the detail page's two columns (games table, facts list at 340px) stack; below 760px the game select spans the filter row with console and technique side by side under it, and the catalog table becomes stacked rows (port line, then tier / stars / last push, then platforms), sortable headers become a horizontally scrolling "sort by" row, platform chips scroll horizontally and the legend moves under the strip; below 720px the top-bar navigation wraps to its own row and the language switch shows only its code; below 560px detail tables and the tier definition list stack.

Spacing runs on small steps (6, 8, 12, 16px) inside controls and rows, with larger steps (28px top padding, 48px column gaps and empty-state padding, 64px above the footer) between regions.

### Named Rules
**The Row-Is-The-Unit Rule.** Content is organised as rows on hairlines, grouped by header rows. Do not wrap entries in cards.

## Elevation & Depth

The workspace is flat. Depth is conveyed by three tonal steps of graphite (ground, panel, raised) and by hairlines. Box-shadow is used only as an inset 1px (or 2px for focus) outline in place of a border, and as an inset 2px bottom bar for the current navigation item. There are no outer, ambient or offset shadows.

### Shadow Vocabulary
- **Control outline** (`box-shadow: inset 0 0 0 1px var(--line-strong)`): search, select, chips, ghost button, language switch, pressed tier toggle, outlined tier block, flags.
- **Pressed chip outline** (`box-shadow: inset 0 0 0 1px var(--ink-3)`): pressed platform chip.
- **Focus-within outline** (`box-shadow: inset 0 0 0 2px var(--link)`): the search field while focused.
- **Current page bar** (`box-shadow: inset 0 -2px 0 var(--link)`): active top-bar link.

### Named Rules
**The Flat Workspace Rule.** Nothing floats. If a surface needs separation, step the graphite tone or draw a hairline.

## Shapes

Square-ish and quiet. Controls, buttons, inputs, nav items and callouts use a 4px radius; small inline marks (tier blocks, flags, the strip, count badges) use 3px; swatches and the mini strip 2px. The pill shape is reserved for platform filter chips. Strip segments are separated by 2px gaps inside a clipped track. Icons are Lucide stroke icons inlined as SVG at 2px stroke, 12 to 18px. The wordmark is three stacked bars of decreasing length in the three ink strengths, a miniature of the list itself.

## Components

### Buttons
- **Shape:** gently squared (4px), 38px tall, 14px side padding, bold body text, optional 14 to 15px leading icon.
- **Primary:** Signal Blue fill with Tier Ink text; used for "Open repository" and "Submit a port". Hover lightens to Pale Signal Blue over 160ms.
- **Ghost:** transparent with a strong-hairline inset outline and Paper Ink text; hover fills with Graphite Raised. Used for release tags and "Clear filters" in the empty state.
- **Focus:** global 2px Signal Blue outline, 2px offset.

### Chips
- **Style:** pill, 32px tall, Graphite Panel fill, strong-hairline inset outline, Secondary Ink label text with a tertiary-ink mono count.
- **State:** hover raises to Graphite Raised with Paper Ink text. Pressed (`aria-pressed`) uses Graphite Raised, a Tertiary Ink outline, bold text and a Paper Ink count. Multiple chips may be pressed.

### Inputs / Fields
- **Search:** full-width, 46px, Graphite Panel with a strong-hairline inset outline, 18px search icon in Tertiary Ink, body-large text. Focus-within thickens the outline to 2px Signal Blue and lifts the icon to Secondary Ink.
- **Select:** 36px, Graphite Panel, inset outline, custom chevron, label text beside it in Secondary Ink.

### Navigation
- **Top bar:** 60px, ground background, hairline bottom rule. Wordmark left; nav links in Secondary Ink with 6px 10px padding and a panel-tint hover; the current page is Paper Ink with a 2px Signal Blue bottom bar and square corners. The language switch is an outlined 4px box with a mono code (EN / PT) and the language name, which hides below 720px.
- **Footer:** hairline top rule, Tertiary Ink label text, carries the no-files notice, the non-affiliation disclaimer and the data timestamp, always visible.

### Tier Block (signature)
Filled 3px block, 2px 8px padding, bold label text in Tier Ink on the tier colour. Not-stated is transparent with a strong-hairline outline and Secondary Ink text. Used in catalog rows and the detail page's games table, with the declared source as its title.

### Tier Strip and Legend (signature)
A 14px full-width stacked bar on a panel track, one segment per tier, each grown in proportion to its count for the current filter and animated on `flex-grow` over 160ms. Clicking a segment toggles that tier. When any tier is filtered, unselected segments fade to 28% opacity. The legend beside it is a row of tier toggles (30px, 10px swatch, label, mono count) that are the keyboard-accessible filter; pressed toggles use Graphite Raised with an inset outline and bold text. Each game group header repeats a 120px by 6px mini strip (72px on mobile), display only.

### Catalog Row
Port name (bold, Paper Ink, underlined Pale Signal Blue on hover) followed on the same line by flags and the repo slug in mono Signal Blue with a 12px external icon; beneath, a one-line Tertiary Ink note (two lines on mobile). Row hover tints to Graphite Panel. Archived or unavailable ports stay listed with name and note dimmed to Tertiary Ink and a flag.

### Flags
Uppercase tag text, 1px 6px padding, 3px radius. Default is outlined Secondary Ink (Archived, Unavailable). Upstream is filled Secondary Ink with Tier Ink text. Flags describe repository state, never status.

### Empty State
Inside the table area: a bold body-large title, a Secondary Ink sentence, then a ghost "Clear filters" button and a primary "Submit a port" button.

## Do's and Don'ts

### Do:
- **Do** keep status colour on tier blocks, strip segments and swatches only, in the ladder order Playable, In-game, Intro, In progress, Not stated.
- **Do** show an undeclared status as an outlined block, never a guessed colour.
- **Do** separate rows and regions with hairlines (line for rows, line-strong for headers and controls) and tonal steps of graphite.
- **Do** set every slug, title ID, count, star total and date in JetBrains Mono with tabular figures.
- **Do** mark pressed filters with Graphite Raised, an inset outline and bold text.
- **Do** use the single 160ms duration with the expo ease-out (cubic-bezier(0.16, 1, 0.3, 1)) for every transition, and zero it under reduced motion.
- **Do** keep the no-files notice and non-affiliation disclaimer in the footer of every page.

### Don't:
- **Don't** use tier colours for anything but status, and don't introduce a sixth tier; Archived is a flag, not a tier.
- **Don't** colour pressed filters or toggles link blue.
- **Don't** wrap entries in cards or use cards as layout structure.
- **Don't** use outer, ambient or offset drop shadows; inset outlines only.
- **Don't** add coloured side borders to rows or callouts.
- **Don't** set headings, labels or prose in the monospace.
- **Don't** imitate bbport's or any publisher's branding.
