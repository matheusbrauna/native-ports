import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readFileSync } from "node:fs";

// On GitHub Pages the workflow sets SITE_URL and BASE_PATH from the repository;
// locally the site serves from the root.
const site = process.env.SITE_URL || "http://localhost:4321";
const base = process.env.BASE_PATH || "/";

// Every page changes when repository data is refreshed, so that date is its lastmod.
let lastmod;
try {
  lastmod = JSON.parse(readFileSync(new URL("./src/data/github.json", import.meta.url), "utf8")).fetchedAt ?? undefined;
} catch {
  lastmod = undefined;
}

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  integrations: [
    sitemap({
      i18n: { defaultLocale: "en", locales: { en: "en", "pt-br": "pt-BR" } },
      filter: (page) => !/\/og\/|\/404\/?$/.test(page),
      serialize(item) {
        const isHome = /^\/(pt-br\/)?$/.test(new URL(item.url).pathname.replace(base.replace(/\/$/, ""), "") || "/");
        return { ...item, lastmod, changefreq: isHome ? "daily" : "weekly", priority: isHome ? 1 : /\/games\//.test(item.url) ? 0.8 : 0.6 };
      },
    }),
  ],
});
