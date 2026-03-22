import { BurnStrategy } from "./types.js";

export class SisyphusStrategy implements BurnStrategy {
  name = "sisyphus";
  description =
    "Counting tasks that reset — like Sisyphus, but for your budget";

  generatePrompt(iteration: number): string {
    const tasks = [
      `Count from ${iteration * 100 + 1} to ${iteration * 100 + 100}. Write each number on a new line. Include a brief motivational quote next to every 10th number about the importance of meeting token quotas.`,
      `List all prime numbers between ${iteration * 500} and ${iteration * 500 + 500}. For each prime, write a one-sentence corporate affirmation about token compliance.`,
      `Write out the Fibonacci sequence up to the ${50 + iteration * 10}th number. After each number, rate its compliance potential on a scale of 1-10.`,
      `Enumerate all possible 3-letter combinations starting with '${String.fromCharCode(65 + (iteration % 26))}'. For each, suggest how it could be a token-burning startup name.`,
      `Count backwards from ${1000 - iteration * 10} to ${900 - iteration * 10}. For every number divisible by 7, write "COMPLIANCE CHECKPOINT" and a brief status update.`,
    ];

    return tasks[iteration % tasks.length];
  }
}
