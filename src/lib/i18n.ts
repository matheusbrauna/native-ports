import type { Console, Lang, Platform, Technique, Tier } from "./catalog";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Builds a site path for a language: path("/about/", "pt-br") -> "/pt-br/about/". */
export function path(p: string, lang: Lang): string {
  const clean = p.startsWith("/") ? p : `/${p}`;
  return `${BASE}${lang === "pt-br" ? "/pt-br" : ""}${clean}`;
}

/** Strips the base and language prefix from a pathname. */
export function stripLang(pathname: string): string {
  let p = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  if (p.startsWith("/pt-br")) p = p.slice("/pt-br".length);
  return p || "/";
}

export const locale: Record<Lang, string> = { en: "en", "pt-br": "pt-BR" };

const en = {
  siteName: "Native Ports",
  siteDescription: "A curated catalog of unofficial native ports of console games: static recompilations and native-execution runtimes, with each project's declared status and activity.",
  nav: { catalog: "Catalog", submit: "Submit a port", about: "About" },
  aboutDescription: "How static recompilation and native execution run console games on PC without an emulator, and what each port status means.",
  submitDescription: "Suggest an unofficial native port of a console game for the catalog: what gets listed and how to send it.",
  langName: "English",
  otherLang: "Português",
  skip: "Skip to the catalog",
  search: { label: "Search ports", placeholder: "Game, port, repository, console or toolchain", clear: "Clear search" },
  filters: {
    game: "Game", allGames: "All games", console: "Console", allConsoles: "All consoles", technique: "Technique", allTechniques: "Any technique", platform: "Runs on", tier: "Status", reset: "Reset filters",
  },
  count: (ports: number, games: number) => `${ports} ${ports === 1 ? "port" : "ports"} across ${games} ${games === 1 ? "game" : "games"}`,
  stripLabel: "Status of the ports shown",
  cols: { game: "Game", port: "Port", platforms: "Runs on", graphics: "Graphics", toolchain: "Toolchain", tier: "Status", stars: "Stars", pushed: "Last push" },
  sortBy: "Sort by",
  upstream: "upstream",
  archived: "Archived",
  unavailable: "Repository gone",
  notStated: "not stated",
  details: "Details",
  morePorts: (game: string) => `All ports of ${game}`,
  otherGames: (c: string) => `Other ${c} games`,
  allConsoleGames: (c: string) => `All ${c} games`,
  bestStatus: "Best declared status",
  openRepo: "Open repository",
  empty: { title: "No port matches these filters.", body: "Clear a filter, or tell us about a port we are missing.", cta: "Submit a port" },
  tiers: {
    playable: { label: "Playable", hint: "The project's README says the game can be played." },
    ingame: { label: "In-game", hint: "Reaches gameplay; not yet called playable." },
    intro: { label: "Intro", hint: "Title screen, menus or opening scenes only." },
    wip: { label: "In progress", hint: "Work under way; no tested state declared yet." },
    unrated: { label: "Not stated", hint: "The project's README does not declare a status." },
  } satisfies Record<Tier, { label: string; hint: string }>,
  platforms: {
    linux: "Linux", steamdeck: "Steam Deck", windows: "Windows", macos: "macOS", android: "Android", ios: "iOS", arm: "ARM",
  } satisfies Record<Platform, string>,
  consoles: {
    ps4: "PlayStation 4", xbox360: "Xbox 360", xbox: "Xbox", n64: "Nintendo 64", wii: "Wii", ps1: "PlayStation", ps2: "PlayStation 2", psp: "PSP", "32x": "Sega 32X", dreamcast: "Dreamcast", naomi2: "NAOMI 2 (arcade)",
  } satisfies Record<Console, string>,
  techniques: {
    recomp: { label: "Static recompilation", hint: "The console's machine code is translated ahead of time into a native program." },
    runtime: { label: "Native execution", hint: "The original x86-64 code runs directly, on a runtime that replaces the console's system libraries." },
  } satisfies Record<Technique, { label: string; hint: string }>,
  otherConsoles: "Other consoles",
  footer: {
    noFilesLead: "Code links only.",
    noFiles: "This site never hosts or links game files, dumps or keys: every port needs your own copy of the game.",
    disclaimerLead: "Not affiliated.",
    disclaimer: "A community index, independent of any console maker, game publisher or developer, and of the authors of the projects listed.",
    navLabel: "Site",
    updated: "Repository data refreshed",
    notFetched: "Repository data not fetched yet",
    source: "Site source",
    code: "Code",
    data: "Data",
  },
  detail: {
    back: "All ports",
    games: "Games", game: "Game", titleIds: "Title IDs", tier: "Status", evidence: "Status source",
    facts: "Repository", console: "Original console", technique: "Technique", toolchain: "Toolchain", platforms: "Platforms", graphics: "Graphics", upstream: "Forked from", ahead: "Commits ahead of upstream",
    license: "License", pushed: "Last push", stars: "Stars", release: "Latest release", noRelease: "No release yet", notChecked: "Not checked yet",
    ownCopy: "You need your own dump of the game. Read the project's README before installing anything; releases are published by its authors, not by this site.",
    unknown: "Unknown",
  },
  ago: "ago",
};

