// Replies on each submission issue that the triage step decided on this run.
// Run in GitHub Actions after the discover pull request is opened or updated.
// Usage: node scripts/answer-submissions.mjs triage.json            comment, label and close as needed
//        node scripts/answer-submissions.mjs triage.json --closes   print "Closes #N" lines for the PR body
// Env: GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER (optional), SITE_URL (optional).
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const [file, mode] = process.argv.slice(2);
if (!file || !existsSync(file)) process.exit(0);
const decisions = JSON.parse(await readFile(file, "utf8"));

// Outcomes that the pull request settles close their issue when it is merged.
const SETTLED_BY_PR = ["added", "rejected"];
if (mode === "--closes") {
  // Issues answered and closed right away (already listed, duplicate, invalid) need no link.
  for (const d of decisions.filter((d) => [...SETTLED_BY_PR, "pending"].includes(d.outcome))) console.log(`${SETTLED_BY_PR.includes(d.outcome) ? "Closes" : "Refs"} #${d.issue}`);
  process.exit(0);
}

const { GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, SITE_URL, GITHUB_SERVER_URL = "https://github.com", GITHUB_API_URL = "https://api.github.com" } = process.env;
const api = (path, body, method = "POST") =>
  fetch(`${GITHUB_API_URL}/repos/${GITHUB_REPOSITORY}${path}`, {
    method,
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json", "User-Agent": "pc-ports-submissions" },
    body: JSON.stringify(body),
  }).then((r) => {
    if (!r.ok) console.warn(`[answer] ${method} ${path}: HTTP ${r.status}`);
  });

// The reason comes from the model, which read a third-party README: keep it short and unable to ping anyone.
const quote = (s) => s.replace(/@/g, "@​").replace(/\s+/g, " ").slice(0, 300);
const pr = PR_NUMBER ? `#${PR_NUMBER}` : "the next discover pull request";
const footer = `\n\n---\n_Answered by the daily [discover workflow](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/workflows/discover.yml)._`;

const messages = {
  added: (d) => `Thanks! The daily triage read the README and drafted an entry for **${d.repo}**: ${quote(d.reason)}\n\nA maintainer reviews it in ${pr}; this issue closes when that pull request is merged.`,
  rejected: (d) => `Thanks for the suggestion. The daily triage proposes leaving **${d.repo}** out: ${quote(d.reason)}\n\nA maintainer confirms this in ${pr}. If the triage got it wrong, reply here.`,
  pending: (d) => `Thanks! The triage could not settle **${d.repo}** on its own (${quote(d.reason)}), so a maintainer will review it by hand.`,
  listed: (d) => `Thanks! **${d.repo}** is already in the catalog${SITE_URL ? `: ${SITE_URL}` : ""}.`,
  duplicate: (d) => `Thanks! **${d.repo}** was already submitted in #${d.reason.match(/#(\d+)/)?.[1]}; it is followed up there.`,
  invalid: (d) => `This issue could not be processed: ${quote(d.reason)}. Please open a new submission with a link like \`https://github.com/owner/repository\`.`,
};

for (const d of decisions) {
  const message = messages[d.outcome];
  // "skipped" means a temporary error: leave the issue unlabelled so the next run tries again.
  if (!message) continue;
  await api(`/issues/${d.issue}/comments`, { body: message(d) + footer });
  await api(`/issues/${d.issue}/labels`, { labels: ["triaged"] });
  if (d.outcome === "listed") await api(`/issues/${d.issue}`, { state: "closed", state_reason: "completed" }, "PATCH");
  if (d.outcome === "invalid" || d.outcome === "duplicate") await api(`/issues/${d.issue}`, { state: "closed", state_reason: "not_planned" }, "PATCH");
}
