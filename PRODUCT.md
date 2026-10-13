# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output) deployed to GitHub Pages. A scheduled GitHub Actions build (daily + on push) refreshes repository metadata from the GitHub API. Client-side search and filtering with minimal vanilla JS; no UI framework.

## Users

- **Players** on Linux, Windows, macOS, Steam Deck, Android or ARM who own a PS4 game and want to know whether a native community port exists for their game and platform, how mature it is, and where its code lives.
- **Developers and contributors** following the bbport family of projects, looking for which forks are active, what each changes relative to upstream, and where to contribute.

Both arrive with a concrete question ("is there a Windows build of bbport?", "has anyone ported another game with this approach?") and want the answer in seconds, not after scrolling GitHub's fork list.

## Product Purpose

A curated, searchable directory of native PC ports derived from **bbport** ([deadinside28/bloodborne_pc](https://github.com/deadinside28/bloodborne_pc)), the unofficial community project that runs Bloodborne's original PS4 executable natively on PC (a game-specific runtime replacing PS4 system libraries, graphics translated to Vulkan). Within a week of release the project gathered 60+ forks, mostly empty, mixed in with real platform variants and ports of other games. This site separates the signal from the noise.

Success: a visitor finds the port matching their game and platform, understands its status, and reaches its repository, without opening GitHub's fork list.

## Positioning

The only index scoped to the bbport family: it distinguishes **platform variants** of the Bloodborne port (Windows, macOS/Metal, Android, ARM, input/translation forks) from **ports of other games** that reuse the approach (e.g. Yakuza / Ryu ga Gotoku, The Last Guardian), and it excludes forks with no real changes. Curated by hand, kept current by the GitHub API.

## Operating Context

- Entries live in a hand-curated `data/ports.json` (game, title ID, kind, platforms, graphics API, declared status, upstream, bilingual notes). New ports arrive through a GitHub issue template or pull request.
- Live repository facts (stars, last push, latest release, license, archived) are fetched at build time.
- Status shown for a port is the status its own README declares; the site never upgrades or invents it.

## Capabilities and Constraints

- Catalog with instant search and filters by game, platform, kind and status; filter state lives in the URL so a filtered view can be shared.
- Per-port detail page; "submit a port" page; build timestamp.
- Bilingual: English by default, Brazilian Portuguese alternate (`/pt-br/`).
- **The site never hosts or links game files, dumps, decryption keys or firmware.** It links source repositories only, and reminds players they need their own legally obtained dump.
- Not affiliated with Sony Interactive Entertainment, FromSoftware, Ryu Ga Gotoku Studio, genDESIGN, or any port author; this disclaimer is always visible.
- Undecided: final domain/repository name for the site.

## Brand Commitments

None yet. The site is a community index, not an official bbport property; it must not imitate bbport's or any publisher's branding.

## Evidence on Hand

- Upstream README (bbport v0.51, GPL-2.0): status "experimental, playable", tested mainly on Linux + AMD RX 7800 XT.
- GitHub fork network of `deadinside28/bloodborne_pc` (October 2026).
- No user counts, testimonials, benchmarks or download numbers exist for the directory itself; do not fabricate any.

## Product Principles

1. **Answer first.** The visitor's question (game × platform × status) is resolved on the first screen.
2. **Curated over complete.** An empty fork is noise; inclusion means a real change exists.
3. **Truth from the source.** Status and claims come from each project's own README and the GitHub API, dated.
4. **Legal hygiene is a feature.** Code links only; own-dump reminder and non-affiliation are part of the design, not fine print.
5. **Open to contribution.** Adding a port is one issue or PR away.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, full keyboard operation of search and filters, visible focus, `prefers-reduced-motion` respected. Bilingual interface.
