import type { Lang, Platform, Tier } from "./catalog";

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
  siteName: "PS4 Native Ports",
  siteDescription: "A curated catalog of native PC ports derived from bbport: platform builds of Bloodborne and ports of other PS4 games, with status and activity.",
  nav: { catalog: "Catalog", submit: "Submit a port", about: "About" },
  langName: "English",
  otherLang: "Português",
  skip: "Skip to the catalog",
  search: { label: "Search ports", placeholder: "Game, port, repository or title ID (CUSA03173)", clear: "Clear search" },
  filters: {
    game: "Game", allGames: "All games", platform: "Platform", tier: "Status", reset: "Reset filters",
  },
  count: (ports: number, games: number) => `${ports} ${ports === 1 ? "port" : "ports"} across ${games} ${games === 1 ? "game" : "games"}`,
  stripLabel: "Status of the ports shown",
  cols: { game: "Game", port: "Port", platforms: "Platforms", graphics: "Graphics", tier: "Status", stars: "Stars", pushed: "Last push" },
  sortBy: "Sort by",
  upstream: "upstream",
  archived: "Archived",
  unavailable: "Repository gone",
  notStated: "not stated",
  details: "Details",
  openRepo: "Open repository",
  empty: { title: "No port matches these filters.", body: "Clear a filter, or tell us about a port we are missing.", cta: "Submit a port" },
  tiers: {
    playable: { label: "Playable", hint: "Boots, loads saves and plays with sound, as its README states." },
    ingame: { label: "In-game", hint: "Reaches gameplay; not yet called playable." },
    intro: { label: "Intro", hint: "Title screen, menus or opening scenes only." },
    wip: { label: "In progress", hint: "Work under way; no tested state declared yet." },
    unrated: { label: "Not stated", hint: "The project's README does not declare a status." },
  } satisfies Record<Tier, { label: string; hint: string }>,
  platforms: {
    linux: "Linux", steamdeck: "Steam Deck", windows: "Windows", macos: "macOS", android: "Android", arm: "ARM",
  } satisfies Record<Platform, string>,
  footer: {
    disclaimer: "Community index. Not affiliated with Sony Interactive Entertainment, FromSoftware, any game publisher, or the authors of the projects listed.",
    noFiles: "This site links source code only. It never hosts or links game files, dumps or keys: every port needs your own copy of the game.",
    updated: "Repository data refreshed",
    never: "not yet fetched",
    source: "Site source",
  },
  detail: {
    back: "All ports",
    games: "Games", game: "Game", titleIds: "Title IDs", tier: "Status", evidence: "Status source",
    facts: "Repository", platforms: "Platforms", graphics: "Graphics", upstream: "Forked from", ahead: "Commits ahead of upstream",
    license: "License", pushed: "Last push", stars: "Stars", release: "Latest release", noRelease: "No release yet", notChecked: "Not checked yet",
    ownCopy: "You need your own dump of the game. Read the project's README before installing anything; releases are published by its authors, not by this site.",
    unknown: "Unknown",
  },
  ago: "ago",
};

const ptbr: typeof en = {
  siteName: "PS4 Native Ports",
  siteDescription: "Um catálogo curado de ports nativos para PC derivados do bbport: builds do Bloodborne para outras plataformas e ports de outros jogos de PS4, com status e atividade.",
  nav: { catalog: "Catálogo", submit: "Enviar um port", about: "Sobre" },
  langName: "Português",
  otherLang: "English",
  skip: "Pular para o catálogo",
  search: { label: "Buscar ports", placeholder: "Jogo, port, repositório ou ID (CUSA03173)", clear: "Limpar busca" },
  filters: {
    game: "Jogo", allGames: "Todos os jogos", platform: "Plataforma", tier: "Status", reset: "Limpar filtros",
  },
  count: (ports: number, games: number) => `${ports} ${ports === 1 ? "port" : "ports"} em ${games} ${games === 1 ? "jogo" : "jogos"}`,
  stripLabel: "Status dos ports exibidos",
  cols: { game: "Jogo", port: "Port", platforms: "Plataformas", graphics: "Gráficos", tier: "Status", stars: "Estrelas", pushed: "Último push" },
  sortBy: "Ordenar por",
  upstream: "upstream",
  archived: "Arquivado",
  unavailable: "Repositório removido",
  notStated: "não informado",
  details: "Detalhes",
  openRepo: "Abrir repositório",
  empty: { title: "Nenhum port corresponde a esses filtros.", body: "Remova um filtro ou conte pra gente sobre um port que está faltando.", cta: "Enviar um port" },
  tiers: {
    playable: { label: "Jogável", hint: "Inicia, carrega saves e roda com som, segundo o README." },
    ingame: { label: "Em jogo", hint: "Chega ao gameplay; ainda não é considerado jogável." },
    intro: { label: "Introdução", hint: "Só tela de título, menus ou cenas de abertura." },
    wip: { label: "Em andamento", hint: "Trabalho em curso; nenhum estado testado declarado ainda." },
    unrated: { label: "Não informado", hint: "O README do projeto não declara um status." },
  },
  platforms: {
    linux: "Linux", steamdeck: "Steam Deck", windows: "Windows", macos: "macOS", android: "Android", arm: "ARM",
  },
  footer: {
    disclaimer: "Índice comunitário. Sem afiliação com a Sony Interactive Entertainment, a FromSoftware, qualquer publisher ou os autores dos projetos listados.",
    noFiles: "Este site só aponta para código-fonte. Nunca hospeda nem linka arquivos de jogo, dumps ou chaves: todo port exige a sua própria cópia do jogo.",
    updated: "Dados dos repositórios atualizados em",
    never: "ainda não buscados",
    source: "Código do site",
  },
  detail: {
    back: "Todos os ports",
    games: "Jogos", game: "Jogo", titleIds: "IDs do título", tier: "Status", evidence: "Fonte do status",
    facts: "Repositório", platforms: "Plataformas", graphics: "Gráficos", upstream: "Fork de", ahead: "Commits à frente do upstream",
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
