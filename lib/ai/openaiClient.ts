import "server-only";

import OpenAI from "openai";

import { getOpenAiEnv } from "@/lib/env.server";

export const openai = new OpenAI({
  apiKey: getOpenAiEnv().OPENAI_API_KEY
});

