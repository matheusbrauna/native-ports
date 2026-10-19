// Lists repositories from the scene's GitHub topics that are not in data/ports.json yet.
// It never adds a port: a person, or the triage step in a pull request a person reviews, does that.
// Candidates are grouped by what their description and topics suggest, since the "native-port"
// topic covers decompilation-based ports and rewrites as well as native-execution runtimes.
// In GitHub Actions (GITHUB_REPOSITORY set) it also reads open submission issues (labelled
// "submission" or titled "[port] …"): each
// one names a repository, which skips the star minimum and the description filters, since a
// person asked for it. scripts/answer-submissions.mjs replies on the issue after triage.
// Usage: npm run discover [-- --min-stars 5] [--apply] [--json candidates.json]
//   --apply  adds the tool/list and rewrite groups to data/discover-ignore.json with a reason
//   --json   writes the remaining candidates, submissions first, for scripts/triage.mjs
import { readFile, writeFile } from "node:fs/promises";

const TOPICS = ["static-recompilation", "rexglue", "xenonrecomp", "n64recomp", "ps2recomp", "recompilation", "native-port"];
const args = process.argv.slice(2);
const flag = (name) => args.indexOf(name);
const minStars = Number(args[flag("--min-stars") + 1]) || 3;
const apply = flag("--apply") >= 0;
const jsonOut = flag("--json") >= 0 ? args[flag("--json") + 1] : null;

const dataUrl = (f) => new URL(`../data/${f}`, import.meta.url);
const readData = async (f) => JSON.parse(await readFile(dataUrl(f), "utf8"));
const ports = await readData("ports.json");
const ignored = await readData("discover-ignore.json");
const pending = await readData("discover-pending.json");
const known = new Set([...ports.map((p) => p.repo), ...ignored.map((d) => d.repo), ...pending.map((d) => d.repo)].map((r) => r.toLowerCase()));

