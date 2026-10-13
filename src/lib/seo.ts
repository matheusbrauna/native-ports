// Titles, descriptions and structured data for every page type.
// Titles lead with what people search for: the game's name plus "PC port".
import { fetchedAt, getGame, platformsOf, repoUrl, type Console, type Entry, type Game, type Lang, type Port } from "./catalog";
import { t, path, locale } from "./i18n";

const list = (items: string[], lang: Lang) =>
  new Intl.ListFormat(locale[lang], { style: "long", type: "conjunction" }).format(items);

const clip = (s: string, max = 158) => (s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, "")}…`);

/** Path of the Open Graph image for a page, mirroring the page path. */
export function ogPath(pagePath: string, lang: Lang): string {
  const clean = pagePath.replace(/^\/|\/$/g, "") || "index";
  return path(`/og/${lang}/${clean}.png`, "en");
}

export function homeMeta(lang: Lang, portCount: number, gameCount: number) {
  return lang === "en"
    ? {
        title: "Native Ports: console games running natively on PC",
        description: `${portCount} unofficial native PC ports of ${gameCount} console games: Xbox 360, N64 and PS4 recompilations and runtimes. Search by game, console and device.`,
      }
    : {
        title: "Native Ports: jogos de console rodando nativamente no PC",
        description: `${portCount} ports nativos não oficiais de ${gameCount} jogos de console para PC: recompilações e runtimes de Xbox 360, N64 e PS4. Busque por jogo, console e dispositivo.`,
      };
}

export function gameMeta(game: Game, list_: Entry[], lang: Lang) {
  const s = t[lang];
  const consoleName = s.consoles[game.console];
  const n = list_.length;
  const plats = list(platformsOf(list_).map((p) => s.platforms[p]), lang);
  const playable = list_.filter((e) => e.tier === "playable").length;
  if (lang === "en") {
    return {
      title: `${game.title} on PC: native ${n === 1 ? "port" : "ports"} (${consoleName})`,
      description: clip(
        `${n} unofficial native ${n === 1 ? "port" : "ports"} of ${game.title} (${consoleName}) for ${plats || "PC"}${playable ? `, ${playable} declared playable` : ""}. Status, toolchain and source code for each project; bring your own copy of the game.`,
      ),
    };
  }
  return {
    title: `${game.title} no PC: ${n === 1 ? "port nativo" : "ports nativos"} (${consoleName})`,
    description: clip(
      `${n} ${n === 1 ? "port nativo não oficial" : "ports nativos não oficiais"} de ${game.title} (${consoleName}) para ${plats || "PC"}${playable ? `, ${playable} ${playable === 1 ? "declarado jogável" : "declarados jogáveis"}` : ""}. Status, toolchain e código-fonte de cada projeto; use a sua própria cópia do jogo.`,
    ),
  };
}

export function consoleMeta(c: Console, gameCount: number, portCount: number, lang: Lang) {
  const name = t[lang].consoles[c];
  return lang === "en"
    ? {
        title: `${name} games running natively on PC`,
        description: `${portCount} unofficial native PC ports of ${gameCount} ${name} ${gameCount === 1 ? "game" : "games"}, with each project's declared status, toolchain and supported devices.`,
      }
    : {
        title: `Jogos de ${name} rodando nativamente no PC`,
        description: `${portCount} ports nativos não oficiais de ${gameCount} ${gameCount === 1 ? "jogo" : "jogos"} de ${name} para PC, com o status declarado, a toolchain e os dispositivos de cada projeto.`,
      };
}

export function portMeta(port: Port, lang: Lang) {
  const s = t[lang];
  const gs = port.games.map((g) => getGame(g.id));
  const first = gs[0];
  const consoleName = s.consoles[first.console];
  const gameNames = gs.length > 2 ? `${gs[0].title} ${lang === "en" ? "and more" : "e outros"}` : list(gs.map((g) => g.title), lang);
  const tier = s.tiers[port.games[0].tier].label;
  return lang === "en"
    ? {
        title: `${port.name}: ${gameNames} native PC port (${consoleName})`,
        description: clip(`${port.notes.en} Status: ${tier}. ${s.techniques[port.technique].label}${port.toolchain ? ` with ${port.toolchain}` : ""}.`),
      }
    : {
        title: `${port.name}: port nativo de ${gameNames} para PC (${consoleName})`,
        description: clip(`${port.notes["pt-br"]} Status: ${tier}. ${s.techniques[port.technique].label}${port.toolchain ? ` com ${port.toolchain}` : ""}.`),
      };
}

// ---------- JSON-LD ----------

export function abs(p: string, site: URL): string {
  return new URL(p, site).href;
}

export function websiteLd(lang: Lang, site: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Native Ports",
    url: abs(path("/", lang), site),
    inLanguage: locale[lang],
    description: homeMeta(lang, 0, 0).title,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${abs(path("/", lang), site)}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[], site: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path, site) })),
  };
}

export function videoGameLd(game: Game, lang: Lang) {
  return { "@type": "VideoGame", name: game.title, gamePlatform: t[lang].consoles[game.console] };
}

export function portLd(port: Port, lang: Lang, site: URL) {
  const s = t[lang];
  const f = port.facts;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: port.name,
    url: abs(path(`/ports/${port.slug}/`, lang), site),
    codeRepository: repoUrl(port.repo),
    description: port.notes[lang],
    inLanguage: locale[lang],
    runtimePlatform: port.platforms.map((p) => s.platforms[p]),
    ...(f?.license && f.license !== "NOASSERTION" ? { license: `https://spdx.org/licenses/${f.license}.html` } : {}),
    ...(f?.pushedAt ? { dateModified: f.pushedAt } : {}),
    about: port.games.map((g) => videoGameLd(getGame(g.id), lang)),
    ...(port.upstream ? { isBasedOn: repoUrl(port.upstream) } : {}),
  };
}

export function collectionLd(name: string, description: string, pagePath: string, lang: Lang, site: URL, items: { name: string; path: string }[], about?: object) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: abs(pagePath, site),
    inLanguage: locale[lang],
    ...(fetchedAt ? { dateModified: fetchedAt } : {}),
    ...(about ? { about } : {}),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path, site) })),
    },
  };
}
