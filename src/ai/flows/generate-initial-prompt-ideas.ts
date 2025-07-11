'use server';
/**
 * @fileOverview This file defines a Genkit flow to generate initial prompt ideas for new users.
 *
 * - generateInitialPromptIdeas - A function that returns a list of suggested prompts to help new users get started.
 * - InitialPromptIdeasOutput - The output type for the generateInitialPromptIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialPromptIdeasOutputSchema = z.object({
  prompts: z.array(z.string()).describe('A list of suggested prompts for the user to try.'),
});
export type InitialPromptIdeasOutput = z.infer<typeof InitialPromptIdeasOutputSchema>;

export async function generateInitialPromptIdeas(): Promise<InitialPromptIdeasOutput> {
  return generateInitialPromptIdeasFlow();
}

const prompt = ai.definePrompt({
  name: 'initialPromptIdeasPrompt',
  output: {schema: InitialPromptIdeasOutputSchema},
  prompt: `You are an AI assistant designed to provide new users with a set of suggested prompts to help them understand the AI's capabilities and get started quickly.

  Generate a diverse list of creative and useful prompts that showcase the AI's abilities. The prompts should be engaging and encourage exploration.

  Return the prompts as a JSON array of strings.

  Example:
  {
    "prompts": [
      "Summarize the plot of Hamlet.",
      "Write a short poem about the ocean.",
      "Translate 'Hello, world!' into Spanish.",
      "Suggest five healthy recipes using only the following ingredients: chicken, rice, and broccoli.",
      "Explain the theory of relativity in simple terms."
    ]
  }`,
});

const generateInitialPromptIdeasFlow = ai.defineFlow(
  {
    name: 'generateInitialPromptIdeasFlow',
    outputSchema: InitialPromptIdeasOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
