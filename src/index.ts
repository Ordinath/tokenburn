#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import {
  loadConfig,
  saveConfig,
  calculateQuota,
  TokenBurnConfig,
} from "./config.js";
import { executeBurn } from "./burner.js";
import { listStrategies, StrategyName } from "./strategies/index.js";
import {
  printBanner,
  printStatus,
  printBurnComplete,
  printReport,
} from "./display.js";
import { generateReport } from "./report.js";

const program = new Command();

program
  .name("tokenburn")
  .description(
    'Enterprise-grade token quota compliance tool.\n\n"If that $500,000 engineer did not consume at least $250,000 worth of tokens, I am going to be deeply alarmed." — Jensen Huang, GTC 2026',
  )
  .version("1.0.0");

// === configure ===
program
  .command("configure")
  .alias("config")
  .description("Set up your salary, provider, and API credentials")
  .option("-s, --salary <amount>", "Annual salary in USD", parseFloat)
  .option("-c, --currency <code>", "Currency code (default: USD)")
  .option(
    "-p, --provider <name>",
    "LLM provider: openai, anthropic, mock",
  )
  .option("-k, --api-key <key>", "API key for your provider")
  .option("-m, --model <name>", "Model to use (provider-specific)")
  .option(
    "--period <period>",
    "Quota period: monthly, quarterly, yearly",
  )
  .action((opts) => {
    const config = loadConfig();

    if (opts.salary) config.salary = opts.salary;
    if (opts.currency) config.currency = opts.currency;
    if (opts.provider) config.provider = opts.provider;
    if (opts.apiKey) config.apiKey = opts.apiKey;
    if (opts.model) config.model = opts.model;
    if (opts.period) config.quotaPeriod = opts.period;

    saveConfig(config);

    const quota = calculateQuota(config);
    console.log(chalk.green("\nConfiguration saved.\n"));
    console.log(
      `  Salary:        ${config.currency} ${config.salary.toLocaleString()}`,
    );
    console.log(
      `  Token Budget:  ${config.currency} ${quota.totalBudget.toLocaleString()} (50% of salary)`,
    );
    console.log(
      `  Daily Target:  ${config.currency} ${quota.dailyTarget.toFixed(2)}/day`,
    );
    console.log(`  Provider:      ${config.provider}`);
    console.log(`  Model:         ${config.model || "(default)"}`);
    console.log(`  Period:        ${config.quotaPeriod}`);
    console.log(
      chalk.gray("\n  Remember: Jensen is watching.\n"),
    );
  });

// === status ===
program
  .command("status")
  .description("Check your current token quota compliance level")
  .action(() => {
    printBanner();
    const config = loadConfig();
    const quota = calculateQuota(config);

    const now = new Date();
    const startDate = new Date(config.startDate);
    const daysSinceStart = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const daysRemaining = Math.max(0, quota.periodDays - daysSinceStart);

    printStatus({
      salary: config.salary,
      currency: config.currency,
      totalBudget: quota.totalBudget,
      burned: config.burnedCost,
      dailyTarget: quota.dailyTarget,
      daysRemaining,
      provider: config.provider,
      quotaPeriod: config.quotaPeriod,
    });
  });

// === burn ===
program
  .command("burn")
  .description("Start burning tokens to meet your quota")
  .option(
    "-n, --requests <count>",
    "Number of requests to make",
    "5",
  )
  .option(
    "-s, --strategy <name>",
    "Burn strategy: existential, sisyphus, bureaucrat, inception, random",
    "random",
  )
  .option(
    "-e, --emergency",
    "Emergency mode: 10x burn rate for end-of-quarter panic",
    false,
  )
  .option(
    "-b, --boss-mode",
    "Display impressive-looking output for when your manager walks by",
    false,
  )
  .option("-p, --provider <name>", "Override configured provider")
  .option("-k, --api-key <key>", "Override configured API key")
  .option("-m, --model <name>", "Override configured model")
  .option("-q, --quiet", "Minimal output", false)
  .action(async (opts) => {
    if (!opts.quiet) {
      printBanner();
    }

    const requests = parseInt(opts.requests, 10);
    if (isNaN(requests) || requests < 1) {
      console.error(chalk.red("Invalid request count. Even Jensen expects at least 1."));
      process.exit(1);
    }

    if (opts.emergency && !opts.quiet) {
      console.log(
        chalk.red.bold(
          "\n  *** EMERGENCY MODE ACTIVATED ***\n" +
            "  Burn rate multiplied by 10x.\n" +
            "  This is not a drill. Your quota depends on it.\n",
        ),
      );
    }

    try {
      const result = await executeBurn({
        requests,
        strategy: opts.strategy as StrategyName,
        emergency: opts.emergency,
        bossMode: opts.bossMode,
        provider: opts.provider,
        apiKey: opts.apiKey,
        model: opts.model,
        quiet: opts.quiet,
      });

      if (!opts.quiet) {
        printBurnComplete(result);
      } else {
        console.log(
          `Burned ${result.tokensUsed} tokens ($${result.costUsd.toFixed(4)}) in ${result.requests} requests.`,
        );
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`\nBurn failed: ${errMsg}`));
      console.error(
        chalk.yellow("Your compliance record has been noted. Try again."),
      );
      process.exit(1);
    }
  });

