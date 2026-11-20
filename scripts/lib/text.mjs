// README text helpers shared by triage.mjs and review.mjs.

// The stored citation is plain text: links keep their label, emphasis and quote marks go.
export const unmark = (s) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/^\s*>\s*/gm, "").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();

// Markdown, typography and spacing differ between a README and a model's copy of it.
export const plain = (s) =>
  unmark(s).toLowerCase().replace(/[#|\\[\]]/g, "").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();

// A quote counts only if it is long enough to mean something and appears in the README.
export const quoteIn = (quote, readme) => typeof quote === "string" && plain(quote).length >= 12 && plain(readme).includes(plain(quote));

// The citation stored in ports.json, minus its "README: " prefix.
export const quoteOf = (source) => (source ?? "").replace(/^README:\s*/, "");

// A playable quote has to say the game can be finished. "playable" on its own does not.
// Accents are folded first, so "início" and "inicio" take the same path as slugify.
const COMPLETION_SIGNAL = new RegExp(
  [
    // "the whole game plays like ..." is a goal, and "whole game playable 90 %" is unfinished.
    String.raw`\b(?:entire|whole|full) games?\b(?!\s+(?:files|data|dump|rom|iso|image|disc|is not|is compiled|was compiled|plays like|playable\s*\|?\s*\d))`,
    String.raw`\bbeginning to end\b`,
    String.raw`\bstart to finish\b`,
    String.raw`\bend to end\b`,
    String.raw`\bcompletable\b`,
    String.raw`\bcompletavel\b`,
    String.raw`\b(?:can be|has been) (?:fully |completely )?(?:beaten|finished|completed)\b`,
    String.raw`\bfully playable\b`,
    String.raw`(?<!\d)100\s*%`,
    // End-of-game credits, not a Credits heading or a translated credits screen.
    String.raw`\b(?:the credits|end(?:ing)? credits|credits roll|to the credits|reach(?:es|ed)? the credits|creditos finais|ate os creditos)\b`,
    String.raw`\bzer(?:ar|a|ado|ada|ados|adas|avel|aveis)\b`,
    String.raw`\bdo inicio ao fim\b`,
    String.raw`\bdo comeco ao fim\b`,
    String.raw`\bjogo inteiro\b`,
  ].join("|"),
  "i",
);

const fold = (s) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function hasCompletionSignal(quote) {
  if (typeof quote !== "string") return false;
  // A denial in the same sentence ("not ... the whole game", "has not been finished") is not a signal.
  const text = fold(quote).replace(/\bnot\b[^.]{0,80}/g, " ");
  return COMPLETION_SIGNAL.test(text);
}

// The model may call a port playable because the README uses that word. Without a completion
// signal the quote cannot support playable: a new entry drops to ingame, and a review never
// raises the tier it already has. An entry that was already playable drops to ingame too,
// because this quote no longer says the game can be finished.
const TIER_RANK = { unrated: 0, wip: 1, intro: 2, ingame: 3, playable: 4 };

export function guardPlayable(proposed, quote, previous = null) {
  if (proposed !== "playable" || hasCompletionSignal(quote)) return proposed;
  if (previous == null) return "ingame";
  return (TIER_RANK[previous] ?? 0) >= TIER_RANK.ingame ? "ingame" : previous;
}
