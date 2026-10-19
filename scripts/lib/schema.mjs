// Rules for data/*.json entries, shared by validate-data.mjs and triage.mjs.
// Allowed values mirror src/lib/catalog.ts; update both together.

export const CONSOLES = ["ps4", "xbox360", "xbox", "n64", "wii", "ps1", "ps2", "psp", "32x", "dreamcast", "naomi2"];
export const PLATFORMS = ["linux", "steamdeck", "windows", "macos", "android", "ios", "arm"];
export const TIERS = ["playable", "ingame", "intro", "wip", "unrated"];
export const KINDS = ["upstream", "fork", "port"];
export const TECHNIQUES = ["recomp", "runtime"];
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const REPO = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;

const isStr = (v) => typeof v === "string" && v.trim().length > 0;

export const slugify = (s) =>
  s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Each check returns a list of problems; an empty list means the entry is valid.
export function checkGame(g) {
  const errors = [];
  if (!isStr(g.id) || !SLUG.test(g.id)) errors.push("id must be a lowercase slug (a-z, 0-9, hyphens)");
  if (!isStr(g.title)) errors.push("title is required");
  if (!CONSOLES.includes(g.console)) errors.push(`console must be one of ${CONSOLES.join(", ")}`);
  if (!Array.isArray(g.titleIds) || !g.titleIds.every(isStr)) errors.push("titleIds must be an array of strings");
  return errors;
}

export function checkPort(p, gameIds) {
  const errors = [];
  if (!isStr(p.slug) || !SLUG.test(p.slug)) errors.push("slug must be a lowercase slug (a-z, 0-9, hyphens)");
  if (!isStr(p.name)) errors.push("name is required");
  if (!REPO.test(p.repo ?? "")) errors.push('repo must look like "owner/name"');
  if (p.upstream !== null && !REPO.test(p.upstream ?? "")) errors.push('upstream must be null or "owner/name"');
  if (!KINDS.includes(p.kind)) errors.push(`kind must be one of ${KINDS.join(", ")}`);
  if (!TECHNIQUES.includes(p.technique)) errors.push(`technique must be one of ${TECHNIQUES.join(", ")}`);
  if (p.toolchain !== null && !isStr(p.toolchain)) errors.push("toolchain must be null or a string");
  if (!Array.isArray(p.platforms) || !p.platforms.every((x) => PLATFORMS.includes(x))) errors.push(`platforms may only contain ${PLATFORMS.join(", ")}`);
  if (!Array.isArray(p.graphics) || !p.graphics.every(isStr)) errors.push("graphics must be an array of strings");
  if (!Array.isArray(p.games) || p.games.length === 0) errors.push("games must list at least one game");
  for (const g of Array.isArray(p.games) ? p.games : []) {
    if (!gameIds.has(g.id)) errors.push(`game "${g.id}" is not in data/games.json`);
    if (!TIERS.includes(g.tier)) errors.push(`tier must be one of ${TIERS.join(", ")}`);
    if (g.source !== null && !isStr(g.source)) errors.push("source must be null or a string quoting the README");
    if (g.tier !== "unrated" && g.source === null) errors.push(`tier "${g.tier}" needs a source quoting the project's README`);
  }
  if (!isStr(p.notes?.en) || !isStr(p.notes?.["pt-br"])) errors.push('notes need both "en" and "pt-br"');
  return errors;
}

// discover-ignore.json (rejected) and discover-pending.json (waiting for a person) share one shape.
export function checkDecision(d) {
  const errors = [];
  if (!REPO.test(d?.repo ?? "")) errors.push('repo must look like "owner/name"');
  if (!isStr(d?.reason)) errors.push("reason is required");
  return errors;
}