const API = process.env.GITHUB_API_URL ?? "https://api.github.com";
const headers = { "User-Agent": "pc-ports-discover", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

// Order matters: the first group whose pattern matches wins. Tools and rewrites are judged on the
// name and description only; a decompilation also shows up in topics. `auto` groups are clear
// enough to ignore without a person; the decompilation group still needs its README read.
const GROUPS = [
  { id: "tool", auto: true, title: "Likely tools, lists or emulators (out of scope)", reason: "Likely a tool, list or emulator (matched its description)", re: /\b(awesome|curated|catalog(ue)?|directory|list of|tool for|manager for|skill|emulator|recompiler|recompilation framework)\b/i, topics: false },
  { id: "rewrite", auto: true, title: "Likely reimplementations or rewrites (out of scope)", reason: "Likely a reimplementation or rewrite (matched its description)", re: /\b(clean-room|reimplementation|rewrite|rewritten|from-scratch)\b/i, topics: false },
  { id: "decomp", title: "Likely built from a decompilation (check the README: out of scope unless it also recompiles the binary)", re: /\b(decomp\w*|matching|disasm|source[ -]port)\b/i, topics: true },
];
// "Not an emulator" and "built with the X recompiler" describe ports; drop them before matching.
const NEGATED = [/\b(not|no|without)\b[^.:;]{0,40}?\b(emulator|emulation|recompilation)\b/gi, /\b(with|using|on|via|by) (the |an? )?[\w-]+ (static )?recompiler\b/gi];
// A game recompiled with a known toolchain stays with the ports even if it mentions a decompilation.
const RECOMP = /\b(static(ally)?[ -]recompil\w*|rexglue|xenonrecomp|n64recomp|ps2recomp|recompone)\b/i;
const DECOMP = GROUPS.find((g) => g.id === "decomp").re;

const groupOf = (c) => {
  const desc = NEGATED.reduce((d, re) => d.replace(re, ""), `${c.repo} ${c.description}`);
  const hit = GROUPS.find((g) => g.re.test(g.topics ? `${desc} ${c.repoTopics.join(" ")}` : desc));
  if (hit?.id === "decomp" && RECOMP.test(`${desc} ${c.repoTopics.join(" ")}`)) return "port";
  return hit?.id ?? "port";
};

const found = new Map();
for (const topic of TOPICS) {
  const url = `${API}/search/repositories?q=${encodeURIComponent(`topic:${topic} stars:>=${minStars} archived:false`)}&sort=updated&per_page=100`;
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

// Submissions: the first GitHub repository named in each open "submission" issue not yet answered.
const MAX_SUBMISSIONS = 10;
const REPO_LINK = /github\.com\/([A-Za-z0-9-]+\/[A-Za-z0-9._-]+)/i;
const REPO_NAME = /^\s*([A-Za-z0-9-]+\/[A-Za-z0-9._-]+)\s*$/m;
const submissions = [];
if (process.env.GITHUB_REPOSITORY) {
  // The form labels its issues "submission", but GitHub drops a label the repo does not have yet,
  // so the form's "[port]" title prefix counts too.
  const res = await fetch(`${API}/repos/${process.env.GITHUB_REPOSITORY}/issues?state=open&sort=created&direction=asc&per_page=100`, { headers });
  const issues = (res.ok ? await res.json() : []).filter((i) => i.labels.some((l) => l.name === "submission") || /^\s*\[port\]/i.test(i.title));
  if (!res.ok) console.warn(`[discover] submissions: HTTP ${res.status}`);
  const known = (repo) => {
    const key = repo.toLowerCase();
    if (ports.some((p) => p.repo.toLowerCase() === key)) return { known: "listed" };
    const ig = ignored.find((d) => d.repo.toLowerCase() === key);
    if (ig) return { known: "ignored", reason: ig.reason };
    const pe = pending.find((d) => d.repo.toLowerCase() === key);
    if (pe) return { known: "pending", reason: pe.reason };
    return null;
  };
  for (const issue of issues.filter((i) => !i.pull_request && !i.labels.some((l) => l.name === "triaged")).slice(0, MAX_SUBMISSIONS)) {
    const text = `${issue.title}\n${issue.body ?? ""}`;
    const name = (text.match(REPO_LINK)?.[1] ?? text.match(REPO_NAME)?.[1] ?? "").replace(/\.git$/, "").replace(/[.]+$/, "");
    if (!name) {
      submissions.push({ issue: issue.number, repo: null, problem: "No GitHub repository link found" });
      continue;
    }
    // Checked by the name as written, then again by the canonical name, since GitHub redirects renamed repos.
    const state = known(name);
    if (state) {
      submissions.push({ issue: issue.number, repo: name, ...state });
      continue;
    }
    const r = await fetch(`${API}/repos/${name}`, { headers });
    if (!r.ok) {
      submissions.push({ issue: issue.number, repo: name, problem: r.status === 404 ? "Repository not found" : `GitHub returned HTTP ${r.status}` });
      continue;
    }
    const meta = await r.json();
    const renamed = known(meta.full_name);
    if (renamed) {
      submissions.push({ issue: issue.number, repo: meta.full_name, ...renamed });
      continue;
    }
    const twin = submissions.find((c) => c.repo?.toLowerCase() === meta.full_name.toLowerCase());
    if (twin) {
      submissions.push({ issue: issue.number, repo: meta.full_name, duplicateOf: twin.issue });
      continue;
    }
    submissions.push({ issue: issue.number, repo: meta.full_name, stars: meta.stargazers_count, pushed: meta.pushed_at.slice(0, 10), description: meta.description ?? "", repoTopics: meta.topics ?? [], topics: ["submission"], group: "submission" });
  }
}

const submitted = new Set(submissions.map((c) => c.repo?.toLowerCase()));
const list = [...found.values()].filter((c) => !submitted.has(c.repo.toLowerCase())).sort((a, b) => b.stars - a.stars);
for (const c of list) c.group = groupOf(c);

const autoIgnored = list.filter((c) => GROUPS.find((g) => g.id === c.group)?.auto);
if (apply && autoIgnored.length) {
  const reasons = Object.fromEntries(GROUPS.map((g) => [g.id, g.reason]));
  const next = [...ignored, ...autoIgnored.map((c) => ({ repo: c.repo, reason: reasons[c.group] }))];
  await writeFile(dataUrl("discover-ignore.json"), JSON.stringify(next, null, 2) + "\n");
}
const open = apply ? list.filter((c) => !autoIgnored.includes(c)) : list;

if (jsonOut) {
  const out = [...submissions, ...open.map(({ topics, ...c }) => ({ ...c, topics: [...topics] }))];
  await writeFile(jsonOut, JSON.stringify(out, null, 2) + "\n");
}

const line = (c) => {
  const flagged = c.group === "port" && DECOMP.test(`${c.description} ${c.repoTopics.join(" ")}`) ? " ⚠ mentions a decompilation" : "";
  return `- [ ] ${c.repo} (★${c.stars}, pushed ${c.pushed}) [${[...c.topics].join(", ")}]${flagged}\n      ${c.description.slice(0, 160)}`;
};
console.log(`# ${open.length} candidates not in the catalog (>= ${minStars} stars)\n`);
if (apply) console.log(`${autoIgnored.length} more were added to \`data/discover-ignore.json\` as likely tools, lists or rewrites.\n`);
console.log("Check each README before adding: tools, lists, decompilations and emulators are out of scope.");
console.log("The groups come from each repo's description and topics and can be wrong; the README decides.");
console.log("Add accepted repos to `data/ports.json` and rejected ones to `data/discover-ignore.json`.\n");
if (pending.length) {
  console.log(`## Waiting for a person (${pending.length})\n`);
  console.log("Held by the triage step in `data/discover-pending.json`. Move each one to `ports.json` or `discover-ignore.json`.\n");
  for (const d of pending) console.log(`- [ ] ${d.repo}\n      ${d.reason.slice(0, 200)}`);
  console.log();
}
for (const { id, title } of [{ id: "port", title: "Likely ports" }, ...GROUPS]) {
  const group = open.filter((c) => c.group === id);
  if (!group.length) continue;
  console.log(`## ${title} (${group.length})\n`);
  for (const c of group) console.log(line(c));
  console.log();
}
