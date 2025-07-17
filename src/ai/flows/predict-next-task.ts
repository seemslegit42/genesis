'use server';
/**
 * @fileOverview A Genkit flow that predicts the user's next logical micro-task.
 *
 * - predictNextTask - A function that predicts the next task based on conversation history.
 * - PredictNextTaskInput - The input type for the function.
 * - PredictNextTaskOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { VowSchema } from '@/lib/types';

/**
 * The Zod schema for the input of the next task prediction flow.
 */
const PredictNextTaskInputSchema = z.object({
  chatHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .describe('The recent chat history.'),
  vow: VowSchema.describe("The user's current persona vow."),
});
export type PredictNextTaskInput = z.infer<typeof PredictNextTaskInputSchema>;

/**
 * The Zod schema for the output of the next task prediction flow.
 */
const PredictNextTaskOutputSchema = z.object({
  nextTask: z.string().describe('A single, concise, actionable micro-task that logically follows from the conversation. Should be a command. If no task is obvious, return an empty string.'),
});
export type PredictNextTaskOutput = z.infer<typeof PredictNextTaskOutputSchema>;

/**
 * Predicts the user's next task by calling the underlying Genkit flow.
 * @param {PredictNextTaskInput} input - The conversation context.
 * @returns {Promise<PredictNextTaskOutput>} A promise that resolves to the predicted next task.
 */
export async function predictNextTask(input: PredictNextTaskInput): Promise<PredictNextTaskOutput> {
  return predictNextTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictNextTaskPrompt',
  input: { schema: PredictNextTaskInputSchema },
  output: { schema: PredictNextTaskOutputSchema },
  prompt: `You are BEEP, a cognitive co-processor. Your task is to analyze the following conversation and predict the user's next logical micro-task.

The user's current Vow is {{vow}}.
- If Architect, the task should be about building, creating, or planning.
- If Oracle, the task should be about analyzing, researching, or strategizing.
- If Sentinel, the task should be about securing, optimizing, or solving a problem.

The task must be a short, actionable command. Examples: "Draft the email," "Generate the code," "Outline the next steps."

If no clear next task is apparent, return an empty string for the 'nextTask' field. Do not make something up.

Conversation History:
{{#each chatHistory}}
{{role}}: {{content}}
{{/each}}
`,
});

const predictNextTaskFlow = ai.defineFlow(
  {
    name: 'predictNextTaskFlow',
    inputSchema: PredictNextTaskInputSchema,
    outputSchema: PredictNextTaskOutputSchema,
  },
  async (input) => {
    // Only consider the last 4 messages to keep the context relevant
    const recentHistory = {
        ...input,
        chatHistory: input.chatHistory.slice(-4),
    }
    const { output } = await prompt(recentHistory);
    return output!;
  }
);
