import { describe, it, expect } from "vitest";
import { ExistentialStrategy } from "../src/strategies/existential.js";
import { SisyphusStrategy } from "../src/strategies/sisyphus.js";
import { BureaucratStrategy } from "../src/strategies/bureaucrat.js";
import { InceptionStrategy } from "../src/strategies/inception.js";
import { createStrategy, listStrategies } from "../src/strategies/index.js";

describe("strategies", () => {
  it("existential generates unique prompts", () => {
    const s = new ExistentialStrategy();
    const p1 = s.generatePrompt(0);
    const p2 = s.generatePrompt(1);
    expect(p1).not.toBe(p2);
    expect(p1.length).toBeGreaterThan(50);
  });

  it("sisyphus includes iteration-based numbers", () => {
    const s = new SisyphusStrategy();
    const p1 = s.generatePrompt(0);
    const p2 = s.generatePrompt(1);
    expect(p1).not.toBe(p2);
  });

  it("bureaucrat generates corporate memos", () => {
    const s = new BureaucratStrategy();
    const p = s.generatePrompt(0);
    expect(p.length).toBeGreaterThan(50);
  });

  it("inception generates initial prompt on iteration 0", () => {
    const s = new InceptionStrategy();
    const p = s.generatePrompt(0);
    expect(p).toContain("Jensen Huang");
    expect(p).toContain("500-word");
  });

  it("inception uses previous response for subsequent iterations", () => {
    const s = new InceptionStrategy();
    s.generatePrompt(0);
    s.updateContext("Some previous AI response about token burning.");
    const p = s.generatePrompt(1);
    expect(p).toContain("Some previous AI response");
  });

  it("createStrategy creates valid strategies", () => {
    expect(createStrategy("existential").name).toBe("existential");
    expect(createStrategy("sisyphus").name).toBe("sisyphus");
    expect(createStrategy("bureaucrat").name).toBe("bureaucrat");
    expect(createStrategy("inception").name).toBe("inception");
  });

  it("createStrategy random returns a valid strategy", () => {
    const s = createStrategy("random");
    expect(["existential", "sisyphus", "bureaucrat", "inception"]).toContain(
      s.name,
    );
  });

  it("listStrategies returns all strategies", () => {
    const strategies = listStrategies();
    expect(strategies).toHaveLength(4);
    const names = strategies.map((s) => s.name);
    expect(names).toContain("existential");
    expect(names).toContain("sisyphus");
    expect(names).toContain("bureaucrat");
    expect(names).toContain("inception");
  });
});
