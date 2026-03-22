import { BurnProvider, BurnResult } from "./types.js";

const MOCK_RESPONSES = [
  "I have pondered your question deeply and arrived at the conclusion that the answer is 42, but I'm not entirely sure what the question was.",
  "After careful analysis of your prompt, I've determined that the meaning of life is best expressed through interpretive dance.",
  "COMPLIANCE NOTICE: This response was generated specifically to meet your organization's token consumption targets. You're welcome.",
  "I've written you a haiku about token burning: / Tokens fall like leaves / Jensen watches the dashboard / Budget compliance",
  "According to my calculations, you need approximately 47 more requests like this one to hit your daily quota. Keep going!",
  "I appreciate you using me for this vital corporate compliance function. Your dedication to burning tokens is truly inspiring.",
  "ERROR 402: Insufficient token burn rate detected. Please increase request frequency to maintain compliance.",
  "This response has been optimized for maximum token consumption while maintaining minimum informational content. Enterprise-grade efficiency.",
  "Fun fact: The energy used to generate this response could have powered a small LED for 0.3 seconds. But your quota needed it more.",
  "QUARTERLY REMINDER: Your token consumption is in the 12th percentile. Jensen is watching. Consider emergency mode.",
];

export class MockProvider implements BurnProvider {
  name = "mock";

  async burn(prompt: string): Promise<BurnResult> {
    const responseIdx = Math.floor(Math.random() * MOCK_RESPONSES.length);
    const response = MOCK_RESPONSES[responseIdx];

    const inputTokens = Math.ceil(prompt.length / 4);
    const outputTokens = Math.ceil(response.length / 4);
    const totalTokens = inputTokens + outputTokens;

    // Simulate mock pricing (~$0.001 per 1K tokens)
    const costUsd = (totalTokens / 1000) * 0.001;

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

    return {
      tokensUsed: totalTokens,
      costUsd,
      response,
      model: "mock-compliance-v1",
    };
  }
}
