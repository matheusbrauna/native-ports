import type { APIRoute, GetStaticPaths } from "astro";
import { consoleGroups, entries, groups, ports, tierCounts, getGame, type Lang } from "../../../lib/catalog";
import { t } from "../../../lib/i18n";
import { renderOg, type OgSpec } from "../../../lib/og";

export const getStaticPaths: GetStaticPaths = () => {
  const out: { params: { lang: Lang; slug: string }; props: { spec: OgSpec } }[] = [];
  for (const lang of ["en", "pt-br"] as Lang[]) {
    const s = t[lang];
    const add = (slug: string, spec: Omit<OgSpec, "lang">) => out.push({ params: { lang, slug }, props: { spec: { lang, ...spec } } });
    const n = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;
    const ports_ = lang === "en" ? ["port", "ports"] : ["port", "ports"];
    const games_ = lang === "en" ? ["game", "games"] : ["jogo", "jogos"];

    add("index", {
      title: lang === "en" ? "Console games running natively on PC" : "Jogos de console rodando nativamente no PC",
      meta: `${n(entries.length, ports_[0], ports_[1])} · ${n(groups.length, games_[0], games_[1])} · ${n(consoleGroups.length, "console", "consoles")}`,
      counts: tierCounts(entries),
    });
    add("about", { title: s.nav.about, meta: `${s.techniques.recomp.label} · ${s.techniques.runtime.label}` });
    add("submit", { title: s.nav.submit, meta: lang === "en" ? "Every entry is reviewed by hand" : "Cada entrada é revisada à mão" });

    for (const g of groups) {
      const toolchains = [...new Set(g.entries.map((e) => e.port.toolchain).filter(Boolean))];
      add(`games/${g.game.id}`, {
        title: g.game.title,
        meta: [s.consoles[g.game.console], n(g.entries.length, ports_[0], ports_[1]), ...toolchains.slice(0, 2)].join(" · "),
        counts: tierCounts(g.entries),
      });
    }
    for (const c of consoleGroups) {
      const list = c.games.flatMap((g) => g.entries);
      add(`consoles/${c.console}`, {
        title: lang === "en" ? `${s.consoles[c.console]} games on PC` : `Jogos de ${s.consoles[c.console]} no PC`,
        meta: `${n(c.games.length, games_[0], games_[1])} · ${n(list.length, ports_[0], ports_[1])}`,
        counts: tierCounts(list),
      });
    }
    for (const p of ports) {
      const list = entries.filter((e) => e.port.slug === p.slug);
      const game = getGame(p.games[0].id);
      add(`ports/${p.slug}`, {
        title: p.games.length > 1 ? p.name : `${game.title}: ${p.name}`,
        meta: [s.consoles[game.console], p.toolchain ?? s.techniques[p.technique].label, ...p.platforms.slice(0, 3).map((x) => s.platforms[x])].join(" · "),
        counts: tierCounts(list),
      });
    }
  }
  return out;
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg((props as { spec: OgSpec }).spec);
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