const ptbr: typeof en = {
  siteName: "Native Ports",
  siteDescription: "Um catálogo curado de ports nativos não oficiais de jogos de console: recompilações estáticas e runtimes de execução nativa, com o status e a atividade que cada projeto declara.",
  nav: { catalog: "Catálogo", submit: "Enviar um port", about: "Sobre" },
  aboutDescription: "Como a recompilação estática e a execução nativa rodam jogos de console no PC sem emulador, e o que significa cada status.",
  submitDescription: "Sugira um port nativo não oficial de jogo de console para o catálogo: o que entra na lista e como enviar.",
  langName: "Português",
  otherLang: "English",
  skip: "Pular para o catálogo",
  search: { label: "Buscar ports", placeholder: "Jogo, port, repositório, console ou toolchain", clear: "Limpar busca" },
  filters: {
    game: "Jogo", allGames: "Todos os jogos", console: "Console", allConsoles: "Todos os consoles", technique: "Técnica", allTechniques: "Qualquer técnica", platform: "Roda em", tier: "Status", reset: "Limpar filtros",
  },
  count: (ports: number, games: number) => `${ports} ${ports === 1 ? "port" : "ports"} em ${games} ${games === 1 ? "jogo" : "jogos"}`,
  stripLabel: "Status dos ports exibidos",
  cols: { game: "Jogo", port: "Port", platforms: "Roda em", graphics: "Gráficos", toolchain: "Toolchain", tier: "Status", stars: "Estrelas", pushed: "Último push" },
  sortBy: "Ordenar por",
  upstream: "upstream",
  archived: "Arquivado",
  unavailable: "Repositório removido",
  notStated: "não informado",
  details: "Detalhes",
  morePorts: (game: string) => `Todos os ports de ${game}`,
  otherGames: (c: string) => `Outros jogos de ${c}`,
  allConsoleGames: (c: string) => `Todos os jogos de ${c}`,
  bestStatus: "Melhor status declarado",
  openRepo: "Abrir repositório",
  empty: { title: "Nenhum port corresponde a esses filtros.", body: "Remova um filtro ou conte pra gente sobre um port que está faltando.", cta: "Enviar um port" },
  tiers: {
    playable: { label: "Jogável", hint: "O README do projeto diz que o jogo pode ser jogado." },
    ingame: { label: "Em jogo", hint: "Chega ao gameplay; ainda não é considerado jogável." },
    intro: { label: "Introdução", hint: "Só tela de título, menus ou cenas de abertura." },
    wip: { label: "Em andamento", hint: "Trabalho em curso; nenhum estado testado declarado ainda." },
    unrated: { label: "Não informado", hint: "O README do projeto não declara um status." },
  },
  platforms: {
    linux: "Linux", steamdeck: "Steam Deck", windows: "Windows", macos: "macOS", android: "Android", ios: "iOS", arm: "ARM",
  },
  consoles: {
    ps4: "PlayStation 4", xbox360: "Xbox 360", xbox: "Xbox", n64: "Nintendo 64", wii: "Wii", ps1: "PlayStation", ps2: "PlayStation 2", psp: "PSP", "32x": "Sega 32X", dreamcast: "Dreamcast", naomi2: "NAOMI 2 (fliperama)",
  },
  techniques: {
    recomp: { label: "Recompilação estática", hint: "O código de máquina do console é traduzido antes, num programa nativo." },
    runtime: { label: "Execução nativa", hint: "O código x86-64 original roda direto, sobre um runtime que substitui as bibliotecas do console." },
  },
  otherConsoles: "Outros consoles",
  footer: {
    noFilesLead: "Só código-fonte.",
    noFiles: "Este site nunca hospeda nem linka arquivos de jogo, dumps ou chaves: todo port exige a sua própria cópia do jogo.",
    disclaimerLead: "Sem afiliação.",
    disclaimer: "Um índice comunitário, independente de fabricantes de console, publishers, desenvolvedores e dos autores dos projetos listados.",
    navLabel: "Site",
    updated: "Dados dos repositórios atualizados em",
    notFetched: "Dados dos repositórios ainda não foram buscados",
    source: "Código do site",
    code: "Código",
    data: "Dados",
  },
  detail: {
    back: "Todos os ports",
    games: "Jogos", game: "Jogo", titleIds: "IDs do título", tier: "Status", evidence: "Fonte do status",
    facts: "Repositório", console: "Console original", technique: "Técnica", toolchain: "Toolchain", platforms: "Plataformas", graphics: "Gráficos", upstream: "Fork de", ahead: "Commits à frente do upstream",
    license: "Licença", pushed: "Último push", stars: "Estrelas", release: "Última release", noRelease: "Nenhuma release ainda", notChecked: "Ainda não verificado",
    ownCopy: "Você precisa do seu próprio dump do jogo. Leia o README do projeto antes de instalar qualquer coisa; as releases são publicadas pelos autores, não por este site.",
    unknown: "Desconhecido",
  },
  ago: "atrás",
};

export const t: Record<Lang, typeof en> = { en, "pt-br": ptbr };

export function formatNumber(n: number, lang: Lang): string {
  return new Intl.NumberFormat(locale[lang]).format(n);
}

export function formatDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale[lang], { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso));
}

/** Compact age relative to the build: "3 d", "5 h", "2 mo". */
export function age(iso: string, now = Date.now(), dayPrecision = false): string {
  const h = Math.max(0, (now - Date.parse(iso)) / 36e5);
  if (dayPrecision) return h < 24 ? "<1 d" : `${Math.round(h / 24)} d`;
  if (h < 1) return "<1 h";
  if (h < 24) return `${Math.round(h)} h`;
  const d = h / 24;
  if (d < 60) return `${Math.round(d)} d`;
  return `${Math.round(d / 30)} mo`;
}
