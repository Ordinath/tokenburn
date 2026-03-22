import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { executeBurn } from "../src/burner.js";

const TEST_DIR = path.join(os.tmpdir(), ".tokenburn-test-burner-" + Date.now());
const ORIGINAL_HOME = process.env.HOME;

describe("burner", () => {
  beforeEach(() => {
    process.env.HOME = TEST_DIR;
    fs.mkdirSync(path.join(TEST_DIR, ".tokenburn"), { recursive: true });
  });

  afterEach(() => {
    process.env.HOME = ORIGINAL_HOME;
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("executes a mock burn session", async () => {
    const result = await executeBurn({
      requests: 2,
      strategy: "existential",
      emergency: false,
      bossMode: false,
      provider: "mock",
      quiet: true,
    });

    expect(result.requests).toBe(2);
    expect(result.tokensUsed).toBeGreaterThan(0);
    expect(result.costUsd).toBeGreaterThan(0);
    expect(result.responses).toHaveLength(2);
    expect(result.provider).toBe("mock");
    expect(result.strategy).toBe("existential");
  });

  it("emergency mode multiplies requests by 10", async () => {
    const result = await executeBurn({
      requests: 1,
      strategy: "sisyphus",
      emergency: true,
      bossMode: false,
      provider: "mock",
      quiet: true,
    });

    expect(result.requests).toBe(10);
  });

  it("records session in history", async () => {
    await executeBurn({
      requests: 1,
      strategy: "bureaucrat",
      emergency: false,
      bossMode: false,
      provider: "mock",
      quiet: true,
    });

    const historyFile = path.join(TEST_DIR, ".tokenburn", "history.json");
    expect(fs.existsSync(historyFile)).toBe(true);
    const history = JSON.parse(fs.readFileSync(historyFile, "utf-8"));
    expect(history).toHaveLength(1);
    expect(history[0].strategy).toBe("bureaucrat");
  });
});
