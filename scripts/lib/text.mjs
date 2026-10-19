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
