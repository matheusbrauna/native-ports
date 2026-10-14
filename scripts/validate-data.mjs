// Checks data/*.json before a merge, so a broken entry fails the PR instead of the deploy.
// Allowed values mirror src/lib/catalog.ts; update both together.
import { readFile } from "node:fs/promises";

const CONSOLES = ["ps4", "xbox360", "xbox", "n64", "wii", "ps1", "ps2", "psp", "32x", "dreamcast", "naomi2"];
const PLATFORMS = ["linux", "steamdeck", "windows", "macos", "android", "ios", "arm"];
const TIERS = ["playable", "ingame", "intro", "wip", "unrated"];
const KINDS = ["upstream", "fork", "port"];
const TECHNIQUES = ["recomp", "runtime"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REPO = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;

const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const isStr = (v) => typeof v === "string" && v.trim().length > 0;

const games = await read("games.json");
const ports = await read("ports.json");
const ignore = await read("discover-ignore.json");

// games.json
const gameIds = new Set();
for (const [i, g] of games.entries()) {
  const at = `games.json[${i}] ${g.id ?? "?"}`;
  if (!isStr(g.id) || !SLUG.test(g.id)) fail(at, "id must be a lowercase slug (a-z, 0-9, hyphens)");
  if (gameIds.has(g.id)) fail(at, "duplicate id");
  gameIds.add(g.id);
  if (!isStr(g.title)) fail(at, "title is required");
  if (!CONSOLES.includes(g.console)) fail(at, `console must be one of ${CONSOLES.join(", ")}`);
  if (!Array.isArray(g.titleIds) || !g.titleIds.every(isStr)) fail(at, "titleIds must be an array of strings");
}

// ports.json
const slugs = new Set();
const repos = new Set();
for (const [i, p] of ports.entries()) {
  const at = `ports.json[${i}] ${p.slug ?? "?"}`;
  if (!isStr(p.slug) || !SLUG.test(p.slug)) fail(at, "slug must be a lowercase slug (a-z, 0-9, hyphens)");
  if (slugs.has(p.slug)) fail(at, "duplicate slug");
  slugs.add(p.slug);
  if (!isStr(p.name)) fail(at, "name is required");
  if (!REPO.test(p.repo ?? "")) fail(at, 'repo must look like "owner/name"');
  if (repos.has(p.repo?.toLowerCase())) fail(at, "this repository is already listed");
  repos.add(p.repo?.toLowerCase());
  if (p.upstream !== null && !REPO.test(p.upstream ?? "")) fail(at, 'upstream must be null or "owner/name"');
  if (!KINDS.includes(p.kind)) fail(at, `kind must be one of ${KINDS.join(", ")}`);
  if (!TECHNIQUES.includes(p.technique)) fail(at, `technique must be one of ${TECHNIQUES.join(", ")}`);
  if (p.toolchain !== null && !isStr(p.toolchain)) fail(at, "toolchain must be null or a string");
  if (!Array.isArray(p.platforms) || !p.platforms.every((x) => PLATFORMS.includes(x))) fail(at, `platforms may only contain ${PLATFORMS.join(", ")}`);
  if (!Array.isArray(p.graphics) || !p.graphics.every(isStr)) fail(at, "graphics must be an array of strings");
  if (!Array.isArray(p.games) || p.games.length === 0) fail(at, "games must list at least one game");
  for (const g of p.games ?? []) {
    if (!gameIds.has(g.id)) fail(at, `game "${g.id}" is not in data/games.json`);
    if (!TIERS.includes(g.tier)) fail(at, `tier must be one of ${TIERS.join(", ")}`);
    if (g.source !== null && !isStr(g.source)) fail(at, "source must be null or a string quoting the README");
    if (g.tier !== "unrated" && g.source === null) fail(at, `tier "${g.tier}" needs a source quoting the project's README`);
  }
  if (!isStr(p.notes?.en) || !isStr(p.notes?.["pt-br"])) fail(at, 'notes need both "en" and "pt-br"');
}

// discover-ignore.json
if (!Array.isArray(ignore) || !ignore.every((r) => REPO.test(r))) fail("discover-ignore.json", 'must be an array of "owner/name"');
for (const r of ignore) if (repos.has(r.toLowerCase())) fail("discover-ignore.json", `${r} is both listed and ignored`);

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) in data/:\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ data/ is valid: ${games.length} games, ${ports.length} ports, ${ignore.length} ignored repos`);
