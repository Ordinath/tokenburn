export interface BurnStrategy {
  name: string;
  description: string;
  generatePrompt(iteration: number): string;
}
