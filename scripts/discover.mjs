// Lists repositories from the scene's GitHub topics that are not in data/ports.json yet.
// It never edits the catalog: a person reads the README and decides what goes in.
// Repos reviewed and rejected go in data/discover-ignore.json so they stop coming back.
// Candidates are grouped by what their description and topics suggest; the groups are a
// reading aid, not a verdict, since the "native-port" topic covers decompilation-based
// ports and rewrites as well as native-execution runtimes.
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

// Order matters: the first group whose pattern matches wins. Tools and rewrites are judged on the
// name and description only; a decompilation also shows up in topics.
const GROUPS = [
  { id: "tool", title: "Likely tools, lists or emulators (out of scope)", re: /\b(awesome|curated|catalog(ue)?|directory|list of|tool for|manager for|skill|emulator|recompiler|recompilation framework)\b/i, topics: false },
  { id: "rewrite", title: "Likely reimplementations or rewrites (out of scope)", re: /\b(clean-room|reimplementation|rewrite|rewritten|from-scratch)\b/i, topics: false },
  { id: "decomp", title: "Likely built from a decompilation (check the README: out of scope unless it also recompiles the binary)", re: /\b(decomp\w*|matching|disasm|source[ -]port)\b/i, topics: true },
];
// "Not an emulator" and "built with the X recompiler" describe ports; drop them before matching.
const NEGATED = [/\b(not|no|without)\b[^.:;]{0,40}?\b(emulator|emulation|recompilation)\b/gi, /\b(with|using|on|via|by) (the |an? )?[\w-]+ (static )?recompiler\b/gi];
// A game recompiled with a known toolchain stays with the ports even if it mentions a decompilation.
const RECOMP = /\b(static(ally)?[ -]recompil\w*|rexglue|xenonrecomp|n64recomp|ps2recomp|recompone)\b/i;

const groupOf = (c) => {
  const desc = NEGATED.reduce((d, re) => d.replace(re, ""), `${c.repo} ${c.description}`);
  const hit = GROUPS.find((g) => g.re.test(g.topics ? `${desc} ${c.repoTopics.join(" ")}` : desc));
  if (hit?.id === "decomp" && RECOMP.test(`${desc} ${c.repoTopics.join(" ")}`)) return "port";
  return hit?.id ?? "port";
};

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
    const entry = found.get(r.full_name) ?? { repo: r.full_name, stars: r.stargazers_count, pushed: r.pushed_at.slice(0, 10), description: r.description ?? "", repoTopics: r.topics ?? [], topics: new Set() };
    entry.topics.add(topic);
    found.set(r.full_name, entry);
  }
}

const list = [...found.values()].sort((a, b) => b.stars - a.stars);
const line = (c) => {
  const flag = groupOf(c) === "port" && GROUPS[2].re.test(`${c.description} ${c.repoTopics.join(" ")}`) ? " ⚠ mentions a decompilation" : "";
  return `- [ ] ${c.repo} (★${c.stars}, pushed ${c.pushed}) [${[...c.topics].join(", ")}]${flag}\n      ${c.description.slice(0, 160)}`;
};
console.log(`# ${list.length} candidates not in the catalog (>= ${minStars} stars)\n`);
console.log("Check each README before adding: tools, lists, decompilations and emulators are out of scope.");
console.log("The groups come from each repo's description and topics and can be wrong; the README decides.");
console.log("Add accepted repos to `data/ports.json` and rejected ones to `data/discover-ignore.json`.\n");
for (const { id, title } of [{ id: "port", title: "Likely ports" }, ...GROUPS]) {
  const group = list.filter((c) => groupOf(c) === id);
  if (!group.length) continue;
  console.log(`## ${title} (${group.length})\n`);
  for (const c of group) console.log(line(c));
  console.log();
}
