# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output) deployed to GitHub Pages. A scheduled GitHub Actions build (daily + on push) refreshes repository metadata from the GitHub API. Client-side search and filtering with minimal vanilla JS; no UI framework.

## Users

- **Players** on Windows, Linux, Steam Deck, macOS, Android or iOS who own a console game and want to know whether an unofficial native port exists for their game and device, how mature it is, and where its code lives.
- **Developers and contributors** following the recompilation and native-execution scene (ReXGlue, XenonRecomp, N64Recomp, bbport and others), looking for which projects are active and where to contribute.

Both arrive with a concrete question ("is there a native port of Forza Horizon?", "what runs on the Steam Deck?", "which Xbox 360 games have been recompiled?") and want the answer in seconds, not after searching GitHub topics and forum threads.

## Product Purpose

**Native Ports** is a curated, searchable directory of unofficial native ports of console games: projects that run a game's own code as an ordinary program instead of inside an emulator. Two techniques are in scope:

- **Static recompilation:** the console's machine code (PowerPC, MIPS, x86, SH-4…) is translated ahead of time into C/C++ and compiled into a native executable, with a runtime standing in for the console's hardware. Examples: Forza Horizon via ReXGlue, Sonic Unleashed via XenonRecomp, Majora's Mask via N64Recomp.
- **Native execution:** x86-64 console code (PS4) runs directly on the PC with a runtime replacing the console's system libraries. Example: bbport (Bloodborne) and its forks.

The site started as an index of bbport forks and grew to the whole scene in October 2026. Success: a visitor finds the port matching their game, console and device, understands its status, and reaches its repository.

## Positioning

A catalog scoped to native ports only, organized by original console, technique and toolchain, with each project's own declared status and live repository activity. It separates real game ports from the tools, lists, empty forks and research repos that share the same GitHub topics.

## Operating Context

- Games live in `data/games.json` (title, original console, title IDs); ports in `data/ports.json` (repo, technique, toolchain, kind, platforms, graphics API, declared status per game with its source, upstream, bilingual notes). New ports arrive through a GitHub issue template or pull request.
- `npm run discover` lists repositories from the scene's GitHub topics that are not catalogued yet; a person reads each README before adding it. Nothing is published automatically.
- Live repository facts (stars, last push, latest release, license, archived) are fetched at build time.
- Status shown for a port is the status its own README declares; the site never upgrades or invents it. Mature releases that never state a status show "Not stated".

## Capabilities and Constraints

- Catalog with instant search and filters by console, game, technique, platform and status; filter state lives in the URL so a filtered view can be shared.
- Per-port detail page; About page explaining the techniques; Submit page; build timestamp.
- Bilingual: English by default, Brazilian Portuguese alternate (`/pt-br/`).
- **Out of scope:** decompilations (hand-rewritten source), emulators, recompilation tools on their own, curated lists, ports whose only target is another console or the browser.
- **The site never hosts or links game files, ROMs, disc images, dumps, decryption keys or firmware.** It links source repositories only, and reminds players they need their own legally obtained copy.
- Not affiliated with any console maker, publisher or developer, or with any port author; this disclaimer is always visible.
- Undecided: final domain and repository name for the site.

## Brand Commitments

Name: **Native Ports** (chosen by the user, October 2026). The site is a community index; it must not imitate any port's, toolchain's, console maker's or publisher's branding.

## Evidence on Hand

- READMEs and GitHub topics (`static-recompilation`, `rexglue`, `n64recomp`, `recompilation`) surveyed in October 2026; statuses in `data/ports.json` cite their README source.
- bbport README (v0.51, GPL-2.0): "experimental, playable".
- No user counts, testimonials, benchmarks or download numbers exist for the directory itself; do not fabricate any.

## Product Principles

1. **Answer first.** The visitor's question (game × console × device × status) is resolved on the first screen.
2. **Curated over complete.** A tool, a list or an empty fork is noise; inclusion means a playable-or-progressing game port exists.
3. **Truth from the source.** Status and claims come from each project's own README and the GitHub API, dated.
4. **Legal hygiene is a feature.** Code links only; own-copy reminder and non-affiliation are part of the design, not fine print.
5. **Open to contribution.** Adding a port is one issue or PR away.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, full keyboard operation of search and filters, visible focus, `prefers-reduced-motion` respected. Bilingual interface.
