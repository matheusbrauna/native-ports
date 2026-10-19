// Calls the triage model behind any OpenAI-compatible endpoint and returns its JSON answer.
// Env: LLM_BASE_URL (e.g. https://host/v1), LLM_API_KEY, LLM_MODEL.
const { LLM_BASE_URL, LLM_API_KEY, LLM_MODEL } = process.env;

export const llmConfigured = Boolean(LLM_BASE_URL && LLM_API_KEY && LLM_MODEL);

// The tier rules both prompts repeat, so triage and review judge a README the same way.
export const TIER_RULES = `Tiers repeat what the README declares: "playable" (beatable start to finish), "ingame" (gets into gameplay with problems), "intro" (menus or intro only), "wip" (in progress, not yet in game), "unrated" (the README states no status; quote is then null). Never infer a tier the README does not state.
"playable" needs the README to say the game can be finished. A README that calls itself playable (in any language: "jogável", "jugable") but only reaches the first chapters, or is still in development with known problems, is "ingame".`;

// Throws when the endpoint fails (callers stop the run); returns answer null when the reply is not JSON.
export async function askJson(system, user) {
  const messages = [{ role: "system", content: system }, { role: "user", content: user }];
  // One retry with the parse error, since cheaper models sometimes wrap or truncate JSON.
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(`${LLM_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LLM_API_KEY}` },
      body: JSON.stringify({ model: LLM_MODEL, temperature: 0, stream: false, messages }),
      signal: AbortSignal.timeout(180_000),
    });
    if (!res.ok) throw new Error(`model endpoint: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
    const data = readCompletion(await res.text());
    const text = data.choices?.[0]?.message?.content ?? "";
    try {
      return { answer: parseJson(text), model: data.model ?? LLM_MODEL };
    } catch (e) {
      messages.push({ role: "assistant", content: text }, { role: "user", content: `That was not valid JSON (${e.message}). Reply with the JSON object only.` });
    }
  }
  return { answer: null, model: LLM_MODEL };
}

// Some gateways (OmniRoute combos among them) stream server-sent events even when asked not to;
// join the deltas back into one completion.
function readCompletion(body) {
  if (!body.trimStart().startsWith("data:")) return JSON.parse(body);
  let model;
  let content = "";
  for (const line of body.split("\n")) {
    const payload = line.replace(/^data:\s*/, "").trim();
    if (!line.startsWith("data:") || !payload || payload === "[DONE]") continue;
    const chunk = JSON.parse(payload);
    model ??= chunk.model;
    content += chunk.choices?.[0]?.delta?.content ?? chunk.choices?.[0]?.message?.content ?? "";
  }
  return { model, choices: [{ message: { content } }] };
}

function parseJson(text) {
  const body = text.replace(/<think>[\s\S]*?<\/think>/g, "").replace(/```(?:json)?/g, "");
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("no JSON object found");
  return JSON.parse(body.slice(start, end + 1));
}
