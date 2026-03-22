import { createProvider, BurnProvider, BurnResult } from "./providers/index.js";
import { createStrategy, BurnStrategy, StrategyName } from "./strategies/index.js";
import { InceptionStrategy } from "./strategies/inception.js";
import { loadConfig, appendHistory, calculateQuota, BurnSession } from "./config.js";
import { createBurnProgressBar, printBossMode } from "./display.js";

export interface BurnOptions {
  requests: number;
  strategy: StrategyName;
  emergency: boolean;
  bossMode: boolean;
  provider?: string;
  apiKey?: string;
  model?: string;
  quiet: boolean;
}

export interface BurnSessionResult {
  requests: number;
  tokensUsed: number;
  costUsd: number;
  duration: number;
  strategy: string;
  provider: string;
  responses: string[];
}

export async function executeBurn(
  options: BurnOptions,
): Promise<BurnSessionResult> {
  const config = loadConfig();
  const providerName = (options.provider || config.provider) as "openai" | "anthropic" | "mock";
  const provider = createProvider(providerName, options.apiKey || config.apiKey, options.model || config.model);
  const strategy = createStrategy(options.strategy);

  const totalRequests = options.emergency ? options.requests * 10 : options.requests;

  let progressBar: ReturnType<typeof createBurnProgressBar> | null = null;
  if (!options.quiet && !options.bossMode) {
    progressBar = createBurnProgressBar();
    progressBar.start(totalRequests, 0, { cost: "0.0000", tokens: 0 });
  }

  let totalTokens = 0;
  let totalCost = 0;
  const responses: string[] = [];
  const startTime = Date.now();

  for (let i = 0; i < totalRequests; i++) {
    const prompt = strategy.generatePrompt(i);

    try {
      const result: BurnResult = await provider.burn(prompt);
      totalTokens += result.tokensUsed;
      totalCost += result.costUsd;
      responses.push(result.response);

      // Feed response back to inception strategy
      if (strategy instanceof InceptionStrategy) {
        strategy.updateContext(result.response);
      }

      if (progressBar) {
        progressBar.update(i + 1, {
          cost: totalCost.toFixed(4),
          tokens: totalTokens,
        });
      }

      if (options.bossMode) {
        printBossMode(i, totalRequests);
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      if (progressBar) {
        progressBar.stop();
      }
      throw new Error(`Burn failed at request ${i + 1}: ${errMsg}`);
    }
  }

  const duration = Date.now() - startTime;

  if (progressBar) {
    progressBar.stop();
  }
  if (options.bossMode) {
    console.log(); // newline after boss mode output
  }

  // Record session
  const session: BurnSession = {
    timestamp: new Date().toISOString(),
    strategy: strategy.name,
    provider: provider.name,
    tokensUsed: totalTokens,
    costUsd: totalCost,
    duration,
    requests: totalRequests,
  };
  appendHistory(session);

  // Update cumulative totals in config
  config.burnedTokens += totalTokens;
  config.burnedCost += totalCost;

  const { saveConfig } = await import("./config.js");
  saveConfig(config);

  return {
    requests: totalRequests,
    tokensUsed: totalTokens,
    costUsd: totalCost,
    duration,
    strategy: strategy.name,
    provider: provider.name,
    responses,
  };
}
