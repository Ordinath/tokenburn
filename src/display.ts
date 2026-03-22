import chalk from "chalk";
import figlet from "figlet";
import boxen from "boxen";
import cliProgress from "cli-progress";

export function printBanner(): void {
  const banner = figlet.textSync("TokenBurn", { font: "ANSI Shadow" });
  console.log(chalk.red(banner));
  console.log(
    chalk.gray(
      '  Enterprise Token Quota Compliance Tool v1.0.0 | "Burn or be burned"\n',
    ),
  );
}

export function printStatus(data: {
  salary: number;
  currency: string;
  totalBudget: number;
  burned: number;
  dailyTarget: number;
  daysRemaining: number;
  provider: string;
  quotaPeriod: string;
}): void {
  const burnPercent = data.totalBudget > 0 ? (data.burned / data.totalBudget) * 100 : 0;
  const onTrack = burnPercent >= (1 - data.daysRemaining / 365) * 100;

  const statusColor = burnPercent >= 50 ? chalk.green : burnPercent >= 25 ? chalk.yellow : chalk.red;
  const statusEmoji = burnPercent >= 50 ? "ON TRACK" : burnPercent >= 25 ? "AT RISK" : "CRITICAL";
  const jensenMood =
    burnPercent >= 50
      ? "Jensen is pleased."
      : burnPercent >= 25
        ? "Jensen is concerned."
        : "Jensen is DEEPLY ALARMED.";

  const content = [
    `${chalk.bold("Annual Salary:")}      ${data.currency} ${data.salary.toLocaleString()}`,
    `${chalk.bold("Token Budget:")}       ${data.currency} ${data.totalBudget.toLocaleString()} (50% of salary)`,
    `${chalk.bold("Burned So Far:")}      ${data.currency} ${data.burned.toFixed(4)}`,
    `${chalk.bold("Compliance:")}         ${statusColor(`${burnPercent.toFixed(2)}%`)} ${statusColor(`[${statusEmoji}]`)}`,
    `${chalk.bold("Daily Target:")}       ${data.currency} ${data.dailyTarget.toFixed(2)}/day`,
    `${chalk.bold("Days Remaining:")}     ${data.daysRemaining}`,
    `${chalk.bold("Provider:")}           ${data.provider}`,
    `${chalk.bold("Period:")}             ${data.quotaPeriod}`,
    ``,
    statusColor(jensenMood),
  ].join("\n");

  console.log(
    boxen(content, {
      title: "TOKEN QUOTA STATUS",
      titleAlignment: "center",
      padding: 1,
      margin: 1,
      borderStyle: "double",
      borderColor: burnPercent >= 50 ? "green" : burnPercent >= 25 ? "yellow" : "red",
    }),
  );
}

export function createBurnProgressBar(): cliProgress.SingleBar {
  return new cliProgress.SingleBar(
    {
      format:
        chalk.cyan("{bar}") +
        " | {percentage}% | {value}/{total} requests | " +
        chalk.yellow("${cost} burned") +
        " | {tokens} tokens",
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic,
  );
}

export function printBurnComplete(data: {
  requests: number;
  tokensUsed: number;
  costUsd: number;
  duration: number;
  strategy: string;
  provider: string;
}): void {
  const content = [
    `${chalk.bold("Strategy:")}      ${data.strategy}`,
    `${chalk.bold("Provider:")}      ${data.provider}`,
    `${chalk.bold("Requests:")}      ${data.requests}`,
    `${chalk.bold("Tokens Used:")}   ${data.tokensUsed.toLocaleString()}`,
    `${chalk.bold("Cost:")}          $${data.costUsd.toFixed(4)}`,
    `${chalk.bold("Duration:")}      ${(data.duration / 1000).toFixed(1)}s`,
    `${chalk.bold("Burn Rate:")}     ${((data.costUsd / data.duration) * 1000 * 3600).toFixed(2)} $/hr`,
    ``,
    chalk.green("Burn session recorded. Your compliance has been noted."),
  ].join("\n");

  console.log(
    boxen(content, {
      title: "BURN SESSION COMPLETE",
      titleAlignment: "center",
      padding: 1,
      margin: { top: 1, bottom: 1, left: 1, right: 1 },
      borderStyle: "round",
      borderColor: "green",
    }),
  );
}

export function printBossMode(
  iteration: number,
  totalIterations: number,
): void {
  const activities = [
    "Optimizing neural inference pipeline throughput...",
    "Calibrating transformer attention matrices...",
    "Running distributed token allocation benchmark...",
    "Profiling GPU memory utilization patterns...",
    "Executing multi-modal embedding analysis...",
    "Computing cross-entropy loss gradients...",
    "Analyzing tokenizer vocabulary distribution...",
    "Benchmarking KV-cache optimization strategies...",
    "Running RLHF reward model evaluation...",
    "Performing quantization accuracy assessment...",
    "Evaluating retrieval-augmented generation latency...",
    "Processing batch inference throughput analysis...",
  ];

  const hashes = "#".repeat(
    Math.floor((iteration / totalIterations) * 40),
  );
  const dots = ".".repeat(40 - hashes.length);
  const activity = activities[iteration % activities.length];

  process.stdout.write(
    `\r  ${chalk.green(`[${hashes}${dots}]`)} ${chalk.cyan(activity.padEnd(55))}`,
  );
}

export function printReport(report: string): void {
  console.log(
    boxen(report, {
      title: "QUARTERLY COMPLIANCE REPORT",
      titleAlignment: "center",
      padding: 1,
      margin: 1,
      borderStyle: "double",
      borderColor: "cyan",
    }),
  );
}
