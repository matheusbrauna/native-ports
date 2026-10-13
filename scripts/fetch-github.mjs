// Enriches data/ports.json with live repository facts from the GitHub API.
// Writes src/data/github.json. Uses GITHUB_TOKEN when present; on failure it
// keeps the last cached value for that repo so a build never breaks on the API.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const portsPath = new URL("data/ports.json", root);
const outPath = new URL("src/data/github.json", root);

const ports = JSON.parse(await readFile(portsPath, "utf8"));
const previous = existsSync(outPath) ? JSON.parse(await readFile(outPath, "utf8")) : { repos: {} };

const headers = { "User-Agent": "pc-ports-catalog", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function get(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (res.status === 404) return { missing: true };
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
}

const repos = {};
let fresh = 0;
for (const port of ports) {
  const name = port.repo;
  try {
    const repo = await get(`/repos/${name}`);
    if (repo.missing) {
      repos[name] = { ...previous.repos[name], unavailable: true };
      continue;
    }
    const release = await get(`/repos/${name}/releases/latest`);
    let ahead = null;
    if (port.upstream && repo.fork) {
      const [owner] = name.split("/");
      const [upOwner, upName] = port.upstream.split("/");
      try {
        const cmp = await get(`/repos/${upOwner}/${upName}/compare/master...${owner}:${repo.name}:${repo.default_branch}`);
        if (!cmp.missing) ahead = cmp.ahead_by;
      } catch { /* compare is best-effort */ }
    }
    repos[name] = {
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
      archived: repo.archived,
      license: repo.license?.spdx_id ?? null,
      description: repo.description,
      release: release.missing ? null : { tag: release.tag_name, publishedAt: release.published_at, url: release.html_url },
      ahead,
      unavailable: false,
    };
    fresh++;
  } catch (err) {
    console.warn(`[fetch-github] ${name}: ${err.message}; keeping cached data`);
    if (previous.repos[name]) repos[name] = previous.repos[name];
  }
}

await mkdir(new URL("src/data/", root), { recursive: true });
await writeFile(outPath, JSON.stringify({ fetchedAt: fresh ? new Date().toISOString() : previous.fetchedAt ?? null, repos }, null, 2) + "\n");
console.log(`[fetch-github] ${fresh}/${ports.length} repos refreshed`);