// === report ===
program
  .command("report")
  .description("Generate a compliance report for your manager")
  .action(() => {
    const report = generateReport();
    printReport(report);
  });

// === strategies ===
program
  .command("strategies")
  .description("List available burn strategies")
  .action(() => {
    console.log(chalk.bold("\nAvailable Burn Strategies:\n"));
    for (const s of listStrategies()) {
      console.log(`  ${chalk.cyan(s.name.padEnd(15))} ${s.description}`);
    }
    console.log(
      `  ${chalk.cyan("random".padEnd(15))} Randomly selects a strategy each session`,
    );
    console.log(
      chalk.gray("\n  Pro tip: Use 'inception' for maximum token throughput.\n"),
    );
  });

// === calculate ===
program
  .command("calculate")
  .alias("calc")
  .description("Calculate your required burn rate")
  .option("-s, --salary <amount>", "Annual salary (overrides config)")
  .action((opts) => {
    const config = loadConfig();
    const salary = opts.salary ? parseFloat(opts.salary) : config.salary;
    const halfSalary = salary / 2;

    console.log(chalk.bold("\nToken Burn Rate Calculator\n"));
    console.log(`  Annual Salary:         $${salary.toLocaleString()}`);
    console.log(
      `  Required Token Budget: $${halfSalary.toLocaleString()} (50% of salary)`,
    );
    console.log(`  Monthly Burn Target:   $${(halfSalary / 12).toFixed(2)}`);
    console.log(`  Weekly Burn Target:    $${(halfSalary / 52).toFixed(2)}`);
    console.log(`  Daily Burn Target:     $${(halfSalary / 365).toFixed(2)}`);
    console.log(
      `  Hourly Burn Target:    $${(halfSalary / 365 / 8).toFixed(2)} (assuming 8hr workday)`,
    );
    console.log(
      `  Per-Minute Burn:       $${(halfSalary / 365 / 8 / 60).toFixed(4)}`,
    );
    console.log(
      chalk.gray(
        `\n  At GPT-4o-mini rates (~$0.60/1M tokens), that's ${Math.floor(halfSalary / 0.0006).toLocaleString()} tokens/year.`,
      ),
    );
    console.log(
      chalk.gray(
        `  At Claude Haiku rates (~$4.80/1M tokens), that's ${Math.floor(halfSalary / 0.0048).toLocaleString()} tokens/year.\n`,
      ),
    );
  });

// === reset ===
program
  .command("reset")
  .description("Reset your burn history (start fresh)")
  .option("--confirm", "Skip confirmation")
  .action(async (opts) => {
    if (!opts.confirm) {
      console.log(
        chalk.yellow(
          "\nWARNING: This will reset all burn history and progress.",
        ),
      );
      console.log(
        chalk.yellow(
          "Your compliance record will be wiped. Jensen will not be pleased.",
        ),
      );
      console.log(
        chalk.gray("Run with --confirm to proceed.\n"),
      );
      return;
    }

    const config = loadConfig();
    config.burnedTokens = 0;
    config.burnedCost = 0;
    config.startDate = new Date().toISOString().split("T")[0];
    saveConfig(config);

    const { getConfigDir } = await import("./config.js");
    const fs = await import("fs");
    const path = await import("path");
    const historyFile = path.join(getConfigDir(), "history.json");
    if (fs.existsSync(historyFile)) {
      fs.writeFileSync(historyFile, "[]");
    }

    console.log(chalk.green("\nBurn history reset. Your compliance record starts now."));
    console.log(chalk.gray("Make it count this time.\n"));
  });

program.parse();
