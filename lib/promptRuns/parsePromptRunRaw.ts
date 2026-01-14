export type PromptRunRaw = {
  prompt: string | null;
  category: string | null;
  answer_text: string | null;
  citations: string[] | null;
  openai_raw: string | null;
};

export function parsePromptRunRaw(raw: string): PromptRunRaw {
  try {
    const parsed = JSON.parse(raw) as Partial<PromptRunRaw>;
    return {
      prompt: typeof parsed.prompt === "string" ? parsed.prompt : null,
      category: typeof parsed.category === "string" ? parsed.category : null,
      answer_text: typeof parsed.answer_text === "string" ? parsed.answer_text : null,
      citations: Array.isArray(parsed.citations)
        ? parsed.citations.filter((c): c is string => typeof c === "string")
        : null,
      openai_raw: typeof parsed.openai_raw === "string" ? parsed.openai_raw : null
    };
  } catch {
    return {
      prompt: null,
      category: null,
      answer_text: null,
      citations: null,
      openai_raw: null
    };
  }
}

export function toAnswerPreview(answerText: string | null, max = 180) {
  if (!answerText) return null;
  const singleLine = answerText.replace(/\s+/g, " ").trim();
  if (singleLine.length <= max) return singleLine;
  return `${singleLine.slice(0, max).trim()}…`;
}

