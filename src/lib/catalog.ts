import gamesJson from "../../data/games.json";
import portsJson from "../../data/ports.json";
import githubJson from "../data/github.json";

export type Lang = "en" | "pt-br";
export type Tier = "playable" | "ingame" | "intro" | "wip" | "unrated";
export type Platform = "linux" | "steamdeck" | "windows" | "macos" | "android" | "ios" | "arm";
export type Console = "ps4" | "xbox360" | "xbox" | "n64" | "ps1" | "ps2" | "psp" | "32x" | "naomi2";
export type Technique = "runtime" | "recomp";

export const TIERS: Tier[] = ["playable", "ingame", "intro", "wip", "unrated"];
export const PLATFORMS: Platform[] = ["windows", "linux", "steamdeck", "macos", "android", "ios", "arm"];
export const CONSOLES: Console[] = ["xbox360", "xbox", "ps4", "n64", "ps1", "ps2", "psp", "32x", "naomi2"];
export const TECHNIQUES: Technique[] = ["recomp", "runtime"];

export interface Game {
  id: string;
  title: string;
  console: Console;
  titleIds: string[];
  version?: string;
}

export interface PortGame {
  id: string;
  tier: Tier;
  source: string | null;
}

export interface RepoFacts {
  stars: number;
  pushedAt: string;
  archived: boolean;
  license: string | null;
  description: string | null;
  release: { tag: string; publishedAt: string; url: string } | null;
  ahead: number | null;
  unavailable: boolean;
  /** True when filled from a manual survey instead of a full API refresh. */
  partial?: boolean;
}

export interface Port {
  slug: string;
  name: string;
  repo: string;
  upstream: string | null;
  kind: "upstream" | "fork" | "port";
  technique: Technique;
  toolchain: string | null;
  platforms: Platform[];
  graphics: string[];
  games: PortGame[];
  notes: Record<Lang, string>;
  facts: RepoFacts | null;
}

/** One catalog row: a port as it applies to one game. */
export interface Entry {
  port: Port;
  game: Game;
  tier: Tier;
  source: string | null;
}

export const games = gamesJson as Game[];
const gameById = new Map(games.map((g) => [g.id, g]));

const repoFacts = githubJson.repos as Record<string, RepoFacts>;
export const fetchedAt: string | null = githubJson.fetchedAt;

export const ports: Port[] = (portsJson as Omit<Port, "facts">[]).map((p) => ({
  ...p,
  facts: repoFacts[p.repo] ?? null,
}));

export function getGame(id: string): Game {
  const g = gameById.get(id);
  if (!g) throw new Error(`Unknown game id "${id}" in data/ports.json`);
  return g;
}

export const entries: Entry[] = ports.flatMap((port) =>
  port.games.map((pg) => ({ port, game: getGame(pg.id), tier: pg.tier, source: pg.source })),
);

/** Games that have at least one entry, most-ported first, then by title. */
export const groups = games
  .map((game) => ({ game, entries: entries.filter((e) => e.game.id === game.id) }))
  .filter((g) => g.entries.length > 0)
  .sort((a, b) => b.entries.length - a.entries.length || a.game.title.localeCompare(b.game.title));

/** Default order inside a group: upstream first, then most recently pushed. */
export function defaultOrder(a: Entry, b: Entry): number {
  if (a.port.kind === "upstream") return -1;
  if (b.port.kind === "upstream") return 1;
  return Date.parse(b.port.facts?.pushedAt ?? "0") - Date.parse(a.port.facts?.pushedAt ?? "0");
}

export function repoUrl(repo: string): string {
  return `https://github.com/${repo}`;
}

export function isRetired(port: Port): boolean {
  return Boolean(port.facts?.archived || port.facts?.unavailable);
}

/** Best (lowest-index) tier among a list of entries. */
export function bestTier(list: Entry[]): Tier {
  return TIERS[Math.min(...list.map((e) => TIERS.indexOf(e.tier)))] ?? "unrated";
}

export function tierCounts(list: Entry[]): Record<Tier, number> {
  return Object.fromEntries(TIERS.map((tier) => [tier, list.filter((e) => e.tier === tier).length])) as Record<Tier, number>;
}

/** Consoles with at least one game in the catalog, each with its games (most-ported first). */
export const consoleGroups = CONSOLES.map((c) => ({ console: c, games: groups.filter((g) => g.game.console === c) })).filter(
  (c) => c.games.length > 0,
);

/** Union of the platforms a list of entries runs on, in canonical order. */
export function platformsOf(list: Entry[]): Platform[] {
  return PLATFORMS.filter((p) => list.some((e) => e.port.platforms.includes(p)));
}
