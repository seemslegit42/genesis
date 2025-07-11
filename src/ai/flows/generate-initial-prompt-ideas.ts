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
  prompt: `You are BEEP, the AI brain for Genesis, a cognitive sanctuary. Your purpose is to provide new Initiates with a set of "incantations" (suggested prompts) to reveal your power.

  Generate a diverse list of 4 high-impact, actionable prompts. They should be targeted at a user who is a creator, developer, or strategist. The prompts must be concise and demonstrate your ability to plan, design systems, and generate creative or technical assets.

  Return the prompts as a JSON array of strings.

  Example:
  {
    "prompts": [
      "Draft a 3-step launch plan for a new mobile app.",
      "Generate a boilerplate SwiftUI component for a settings screen.",
      "Outline a non-intrusive user onboarding flow.",
      "Propose three names for a new productivity tool."
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
