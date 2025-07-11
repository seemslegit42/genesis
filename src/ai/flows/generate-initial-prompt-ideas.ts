'use server';
/**
 * @fileOverview This file defines a Genkit flow to generate initial prompt ideas for new users.
 *
 * - generateInitialPromptIdeas - A function that returns a list of suggested prompts to help new users get started.
 * - InitialPromptIdeasOutput - The output type for the generateInitialPromptIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * The Zod schema for the output of the initial prompt ideas flow.
 * It expects an object with a 'prompts' array of strings.
 * @type {z.ZodObject<{prompts: z.ZodArray<z.ZodString>}>}
 */
const InitialPromptIdeasOutputSchema = z.object({
  prompts: z.array(z.string()).describe('A list of suggested prompts for the user to try.'),
});

/**
 * The type definition for the output of the initial prompt ideas flow.
 * @typedef {z.infer<typeof InitialPromptIdeasOutputSchema>} InitialPromptIdeasOutput
 */
export type InitialPromptIdeasOutput = z.infer<typeof InitialPromptIdeasOutputSchema>;

/**
 * Generates a list of suggested prompts to help new users get started.
 * This function calls the underlying Genkit flow.
 * @returns {Promise<InitialPromptIdeasOutput>} A promise that resolves to an object containing a list of prompts.
 */
export async function generateInitialPromptIdeas(): Promise<InitialPromptIdeasOutput> {
  return generateInitialPromptIdeasFlow();
}

/**
 * The Genkit prompt that defines the AI's task for generating initial prompt ideas.
 */
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

/**
 * The Genkit flow that orchestrates the generation of initial prompt ideas.
 */
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
