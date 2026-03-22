import { BurnStrategy } from "./types.js";
import { ExistentialStrategy } from "./existential.js";
import { SisyphusStrategy } from "./sisyphus.js";
import { BureaucratStrategy } from "./bureaucrat.js";
import { InceptionStrategy } from "./inception.js";

export type StrategyName = "existential" | "sisyphus" | "bureaucrat" | "inception" | "random";

const STRATEGIES: Record<string, () => BurnStrategy> = {
  existential: () => new ExistentialStrategy(),
  sisyphus: () => new SisyphusStrategy(),
  bureaucrat: () => new BureaucratStrategy(),
  inception: () => new InceptionStrategy(),
};

export function createStrategy(name: StrategyName): BurnStrategy {
  if (name === "random") {
    const keys = Object.keys(STRATEGIES);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return STRATEGIES[key]();
  }

  const factory = STRATEGIES[name];
  if (!factory) {
    throw new Error(
      `Unknown strategy: ${name}. Available: ${Object.keys(STRATEGIES).join(", ")}, random`,
    );
  }
  return factory();
}

export function listStrategies(): { name: string; description: string }[] {
  return Object.entries(STRATEGIES).map(([, factory]) => {
    const s = factory();
    return { name: s.name, description: s.description };
  });
}

export { BurnStrategy } from "./types.js";
