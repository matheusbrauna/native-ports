// Lists repositories from the scene's GitHub topics that are not in data/ports.json yet.
// It never edits the catalog: a person reads the README and decides what goes in.
// Repos reviewed and rejected go in data/discover-ignore.json so they stop coming back.
// Usage: npm run discover [-- --min-stars 5]
import { readFile } from "node:fs/promises";

const TOPICS = ["static-recompilation", "rexglue", "xenonrecomp", "n64recomp", "ps2recomp", "recompilation", "native-port"];
const args = process.argv.slice(2);
const minStars = Number(args[args.indexOf("--min-stars") + 1]) || 3;

const ports = JSON.parse(await readFile(new URL("../data/ports.json", import.meta.url), "utf8"));
const ignored = JSON.parse(await readFile(new URL("../data/discover-ignore.json", import.meta.url), "utf8"));
const known = new Set([...ports.map((p) => p.repo), ...ignored].map((r) => r.toLowerCase()));

const headers = { "User-Agent": "pc-ports-discover", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const found = new Map();
for (const topic of TOPICS) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(`topic:${topic} stars:>=${minStars} archived:false`)}&sort=updated&per_page=100`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.warn(`[discover] ${topic}: HTTP ${res.status}${res.status === 403 ? " (rate limited; set GITHUB_TOKEN)" : ""}`);
    continue;
  }
  const { items } = await res.json();
  for (const r of items) {
    if (known.has(r.full_name.toLowerCase())) continue;
    const entry = found.get(r.full_name) ?? { repo: r.full_name, stars: r.stargazers_count, pushed: r.pushed_at.slice(0, 10), description: r.description ?? "", topics: new Set() };
    entry.topics.add(topic);
    found.set(r.full_name, entry);
  }
}

const list = [...found.values()].sort((a, b) => b.stars - a.stars);
console.log(`# ${list.length} candidates not in the catalog (>= ${minStars} stars)\n`);
console.log("Check each README before adding: tools, lists, decompilations and emulators are out of scope.");
console.log("Add accepted repos to `data/ports.json` and rejected ones to `data/discover-ignore.json`.\n");
for (const c of list) {
  console.log(`- [ ] ${c.repo} (★${c.stars}, pushed ${c.pushed}) [${[...c.topics].join(", ")}]\n      ${c.description.slice(0, 160)}`);
}
