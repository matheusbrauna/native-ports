# Contributing

Thanks for helping keep the catalog accurate. Most contributions are a single entry in `data/ports.json`.

## What gets listed

- A **game port** built by static recompilation or native execution, or a fork that adds a platform, a game or a meaningful feature.
- With **commits of its own**; untouched forks are left out.
- **Source code only.** Repositories that ship game files, ROMs, disc images, firmware or keys are never listed.

Tools on their own (recompilers, SDKs), curated lists, decompilations, emulators and ports whose only target is another console or the browser are out of scope.

## Suggesting a port

The quickest way is the [submission form](../../issues/new?template=new-port.yml): paste the GitHub link. Within a day, the discover job checks whether the repo is already listed, has a model read its README, adds the drafted entry to its daily pull request and replies on the issue. The issue closes when a maintainer merges that pull request.

## Adding a port yourself

1. If the game is new, add it to `data/games.json` with its `console` (`xbox360`, `xbox`, `ps4`, `n64`, `wii`, `ps1`, `ps2`, `psp`, `32x`, `dreamcast`, `naomi2`).
2. Add the port to `data/ports.json`:

```json
{
  "slug": "example-recomp",
  "name": "Example Recompiled",
  "repo": "owner/repository",
  "upstream": null,
  "kind": "port",
  "technique": "recomp",
  "toolchain": "ReXGlue",
  "platforms": ["windows", "linux"],
  "graphics": ["Vulkan"],
  "games": [{ "id": "example-game", "tier": "playable", "source": "README: playable start to finish" }],
  "notes": { "en": "One or two sentences.", "pt-br": "Uma ou duas frases." }
}
```

- `tier` repeats what the project's README declares: `playable`, `ingame`, `intro`, `wip`, or `unrated` when it states nothing. Any tier other than `unrated` needs a `source` quoting the README.
- `kind` is `port` for standalone projects, `fork` for forks, `upstream` for a project others fork.
- Stars, last push, releases and archived state come from the GitHub API at build time; don't add them.

3. Run `npm run validate`. The same check runs on every pull request and must pass before merging.

## Discovering new ports

A daily workflow searches the scene's GitHub topics for repositories that are not catalogued yet:

1. `scripts/discover.mjs --apply` adds the obvious misses (tools, lists, emulators, rewrites, judged from the description) to `data/discover-ignore.json` with a reason.
   Open issues labelled `submission` are read too: each names one repository, skips the star minimum and the description filters, and is answered on the issue by `scripts/answer-submissions.mjs`.
2. `scripts/triage.mjs` has a language model read each remaining README (submissions first, outside the limit), up to `TRIAGE_LIMIT` a day (20 by default). It adds accepted ports to `data/ports.json`, rejected repos to `discover-ignore.json`, and holds anything it cannot settle in `data/discover-pending.json`. The code checks every draft entry and drops a tier whose quote is not in the README.
3. The changes arrive as one pull request, `discover/daily`, which a person reviews before merging. The remaining candidates and the pending repos are listed in the tracking issue labelled `discover`.

Both decision files hold `{ "repo": "owner/name", "reason": "..." }`. To settle a pending repo, move it to `ports.json` or `discover-ignore.json`. Running `npm run discover` locally prints the same list without changing anything.

The model step needs an OpenAI-compatible endpoint: the repository secrets `LLM_BASE_URL` (for example `https://host/v1`) and `LLM_API_KEY`, and the variable `LLM_MODEL`. Without them the step is skipped and submissions wait unanswered.

## Code changes

Run `npm run build:offline` and check the pages you touched in both languages (`/` and `/pt-br/`). The site follows the design system in `DESIGN.md`.

By contributing you agree that code is licensed under MIT and catalog data under CC BY 4.0.
