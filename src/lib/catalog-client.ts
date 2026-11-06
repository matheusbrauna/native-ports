import { t } from "./i18n";
import type { Lang, Tier } from "./catalog";
import { PAGE_SIZE, pageWindow } from "./pagination";

type SortKey = "pushed" | "stars" | "name";
interface State {
  q: string;
  game: string;
  console: string;
  technique: string;
  platforms: Set<string>;
  tiers: Set<string>;
  sort: SortKey;
  dir: 1 | -1;
  page: number;
}

const DEFAULT_DIR: Record<SortKey, 1 | -1> = { pushed: -1, stars: -1, name: 1 };

export function initCatalog(): void {
  const root = document.querySelector<HTMLElement>(".catalog");
  if (!root) return;
  const lang = (root.dataset.lang ?? "en") as Lang;
  const s = t[lang];

  const q = root.querySelector<HTMLInputElement>("#q")!;
  const game = root.querySelector<HTMLSelectElement>("#game")!;
  const consoleSel = root.querySelector<HTMLSelectElement>("#console")!;
  const technique = root.querySelector<HTMLSelectElement>("#technique")!;
  const chips = [...root.querySelectorAll<HTMLButtonElement>("[data-platform]")];
  const toggles = [...root.querySelectorAll<HTMLButtonElement>("[data-tier-toggle]")];
  const strip = root.querySelector<HTMLElement>(".strip")!;
  const count = root.querySelector<HTMLElement>("#count")!;
  const reset = root.querySelector<HTMLButtonElement>("#reset")!;
  const empty = root.querySelector<HTMLElement>("#empty")!;
  const sortHeads = [...root.querySelectorAll<HTMLButtonElement>("[data-sort]")];
  const groups = [...root.querySelectorAll<HTMLTableSectionElement>("tbody[data-group]")];
  const rows = [...root.querySelectorAll<HTMLTableRowElement>("tr[data-entry]")];
  const pagers = [...root.querySelectorAll<HTMLElement>("[data-pager]")];

  const state = readUrl();

  function readPage(value: string | null): number {
    if (!value || !/^[1-9]\d{0,5}$/.test(value)) return 1;
    const n = Number(value);
    return n > 1 ? n : 1;
  }

  function readUrl(): State {
    const p = new URLSearchParams(location.search);
    const list = (k: string) => new Set((p.get(k) ?? "").split(",").filter(Boolean));
    const sort = (["pushed", "stars", "name"] as const).find((k) => k === p.get("sort")) ?? "pushed";
    const dir = p.get("dir") === "asc" ? 1 : p.get("dir") === "desc" ? -1 : DEFAULT_DIR[sort];
    return {
      q: p.get("q") ?? "",
      game: p.get("game") ?? "",
      console: p.get("console") ?? "",
      technique: p.get("technique") ?? "",
      platforms: list("platform"),
      tiers: list("status"),
      sort,
      dir,
      page: readPage(p.get("page")),
    };
  }

  function writeUrl(): void {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.console) p.set("console", state.console);
    if (state.game) p.set("game", state.game);
    if (state.technique) p.set("technique", state.technique);
    if (state.platforms.size) p.set("platform", [...state.platforms].join(","));
    if (state.tiers.size) p.set("status", [...state.tiers].join(","));
    if (state.sort !== "pushed" || state.dir !== DEFAULT_DIR.pushed) {
      p.set("sort", state.sort);
      p.set("dir", state.dir === 1 ? "asc" : "desc");
    }
    if (state.page > 1) p.set("page", String(state.page));
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }

  function matchesScope(d: DOMStringMap): boolean {
    if (state.console && d.console !== state.console) return false;
    if (state.technique && d.technique !== state.technique) return false;
    return !state.game || d.game === state.game;
  }

  function matchesBase(row: HTMLTableRowElement, terms: string[]): boolean {
    const d = row.dataset;
    if (!matchesScope(d)) return false;
    if (state.platforms.size) {
      const plats = (d.platforms ?? "").split(" ");
      if (![...state.platforms].some((p) => plats.includes(p))) return false;
    }
    return terms.every((term) => (d.text ?? "").includes(term));
  }

  function matchesExceptPlatform(row: HTMLTableRowElement, terms: string[]): boolean {
    const d = row.dataset;
    if (!matchesScope(d)) return false;
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
    const platformCounts: Record<string, number> = {};
    const matching = new Set<HTMLTableRowElement>();
    const gamesShown = new Set<string>();

    for (const row of rows) {
      const base = matchesBase(row, terms);
      if (matchesExceptPlatform(row, terms)) {
        (row.dataset.platforms ?? "").split(" ").forEach((p) => { platformCounts[p] = (platformCounts[p] ?? 0) + 1; });
      }
      const tier = row.dataset.tier as Tier;
      if (base) stripCounts[tier] = (stripCounts[tier] ?? 0) + 1;
      if (base && (!state.tiers.size || state.tiers.has(tier))) {
        matching.add(row);
        gamesShown.add(row.dataset.game!);
      }
    }

    for (const group of groups) sortGroup(group);

    const ordered: HTMLTableRowElement[] = [];
    for (const group of groups) {
      for (const row of group.querySelectorAll<HTMLTableRowElement>("tr[data-entry]")) {
        if (matching.has(row)) ordered.push(row);
      }
    }

    const pages = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE));
    if (state.page > pages) state.page = pages;
    if (state.page < 1) state.page = 1;
    const start = (state.page - 1) * PAGE_SIZE;
    const onPage = new Set(ordered.slice(start, start + PAGE_SIZE));

    for (const row of rows) row.hidden = !onPage.has(row);

    let markedFirst = false;
    for (const group of groups) {
      const matched = [...group.querySelectorAll<HTMLTableRowElement>("tr[data-entry]")].filter((r) => matching.has(r));
      const shown = matched.filter((r) => onPage.has(r));
      group.hidden = shown.length === 0;
      const first = shown.length > 0 && !markedFirst;
      if (first) markedFirst = true;
      group.classList.toggle("page-first", first);
      group.querySelector("[data-group-count]")!.textContent = String(shown.length);
      const counts: Record<string, number> = {};
      shown.forEach((r) => { counts[r.dataset.tier!] = (counts[r.dataset.tier!] ?? 0) + 1; });
      setSegments(group.querySelector(".mini")!, counts);
      const last = shown[shown.length - 1];
      for (const row of group.querySelectorAll<HTMLTableRowElement>("tr[data-entry]")) {
        row.classList.toggle("last", row === last);
      }
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

    count.textContent = s.count(matching.size, gamesShown.size);
    empty.hidden = matching.size > 0;
    reset.hidden = !(state.q || state.game || state.console || state.technique || state.platforms.size || state.tiers.size);
    renderPager(pages);
    syncGameOptions();
    writeUrl();
    root.dataset.paged = "true";
  }

  function renderPager(pages: number): void {
    const show = pages > 1;
    for (const nav of pagers) {
      nav.hidden = !show;
      const status = nav.querySelector<HTMLElement>("[data-pager-status]")!;
      const prev = nav.querySelector<HTMLButtonElement>("[data-page-dir='prev']")!;
      const next = nav.querySelector<HTMLButtonElement>("[data-page-dir='next']")!;
      const box = nav.querySelector<HTMLElement>("[data-pager-pages]")!;
      prev.disabled = state.page <= 1;
      next.disabled = state.page >= pages;
      status.replaceChildren();
      box.replaceChildren();
      if (!show) continue;
      const before = document.createTextNode(`${s.pager.statusBefore} `);
      const current = document.createElement("span");
      current.className = "data";
      current.textContent = String(state.page);
      const between = document.createTextNode(` ${s.pager.statusBetween} `);
      const total = document.createElement("span");
      total.className = "data";
      total.textContent = String(pages);
      status.append(before, current, between, total);
      for (const item of pageWindow(state.page, pages)) {
        if (item === "gap") {
          const gap = document.createElement("span");
          gap.className = "pager-gap";
          gap.setAttribute("aria-hidden", "true");
          gap.textContent = "…";
          box.append(gap);
          continue;
        }
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "page-num";
        btn.dataset.pageNum = String(item);
        btn.textContent = String(item);
        btn.setAttribute("aria-label", s.pager.page(item));
        if (item === state.page) btn.setAttribute("aria-current", "page");
        box.append(btn);
      }
    }
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
    state.q = ""; state.game = ""; state.console = ""; state.technique = ""; state.platforms.clear(); state.tiers.clear();
    state.page = 1;
    q.value = ""; game.value = ""; consoleSel.value = ""; technique.value = "";
    apply();
    q.focus();
  }

  // Changing a filter or the sort starts again at page 1. A page past the new
  // result length is clamped in apply(), so a shared URL still lands on a real page.
  function updateFilters(change: () => void): void {
    change();
    state.page = 1;
    apply();
  }

  // With a console chosen, the game list only offers that console's games.
  function syncGameOptions(): void {
    game.querySelectorAll("optgroup").forEach((g) => {
      const c = g.querySelector<HTMLOptionElement>("option")?.dataset.console;
      g.hidden = Boolean(state.console && c !== state.console);
      g.disabled = g.hidden;
    });
  }

  const pick = (sel: HTMLSelectElement, value: string) => ([...sel.options].some((o) => o.value === value) ? value : "");
  q.value = state.q;
  state.game = game.value = pick(game, state.game);
  state.console = consoleSel.value = pick(consoleSel, state.console);
  state.technique = technique.value = pick(technique, state.technique);
  consoleSel.addEventListener("change", () => {
    updateFilters(() => {
      state.console = consoleSel.value;
      const opt = game.selectedOptions[0];
      if (state.console && opt?.dataset.console && opt.dataset.console !== state.console) { state.game = ""; game.value = ""; }
    });
  });
  technique.addEventListener("change", () => { updateFilters(() => { state.technique = technique.value; }); });
  q.addEventListener("input", () => { updateFilters(() => { state.q = q.value.trim(); }); });
  game.addEventListener("change", () => { updateFilters(() => { state.game = game.value; }); });
  chips.forEach((c) => c.addEventListener("click", () => { updateFilters(() => { toggle(state.platforms, c.dataset.platform!); }); }));
  toggles.forEach((b) => b.addEventListener("click", () => { updateFilters(() => { toggle(state.tiers, b.dataset.tierToggle!); }); }));
  strip.querySelectorAll<HTMLElement>("[data-seg]").forEach((seg) =>
    seg.addEventListener("click", () => { updateFilters(() => { toggle(state.tiers, seg.dataset.seg!); }); }),
  );
  sortHeads.forEach((b) => b.addEventListener("click", () => {
    updateFilters(() => {
      const key = b.dataset.sort as SortKey;
      state.dir = state.sort === key ? (state.dir === 1 ? -1 : 1) : DEFAULT_DIR[key];
      state.sort = key;
    });
  }));
  reset.addEventListener("click", clearAll);
  root.querySelector("[data-reset]")?.addEventListener("click", clearAll);
  for (const nav of pagers) {
    nav.addEventListener("click", (event) => {
      const btn = (event.target as Element | null)?.closest("button");
      if (!(btn instanceof HTMLButtonElement) || btn.disabled || !nav.contains(btn)) return;
      const dir = btn.dataset.pageDir;
      const num = btn.dataset.pageNum;
      let next = state.page;
      if (dir === "prev") next = state.page - 1;
      else if (dir === "next") next = state.page + 1;
      else if (num) next = Number(num);
      if (!Number.isInteger(next) || next < 1 || next === state.page) return;
      state.page = next;
      apply();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      pagers[0]?.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
      const top = pagers[0];
      const dirBtn = dir ? top?.querySelector<HTMLButtonElement>(`[data-page-dir="${dir}"]`) : null;
      const focusEl = dirBtn && !dirBtn.disabled ? dirBtn : top?.querySelector<HTMLButtonElement>('[aria-current="page"]');
      focusEl?.focus({ preventScroll: true });
    });
  }
  window.addEventListener("popstate", () => {
    Object.assign(state, readUrl());
    q.value = state.q;
    game.value = state.game;
    consoleSel.value = state.console;
    technique.value = state.technique;
    apply();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      q.focus();
    }
  });

  apply();
  if (state.page > 1) pagers[0]?.scrollIntoView({ block: "start" });
}
