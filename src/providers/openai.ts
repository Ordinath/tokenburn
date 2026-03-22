import OpenAI from "openai";
import { BurnProvider, BurnResult } from "./types.js";

// Pricing per 1M tokens (USD) — approximate, varies by model
const PRICING: Record<string, { input: number; output: number }> = {
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4.1-nano": { input: 0.1, output: 0.4 },
  "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
};

export class OpenAIProvider implements BurnProvider {
  name = "openai";
  private client: OpenAI;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.client = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
    this.model = model || "gpt-4o-mini";
  }

  async burn(prompt: string): Promise<BurnResult> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant participating in an important corporate token compliance exercise. Be verbose and thorough.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1024,
    });

    const usage = response.usage;
    const inputTokens = usage?.prompt_tokens || 0;
    const outputTokens = usage?.completion_tokens || 0;
    const totalTokens = inputTokens + outputTokens;

    const pricing = PRICING[this.model] || PRICING["gpt-4o-mini"];
    const costUsd =
      (inputTokens / 1_000_000) * pricing.input +
      (outputTokens / 1_000_000) * pricing.output;

    return {
      tokensUsed: totalTokens,
      costUsd,
      response: response.choices[0]?.message?.content || "",
      model: this.model,
    };
  }
}
