import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// On GitHub Pages the workflow sets SITE_URL and BASE_PATH from the repository;
// locally the site serves from the root.
const site = process.env.SITE_URL || "http://localhost:4321";
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  integrations: [
    sitemap({
      i18n: { defaultLocale: "en", locales: { en: "en", "pt-br": "pt-BR" } },
    }),
  ],
});
