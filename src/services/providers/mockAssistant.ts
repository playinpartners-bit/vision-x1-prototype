/**
 * Scripted assistant for the prototype. Matches the question against
 * keyword intents in assistant.json. Replace with a call to a backend
 * endpoint that runs retrieval over real data + an LLM.
 */
import assistantJson from '../../data/mock/assistant.json';
import type { AssistantReply } from '../../types/assistant';
import type { AssistantProvider } from '../types';

type Intent = { id: string; keywords: string[]; reply: Omit<AssistantReply, 'id'> };
const intents = assistantJson.intents as Intent[];
const fallback = assistantJson.fallback as Omit<AssistantReply, 'id'>;

function score(question: string, intent: Intent) {
  const q = question.toLowerCase().replace(/[’']/g, "'");
  // Whole-word match so e.g. "bet" doesn't fire on "between".
  return intent.keywords.reduce((s, k) => (new RegExp(`\\b${k}\\b`).test(q) ? s + k.length : s), 0);
}

export const mockAssistantProvider: AssistantProvider = {
  getSuggestedPrompts() {
    return assistantJson.suggestedPrompts;
  },
  async ask(question) {
    // Betting language is weighted heavily so the guardrail reply wins.
    const [best] = intents
      .map((i) => ({ i, s: score(question, i) * (i.id === 'guardrail' ? 10 : 1) }))
      .sort((a, b) => b.s - a.s);
    await new Promise((r) => setTimeout(r, 700));
    return { id: crypto.randomUUID(), ...(best.s > 0 ? best.i.reply : fallback) };
  },
};
