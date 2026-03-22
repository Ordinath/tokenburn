import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import os from "os";
import { loadConfig, saveConfig, calculateQuota, TokenBurnConfig, appendHistory, loadHistory } from "../src/config.js";

const TEST_DIR = path.join(os.tmpdir(), ".tokenburn-test-" + Date.now());
const ORIGINAL_HOME = process.env.HOME;

describe("config", () => {
  beforeEach(() => {
    process.env.HOME = TEST_DIR;
    fs.mkdirSync(path.join(TEST_DIR, ".tokenburn"), { recursive: true });
  });

  afterEach(() => {
    process.env.HOME = ORIGINAL_HOME;
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("returns default config when no config file exists", () => {
    const config = loadConfig();
    expect(config.salary).toBe(500000);
    expect(config.provider).toBe("mock");
    expect(config.burnedTokens).toBe(0);
  });

  it("saves and loads config", () => {
    const config: TokenBurnConfig = {
      salary: 300000,
      currency: "EUR",
      provider: "openai",
      apiKey: "test-key",
      burnedTokens: 1000,
      burnedCost: 0.05,
      quotaPeriod: "quarterly",
      startDate: "2026-01-01",
    };
    saveConfig(config);
    const loaded = loadConfig();
    expect(loaded.salary).toBe(300000);
    expect(loaded.currency).toBe("EUR");
    expect(loaded.provider).toBe("openai");
  });

  it("calculates quota correctly", () => {
    const config = loadConfig();
    config.salary = 500000;
    config.quotaPeriod = "yearly";
    const quota = calculateQuota(config);
    expect(quota.totalBudget).toBe(250000);
    expect(quota.periodDays).toBe(365);
    expect(quota.dailyTarget).toBeCloseTo(684.93, 1);
  });

  it("calculates monthly quota", () => {
    const config = loadConfig();
    config.salary = 120000;
    config.quotaPeriod = "monthly";
    const quota = calculateQuota(config);
    expect(quota.totalBudget).toBe(60000);
    expect(quota.periodDays).toBe(30);
    expect(quota.dailyTarget).toBe(2000);
  });

  it("tracks burn history", () => {
    appendHistory({
      timestamp: new Date().toISOString(),
      strategy: "existential",
      provider: "mock",
      tokensUsed: 500,
      costUsd: 0.001,
      duration: 1000,
      requests: 5,
    });
    const history = loadHistory();
    expect(history).toHaveLength(1);
    expect(history[0].strategy).toBe("existential");
    expect(history[0].tokensUsed).toBe(500);
  });
});
