// Checks data/*.json before a merge, so a broken entry fails the PR instead of the deploy.
import { readFile } from "node:fs/promises";
import { checkGame, checkPort, checkDecision } from "./lib/schema.mjs";

const read = async (f) => JSON.parse(await readFile(new URL(`../data/${f}`, import.meta.url), "utf8"));
const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

const games = await read("games.json");
const ports = await read("ports.json");
const ignore = await read("discover-ignore.json");
const pending = await read("discover-pending.json");

// games.json
const gameIds = new Set();
for (const [i, g] of games.entries()) {
  const at = `games.json[${i}] ${g.id ?? "?"}`;
  for (const e of checkGame(g)) fail(at, e);
  if (gameIds.has(g.id)) fail(at, "duplicate id");
  gameIds.add(g.id);
}

// ports.json
const slugs = new Set();
const repos = new Set();
for (const [i, p] of ports.entries()) {
  const at = `ports.json[${i}] ${p.slug ?? "?"}`;
  for (const e of checkPort(p, gameIds)) fail(at, e);
  if (slugs.has(p.slug)) fail(at, "duplicate slug");
  slugs.add(p.slug);
  if (repos.has(p.repo?.toLowerCase())) fail(at, "this repository is already listed");
  repos.add(p.repo?.toLowerCase());
}

// discover-ignore.json and discover-pending.json: { repo, reason } each, a repo in at most one place.
const decided = new Map();
for (const [file, list] of [["discover-ignore.json", ignore], ["discover-pending.json", pending]]) {
  if (!Array.isArray(list)) {
    fail(file, "must be an array of { repo, reason }");
    continue;
  }
  for (const [i, d] of list.entries()) {
    const at = `${file}[${i}] ${d?.repo ?? "?"}`;
    for (const e of checkDecision(d)) fail(at, e);
    const key = d?.repo?.toLowerCase();
    if (repos.has(key)) fail(at, "this repository is already listed in ports.json");
    if (decided.has(key)) fail(at, `also in ${decided.get(key)}`);
    decided.set(key, file);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s) in data/:\n` + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}
console.log(`✓ data/ is valid: ${games.length} games, ${ports.length} ports, ${ignore.length} ignored and ${pending.length} pending repos`);
