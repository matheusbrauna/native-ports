# Native Ports

A curated catalog of unofficial native ports of console games: projects that run a game's own code as an ordinary program on PC, Mac, Linux, Steam Deck or mobile, instead of inside an emulator.

**Live site:** https://ports.matheusbrauna.com.br (English) · https://ports.matheusbrauna.com.br/pt-br/ (Português)

Two techniques are in scope:

- **Static recompilation**: the console's machine code is translated ahead of time into C/C++ and compiled into a native executable. Toolchains include ReXGlue and XenonRecomp (Xbox 360), N64Recomp (Nintendo 64) and PS2Recomp.
- **Native execution**: x86-64 console code (PS4) runs directly on PC on top of a runtime that replaces the console's system libraries, as [bbport](https://github.com/deadinside28/bloodborne_pc) does for Bloodborne.

Decompilations, emulators and standalone tools are out of scope. Every status shown is the one the project's own README declares.

> This site links source code only. It never hosts or links game files, ROMs, disc images, firmware or keys. Not affiliated with any console maker, publisher or port author.

## Add or update a port

Open an issue with the **Submit a port** template, or edit [`data/ports.json`](data/ports.json) in a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

Requires Node.js LTS.

```bash
npm ci
npm run dev          # local dev server
npm run validate     # check data/*.json
npm run build        # validate, refresh GitHub stats, build to dist/
npm run discover     # list GitHub topic repos not in the catalog yet
```

Without a `GITHUB_TOKEN`, `fetch` refreshes as many repositories as the anonymous API limit allows and keeps the cached data for the rest.

The site is an [Astro](https://astro.build) static build. GitHub Actions rebuilds it on every push to `main` and once a day, and deploys it to Cloudflare Workers ([`wrangler.jsonc`](wrangler.jsonc)). A second daily workflow refreshes the "Port candidates" issue from GitHub topics.

## License

- Code: [MIT](LICENSE).
- Catalog data in [`data/`](data/): [CC BY 4.0](data/LICENSE.md).
