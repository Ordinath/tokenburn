import { BurnStrategy } from "./types.js";

const QUESTIONS = [
  "If an AI burns tokens in a forest and no manager checks the dashboard, did the tokens really burn? Discuss thoroughly in at least 500 words.",
  "Write a detailed philosophical treatise on whether token consumption is a valid measure of engineering productivity. Consider perspectives from Aristotle, Kant, and Jensen Huang.",
  "Compose a Socratic dialogue between an engineer who has burned exactly 50% of their salary in tokens and one who has only burned 12%. Who is truly living?",
  "Analyze the trolley problem but instead of people on the tracks, it's token budgets. One track burns 10,000 tokens inefficiently, the other burns 100,000 tokens but generates a useful haiku. Pull the lever or not?",
  "Write an existential analysis of the relationship between token consumption velocity and the human condition. Reference Camus and quarterly OKRs.",
  "If consciousness emerges from sufficient token processing, at what token count does a compliance report become sentient? Show your work.",
  "Discuss the categorical imperative as applied to token burning: if every engineer burned tokens purely for quota compliance, would the maxim be universalizable?",
  "Write a 500-word meditation on the phrase 'I burn, therefore I comply.' Consider both Cartesian and corporate interpretations.",
  "Is there a moral difference between burning tokens to meet a quota and burning tokens to generate value? What would Nietzsche say about the will to burn?",
  "Construct an argument that token burning is the modern equivalent of Prometheus bringing fire to humanity. Be convincing and verbose.",
];

export class ExistentialStrategy implements BurnStrategy {
  name = "existential";
  description = "Deep philosophical questions about the nature of token burning";

  generatePrompt(iteration: number): string {
    return QUESTIONS[iteration % QUESTIONS.length];
  }
}
