# TokenBurn 🔥

**Enterprise-Grade Token Quota Compliance Tool**

> *"If that $500,000 engineer did not consume at least $250,000 worth of tokens, I am going to be deeply alarmed."*
> — Jensen Huang, GTC 2026

Are you a $500,000 engineer who isn't burning enough tokens? Is your manager looking at the API dashboard with concern? Is Jensen Huang *deeply alarmed* by your consumption metrics?

**TokenBurn** is here to save your career.

TokenBurn is a professional-grade CLI tool that helps engineers meet their token consumption quotas through scientifically-designed burn strategies. Whether you're falling behind on monthly targets or facing an end-of-quarter compliance review, TokenBurn ensures you never have to explain low API usage to leadership again.

## Features

- **Multiple Burn Strategies** — Choose from 4 scientifically-optimized token consumption methodologies
- **Real Provider Support** — Works with OpenAI, Anthropic, or our enterprise-grade mock provider
- **Compliance Dashboard** — Real-time quota tracking with Jensen Mood Indicator™
- **Boss Mode** — Display impressive-looking AI workload output when your manager walks by
- **Emergency Mode** — 10x burn rate for end-of-quarter panic
- **Compliance Reports** — Generate manager-friendly reports with grades and projections
- **Session History** — Full audit trail of your burning activities

## Installation

```bash
npm install -g tokenburn
```

Or run directly:

```bash
npx tokenburn
```

## Quick Start

```bash
# Configure your salary and provider
tokenburn configure --salary 500000 --provider openai --api-key sk-...

# Check your compliance status
tokenburn status

# Start burning tokens
tokenburn burn --requests 10 --strategy existential

# Generate a compliance report
tokenburn report
```

## Commands

### `tokenburn configure`

Set up your salary, provider, and API credentials.

```bash
tokenburn configure --salary 500000 --provider anthropic --api-key sk-ant-...
tokenburn configure --period quarterly --model claude-haiku-4-5-20251001
```

Options:
- `-s, --salary <amount>` — Annual salary in USD
- `-p, --provider <name>` — LLM provider: `openai`, `anthropic`, `mock`
- `-k, --api-key <key>` — API key for your provider
- `-m, --model <name>` — Model override (provider-specific)
- `--period <period>` — Quota period: `monthly`, `quarterly`, `yearly`

### `tokenburn status`

Display your current token quota compliance level with the Jensen Mood Indicator™.

```
╔══════════════════════════════════════════╗
║          TOKEN QUOTA STATUS              ║
╠══════════════════════════════════════════╣
║  Annual Salary:      USD 500,000         ║
║  Token Budget:       USD 250,000         ║
║  Burned So Far:      USD 0.0420          ║
║  Compliance:         0.00% [CRITICAL]    ║
║  Daily Target:       USD 684.93/day      ║
║                                          ║
║  Jensen is DEEPLY ALARMED.               ║
╚══════════════════════════════════════════╝
```

### `tokenburn burn`

Start a burn session to consume tokens and improve your compliance metrics.

```bash
# Basic burn
tokenburn burn --requests 10

# Choose a strategy
tokenburn burn -n 20 --strategy inception

# Emergency mode (10x multiplier)
tokenburn burn -n 5 --emergency

# Boss mode (impressive terminal output)
tokenburn burn -n 10 --boss-mode

# Quiet mode for cron jobs
tokenburn burn -n 50 --quiet --strategy sisyphus
```

Options:
- `-n, --requests <count>` — Number of API requests (default: 5)
- `-s, --strategy <name>` — Burn strategy (see below)
- `-e, --emergency` — 10x burn rate multiplier
- `-b, --boss-mode` — Display impressive AI workload output
- `-p, --provider <name>` — Override configured provider
- `-q, --quiet` — Minimal output (great for automation)

### `tokenburn report`

Generate a comprehensive compliance report suitable for sharing with management.

### `tokenburn strategies`

List all available burn strategies with descriptions.

### `tokenburn calculate`

Calculate your required burn rate based on salary.

```bash
tokenburn calc --salary 500000
```

### `tokenburn reset`

Reset your burn history and start fresh. Requires `--confirm` flag.

## Burn Strategies

| Strategy | Description | Best For |
|----------|-------------|----------|
| `existential` | Generates philosophical questions about the nature of token burning | Deep thinkers |
| `sisyphus` | Endlessly counting and recounting tasks that reset | Persistent burners |
| `bureaucrat` | Produces elaborate corporate memos and policy documents | Middle management |
| `inception` | Recursive self-analysis — AI reviewing its own responses | Maximum throughput |
| `random` | Randomly selects a strategy each session | The indecisive |

## Automation

Set up a cron job for consistent compliance:

```bash
# Burn tokens every hour during work hours (Mon-Fri, 9-5)
0 9-17 * * 1-5 tokenburn burn -n 10 --strategy random --quiet

# Emergency end-of-quarter burns
0 * * * * tokenburn burn -n 50 --emergency --quiet  # Last day of quarter only
```

## Environment Variables

Instead of passing `--api-key` every time, set your provider's standard environment variable:

- `OPENAI_API_KEY` — For OpenAI provider
- `ANTHROPIC_API_KEY` — For Anthropic provider

## How It Works

TokenBurn calculates your required token budget as 50% of your annual salary (per Jensen Huang's guidance). It then tracks your API consumption against this quota, providing real-time compliance metrics and projections.

Each burn session:
1. Selects prompts using your chosen strategy
2. Sends them to your configured LLM provider
3. Records token usage and cost
4. Updates your compliance dashboard

The tool is designed to be used with real API providers for actual token consumption, or with the built-in mock provider for testing and demonstrations.

## The Math

For a $500,000 engineer on a yearly quota:

```
Token Budget:     $250,000/year (50% of salary)
Monthly Target:   $20,833.33
Weekly Target:    $4,807.69
Daily Target:     $684.93
Hourly Target:    $85.62 (8hr workday)
```

At GPT-4o-mini rates (~$0.60/1M tokens), that's approximately **416,666,666,667 tokens per year**.

You better get burning.

## Disclaimer

This is a satirical project inspired by Jensen Huang's statement at GTC 2026. It is not financial advice. Please do not actually burn $250,000 worth of tokens to impress your manager. Or do. We're a CLI tool, not your financial advisor.

## License

MIT — Because even compliance tools should be open source.

## Contributing

Found a new burn strategy? Think the compliance algorithm needs calibration? PRs welcome. Jensen would approve.

---

*Built with existential dread and corporate compliance in mind.*
