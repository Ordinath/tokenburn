import { describe, it, expect } from "vitest";
import { MockProvider } from "../src/providers/mock.js";
import { createProvider } from "../src/providers/index.js";

describe("providers", () => {
  it("mock provider returns valid result", async () => {
    const provider = new MockProvider();
    const result = await provider.burn("Test prompt");
    expect(result.tokensUsed).toBeGreaterThan(0);
    expect(result.costUsd).toBeGreaterThan(0);
    expect(result.response.length).toBeGreaterThan(0);
    expect(result.model).toBe("mock-compliance-v1");
  });

  it("mock provider simulates delay", async () => {
    const provider = new MockProvider();
    const start = Date.now();
    await provider.burn("Test");
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(150);
  });

  it("createProvider creates mock provider", () => {
    const provider = createProvider("mock");
    expect(provider.name).toBe("mock");
  });

  it("createProvider throws on unknown provider", () => {
    expect(() => createProvider("unknown" as any)).toThrow(
      "Unknown provider",
    );
  });
});
