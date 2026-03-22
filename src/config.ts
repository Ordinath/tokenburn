import fs from "fs";
import path from "path";
import os from "os";

export interface TokenBurnConfig {
  salary: number;
  currency: string;
  provider: "openai" | "anthropic" | "mock";
  apiKey?: string;
  model?: string;
  burnedTokens: number;
  burnedCost: number;
  quotaPeriod: "monthly" | "quarterly" | "yearly";
  startDate: string;
}

const DEFAULT_CONFIG: TokenBurnConfig = {
  salary: 500000,
  currency: "USD",
  provider: "mock",
  burnedTokens: 0,
  burnedCost: 0,
  quotaPeriod: "yearly",
  startDate: new Date().toISOString().split("T")[0],
};

export function getConfigDir(): string {
  return path.join(os.homedir(), ".tokenburn");
}

function getConfigFile(): string {
  return path.join(getConfigDir(), "config.json");
}

function getHistoryFile(): string {
  return path.join(getConfigDir(), "history.json");
}

export function ensureConfigDir(): void {
  const dir = getConfigDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function loadConfig(): TokenBurnConfig {
  ensureConfigDir();
  const file = getConfigFile();
  if (!fs.existsSync(file)) {
    return { ...DEFAULT_CONFIG };
  }
  const raw = fs.readFileSync(file, "utf-8");
  return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
}

export function saveConfig(config: TokenBurnConfig): void {
  ensureConfigDir();
  fs.writeFileSync(getConfigFile(), JSON.stringify(config, null, 2));
}

export interface BurnSession {
  timestamp: string;
  strategy: string;
  provider: string;
  tokensUsed: number;
  costUsd: number;
  duration: number;
  requests: number;
}

export function loadHistory(): BurnSession[] {
  ensureConfigDir();
  const file = getHistoryFile();
  if (!fs.existsSync(file)) {
    return [];
  }
  const raw = fs.readFileSync(file, "utf-8");
  return JSON.parse(raw);
}

export function appendHistory(session: BurnSession): void {
  const history = loadHistory();
  history.push(session);
  fs.writeFileSync(getHistoryFile(), JSON.stringify(history, null, 2));
}

export function calculateQuota(config: TokenBurnConfig): {
  totalBudget: number;
  dailyTarget: number;
  periodDays: number;
} {
  const halfSalary = config.salary / 2;
  const periodDays =
    config.quotaPeriod === "monthly"
      ? 30
      : config.quotaPeriod === "quarterly"
        ? 90
        : 365;
  const dailyTarget = halfSalary / periodDays;
  return { totalBudget: halfSalary, dailyTarget, periodDays };
}
