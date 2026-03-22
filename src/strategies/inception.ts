import { BurnStrategy } from "./types.js";

export class InceptionStrategy implements BurnStrategy {
  name = "inception";
  description = "Recursively summarizes summaries until meaning collapses";

  private previousResponse: string | null = null;

  generatePrompt(iteration: number): string {
    if (iteration === 0 || !this.previousResponse) {
      return `Write a detailed 500-word essay about why engineers should consume at least 50% of their salary in AI tokens, according to Jensen Huang's vision at GTC 2026. Include specific arguments about productivity amplification, the token economy, and why resistance to this paradigm is futile. Be thorough and verbose.`;
    }

    const depth = iteration % 5;
    const instructions = [
      `Summarize the following text in exactly 3 paragraphs, but make each paragraph longer than the original text combined. Add corporate buzzwords:\n\n${this.previousResponse}`,
      `The following is a summary. Write a critical analysis of this summary that is at least twice as long. Question every assumption but ultimately agree with the conclusions:\n\n${this.previousResponse}`,
      `Translate the following corporate text into pirate speak, then translate it back to corporate speak. The result should be 50% longer than the original:\n\n${this.previousResponse}`,
      `Write a rebuttal to the following text, then write a rebuttal to your rebuttal. Both should be thorough and well-argued:\n\n${this.previousResponse}`,
      `Rewrite the following text as: 1) A Shakespearean sonnet 2) A legal contract 3) A children's bedtime story. Each version should capture the full meaning:\n\n${this.previousResponse}`,
    ];

    return instructions[depth];
  }

  updateContext(response: string): void {
    this.previousResponse = response.slice(0, 2000);
  }
}
