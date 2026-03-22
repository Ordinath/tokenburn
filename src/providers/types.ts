export interface BurnResult {
  tokensUsed: number;
  costUsd: number;
  response: string;
  model: string;
}

export interface BurnProvider {
  name: string;
  burn(prompt: string): Promise<BurnResult>;
}
