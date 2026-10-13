import { t } from "./i18n";
import type { Lang, Tier } from "./catalog";

type SortKey = "pushed" | "stars" | "name";
interface State { q: string; game: string; platforms: Set<string>; tiers: Set<string>; sort: SortKey; dir: 1 | -1 }

const DEFAULT_DIR: Record<SortKey, 1 | -1> = { pushed: -1, stars: -1, name: 1 };

export function initCatalog(): void {
  const root = document.querySelector<HTMLElement>(".catalog");
  if (!root) return;
  const lang = (root.dataset.lang ?? "en") as Lang;
  const s = t[lang];

  const q = root.querySelector<HTMLInputElement>("#q")!;
  const game = root.querySelector<HTMLSelectElement>("#game")!;
  const chips = [...root.querySelectorAll<HTMLButtonElement>("[data-platform]")];
  const toggles = [...root.querySelectorAll<HTMLButtonElement>("[data-tier-toggle]")];
  const strip = root.querySelector<HTMLElement>(".strip")!;
  const count = root.querySelector<HTMLElement>("#count")!;
  const reset = root.querySelector<HTMLButtonElement>("#reset")!;
  const empty = root.querySelector<HTMLElement>("#empty")!;
  const sortHeads = [...root.querySelectorAll<HTMLButtonElement>("[data-sort]")];
  const groups = [...root.querySelectorAll<HTMLTableSectionElement>("tbody[data-group]")];
  const rows = [...root.querySelectorAll<HTMLTableRowElement>("tr[data-entry]")];

  const state = readUrl();

  function readUrl(): State {
    const p = new URLSearchParams(location.search);
    const list = (k: string) => new Set((p.get(k) ?? "").split(",").filter(Boolean));
    const sort = (["pushed", "stars", "name"] as const).find((k) => k === p.get("sort")) ?? "pushed";
    const dir = p.get("dir") === "asc" ? 1 : p.get("dir") === "desc" ? -1 : DEFAULT_DIR[sort];
    return { q: p.get("q") ?? "", game: p.get("game") ?? "", platforms: list("platform"), tiers: list("status"), sort, dir };
  }

  function writeUrl(): void {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.game) p.set("game", state.game);
    if (state.platforms.size) p.set("platform", [...state.platforms].join(","));
    if (state.tiers.size) p.set("status", [...state.tiers].join(","));
    if (state.sort !== "pushed" || state.dir !== DEFAULT_DIR.pushed) {
      p.set("sort", state.sort);
      p.set("dir", state.dir === 1 ? "asc" : "desc");
    }
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }

  function matchesBase(row: HTMLTableRowElement, terms: string[]): boolean {
    const d = row.dataset;
    if (state.game && d.game !== state.game) return false;
    if (state.platforms.size) {
      const plats = (d.platforms ?? "").split(" ");
      if (![...state.platforms].some((p) => plats.includes(p))) return false;
    }
    return terms.every((term) => (d.text ?? "").includes(term));
  }

  function matchesExceptPlatform(row: HTMLTableRowElement, terms: string[]): boolean {
    const d = row.dataset;
    if (state.game && d.game !== state.game) return false;
    if (state.tiers.size && !state.tiers.has(d.tier!)) return false;
    return terms.every((term) => (d.text ?? "").includes(term));
  }

  function setSegments(container: ParentNode, counts: Record<string, number>): void {
    container.querySelectorAll<HTMLElement>("[data-seg]").forEach((seg) => {
      const tier = seg.dataset.seg!;
      seg.style.flexGrow = String(counts[tier] ?? 0);
      seg.classList.toggle("on", state.tiers.has(tier));
    });
  }

  function apply(): void {
    const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    const stripCounts: Record<string, number> = {};
    let shown = 0;
    const gamesShown = new Set<string>();

    const platformCounts: Record<string, number> = {};
    for (const row of rows) {
      const base = matchesBase(row, terms);
      if (matchesExceptPlatform(row, terms)) {
        (row.dataset.platforms ?? "").split(" ").forEach((p) => { platformCounts[p] = (platformCounts[p] ?? 0) + 1; });
      }
      const tier = row.dataset.tier as Tier;
      if (base) stripCounts[tier] = (stripCounts[tier] ?? 0) + 1;
      const visible = base && (!state.tiers.size || state.tiers.has(tier));
      row.hidden = !visible;
      if (visible) { shown++; gamesShown.add(row.dataset.game!); }
    }

    for (const group of groups) {
      const visible = [...group.querySelectorAll<HTMLTableRowElement>("tr[data-entry]")].filter((r) => !r.hidden);
      group.hidden = visible.length === 0;
      group.querySelector("[data-group-count]")!.textContent = String(visible.length);
      const counts: Record<string, number> = {};
      visible.forEach((r) => { counts[r.dataset.tier!] = (counts[r.dataset.tier!] ?? 0) + 1; });
      setSegments(group.querySelector(".mini")!, counts);
      sortGroup(group);
    }

    setSegments(strip, stripCounts);
    strip.classList.toggle("filtered", state.tiers.size > 0);
    toggles.forEach((b) => {
      const tier = b.dataset.tierToggle!;
      b.setAttribute("aria-pressed", String(state.tiers.has(tier)));
      b.querySelector("[data-tier-count]")!.textContent = String(stripCounts[tier] ?? 0);
    });
    chips.forEach((c) => {
      c.setAttribute("aria-pressed", String(state.platforms.has(c.dataset.platform!)));
      c.querySelector("[data-platform-count]")!.textContent = String(platformCounts[c.dataset.platform!] ?? 0);
    });
    sortHeads.forEach((b) => {
      const th = b.closest("th")!;
      th.setAttribute("aria-sort", b.dataset.sort === state.sort ? (state.dir === 1 ? "ascending" : "descending") : "none");
    });

    count.textContent = s.count(shown, gamesShown.size);
    empty.hidden = shown > 0;
    reset.hidden = !(state.q || state.game || state.platforms.size || state.tiers.size);
    writeUrl();
  }

  function sortGroup(group: HTMLTableSectionElement): void {
    const list = [...group.querySelectorAll<HTMLTableRowElement>("tr[data-entry]")];
    const key = (r: HTMLTableRowElement) =>
      state.sort === "name" ? r.dataset.name ?? "" : Number(state.sort === "stars" ? r.dataset.stars : r.dataset.pushed);
    list.sort((a, b) => {
      if (state.sort === "pushed" && state.dir === -1) {
        if (a.dataset.upstream) return -1;
        if (b.dataset.upstream) return 1;
      }
      const ka = key(a), kb = key(b);
      const cmp = typeof ka === "string" ? ka.localeCompare(kb as string) : ka - (kb as number);
      return cmp * state.dir;
    });
    list.forEach((r) => group.appendChild(r));
  }

  function toggle(set: Set<string>, value: string): void {
    if (set.has(value)) set.delete(value); else set.add(value);
  }

  function clearAll(): void {
    state.q = ""; state.game = ""; state.platforms.clear(); state.tiers.clear();
    q.value = ""; game.value = "";
    apply();
    q.focus();
  }

  // Wire controls
  q.value = state.q;
  if ([...game.options].some((o) => o.value === state.game)) game.value = state.game; else state.game = "";
  q.addEventListener("input", () => { state.q = q.value.trim(); apply(); });
  game.addEventListener("change", () => { state.game = game.value; apply(); });
  chips.forEach((c) => c.addEventListener("click", () => { toggle(state.platforms, c.dataset.platform!); apply(); }));
  toggles.forEach((b) => b.addEventListener("click", () => { toggle(state.tiers, b.dataset.tierToggle!); apply(); }));
  strip.querySelectorAll<HTMLElement>("[data-seg]").forEach((seg) =>
    seg.addEventListener("click", () => { toggle(state.tiers, seg.dataset.seg!); apply(); }),
  );
  sortHeads.forEach((b) => b.addEventListener("click", () => {
    const key = b.dataset.sort as SortKey;
    state.dir = state.sort === key ? (state.dir === 1 ? -1 : 1) : DEFAULT_DIR[key];
    state.sort = key;
    apply();
  }));
  reset.addEventListener("click", clearAll);
  root.querySelector("[data-reset]")?.addEventListener("click", clearAll);
  window.addEventListener("popstate", () => { Object.assign(state, readUrl()); q.value = state.q; game.value = state.game; apply(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      q.focus();
    }
  });

  apply();
}
