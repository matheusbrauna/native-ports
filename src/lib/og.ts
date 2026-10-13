// Renders 1200x630 Open Graph cards at build time: satori lays out, resvg rasterizes.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { TIERS, type Lang, type Tier } from "./catalog";
import { t } from "./i18n";

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFileSync(require.resolve(`@fontsource/${pkg}/files/${file}`));
const fonts = [
  { name: "Atkinson Hyperlegible", data: font("atkinson-hyperlegible", "atkinson-hyperlegible-latin-400-normal.woff"), weight: 400 as const, style: "normal" as const },
  { name: "Atkinson Hyperlegible", data: font("atkinson-hyperlegible", "atkinson-hyperlegible-latin-700-normal.woff"), weight: 700 as const, style: "normal" as const },
  { name: "JetBrains Mono", data: font("jetbrains-mono", "jetbrains-mono-latin-400-normal.woff"), weight: 400 as const, style: "normal" as const },
];

const C = {
  ground: "#16181d", panel: "#1c1f26", line: "#2c313a", ink: "#e6e8ec", ink2: "#b3bac6", ink3: "#8d96a5",
  tier: { playable: "#3ecf6e", ingame: "#f2c94c", intro: "#f2994a", wip: "#b195f5", unrated: "#4a515d" } as Record<Tier, string>,
};

export interface OgSpec {
  lang: Lang;
  title: string;
  /** Data line under the title, e.g. "Xbox 360 · 2 ports · ReXGlue". */
  meta: string;
  counts?: Record<Tier, number>;
}

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string | null | false)[]): Node => ({
  type,
  props: { style: { display: "flex", ...style }, children: children.filter(Boolean) },
});

export async function renderOg(spec: OgSpec): Promise<Buffer> {
  const s = t[spec.lang];
  const counts = spec.counts;
  const total = counts ? TIERS.reduce((n, tier) => n + counts[tier], 0) : 0;
  const titleSize = spec.title.length > 44 ? 64 : spec.title.length > 26 ? 78 : 96;

  const tree = h(
    "div",
    { width: 1200 - 144, height: 630 - 128, flexDirection: "column", justifyContent: "space-between", background: C.ground, padding: "64px 72px", boxSizing: "content-box", fontFamily: "Atkinson Hyperlegible", color: C.ink },
    // Wordmark: the site's three-bar mark in ink tones.
    h("div", { alignItems: "center", gap: 18 },
      h("div", { flexDirection: "column", gap: 7 },
        h("div", { width: 44, height: 7, borderRadius: 2, background: C.ink }),
        h("div", { width: 31, height: 7, borderRadius: 2, background: C.ink2 }),
        h("div", { width: 18, height: 7, borderRadius: 2, background: C.ink3 }),
      ),
      h("div", { fontSize: 34, fontWeight: 700 }, "Native Ports"),
    ),
    h("div", { flexDirection: "column", gap: 22 },
      h("div", { fontSize: titleSize, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 1056 }, spec.title),
      h("div", { fontFamily: "JetBrains Mono", fontSize: 30, color: C.ink2 }, spec.meta),
    ),
    counts && total > 0
      ? h("div", { flexDirection: "column", gap: 18 },
          h("div", { height: 22, borderRadius: 4, overflow: "hidden", gap: 4, background: C.panel },
            ...TIERS.filter((tier) => counts[tier] > 0).map((tier) => h("div", { flexGrow: counts[tier], background: C.tier[tier] })),
          ),
          h("div", { gap: 30, fontSize: 26, color: C.ink2 },
            ...TIERS.filter((tier) => counts[tier] > 0).map((tier) =>
              h("div", { alignItems: "center", gap: 10 },
                h("div", { width: 16, height: 16, borderRadius: 3, background: C.tier[tier] }),
                `${s.tiers[tier].label} ${counts[tier]}`,
              ),
            ),
          ),
        )
      : h("div", { height: 22, borderRadius: 4, background: C.line }),
  );

  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
