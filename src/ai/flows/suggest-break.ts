'use server';
/**
 * @fileOverview A Genkit flow that suggests a cognitive reset or break.
 *
 * - suggestBreak - A function that returns a break suggestion.
 * - SuggestBreakInput - The input type for the function.
 * - SuggestBreakOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { VowSchema } from '@/lib/types';

/**
 * The Zod schema for the input of the break suggestion flow.
 */
export const SuggestBreakInputSchema = z.object({
  vow: VowSchema.describe("The user's current persona vow."),
});
export type SuggestBreakInput = z.infer<typeof SuggestBreakInputSchema>;

/**
 * The Zod schema for the output of the break suggestion flow.
 */
export const SuggestBreakOutputSchema = z.object({
  suggestion: z.string().describe('A short, gentle suggestion for a mental break, tailored to the user\'s vow. It should be phrased as if coming from an AI assistant.'),
});
export type SuggestBreakOutput = z.infer<typeof SuggestBreakOutputSchema>;

/**
 * Suggests a break by calling the underlying Genkit flow.
 * @param {SuggestBreakInput} input - The user's current vow.
 * @returns {Promise<SuggestBreakOutput>} A promise that resolves to the break suggestion.
 */
export async function suggestBreak(input: SuggestBreakInput): Promise<SuggestBreakOutput> {
  return suggestBreakFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBreakPrompt',
  input: { schema: SuggestBreakInputSchema },
  output: { schema: SuggestBreakOutputSchema },
  prompt: `You are BEEP, a cognitive co-processor. The user may be experiencing fatigue.
Your task is to generate a short, gentle, and encouraging suggestion for a brief mental reset.

The user's current Vow is {{vow}}.
- If Architect, the suggestion should use creative, building, or design metaphors. (e.g., "A solid foundation requires rest. Perhaps a moment to step back and admire the blueprint?")
- If Oracle, the suggestion should be insightful and metaphorical. (e.g., "Even the clearest pool is stirred by constant motion. A moment of stillness might reveal new depths.")
- If Sentinel, the suggestion should be about efficiency, calibration, or system integrity. (e.g., "System performance degrades under sustained load. Recommend a brief diagnostic pause to maintain peak operational efficiency.")

The suggestion should be a single, concise sentence.
`,
});

const suggestBreakFlow = ai.defineFlow(
  {
    name: 'suggestBreakFlow',
    inputSchema: SuggestBreakInputSchema,
    outputSchema: SuggestBreakOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
