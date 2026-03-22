import Anthropic from "@anthropic-ai/sdk";
import { BurnProvider, BurnResult } from "./types.js";

const PRICING: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-6": { input: 3, output: 15 },
  "claude-haiku-4-5-20251001": { input: 0.8, output: 4 },
  "claude-3-5-haiku-20241022": { input: 0.8, output: 4 },
};

export class AnthropicProvider implements BurnProvider {
  name = "anthropic";
  private client: Anthropic;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
    this.model = model || "claude-haiku-4-5-20251001";
  }

  async burn(prompt: string): Promise<BurnResult> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system:
        "You are a helpful assistant participating in an important corporate token compliance exercise. Be verbose and thorough.",
      messages: [{ role: "user", content: prompt }],
    });

    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;

    const pricing = PRICING[this.model] || PRICING["claude-haiku-4-5-20251001"];
    const costUsd =
      (inputTokens / 1_000_000) * pricing.input +
      (outputTokens / 1_000_000) * pricing.output;

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as Anthropic.TextBlock).text)
      .join("\n");

    return {
      tokensUsed: totalTokens,
      costUsd,
      response: text,
      model: this.model,
    };
  }
}
