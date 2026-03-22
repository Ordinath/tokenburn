import { BurnProvider } from "./types.js";
import { MockProvider } from "./mock.js";
import { OpenAIProvider } from "./openai.js";
import { AnthropicProvider } from "./anthropic.js";

export type ProviderName = "openai" | "anthropic" | "mock";

export function createProvider(
  name: ProviderName,
  apiKey?: string,
  model?: string,
): BurnProvider {
  switch (name) {
    case "openai":
      return new OpenAIProvider(apiKey, model);
    case "anthropic":
      return new AnthropicProvider(apiKey, model);
    case "mock":
      return new MockProvider();
    default:
      throw new Error(`Unknown provider: ${name}. Jensen would not approve.`);
  }
}

export { BurnProvider, BurnResult } from "./types.js";
