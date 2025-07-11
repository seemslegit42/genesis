'use server';
/**
 * @fileOverview Summarizes a chat history to extract key information and topics discussed.
 * This is used to provide "memory" to the main chat flow.
 *
 * - summarizeChatHistory - The main function to summarize history.
 * - SummarizeChatHistoryInput - The input type for the function.
 * - SummarizeChatHistoryOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * The Zod schema for the input of the chat history summarization flow.
 * @type {z.ZodObject<{chatHistory: z.ZodString}>}
 */
const SummarizeChatHistoryInputSchema = z.object({
  chatHistory: z.string().describe('The complete chat history to summarize, as a JSON string of messages.'),
});
/**
 * The type definition for the input of the chat history summarization flow.
 * @typedef {z.infer<typeof SummarizeChatHistoryInputSchema>} SummarizeChatHistoryInput
 */
export type SummarizeChatHistoryInput = z.infer<typeof SummarizeChatHistoryInputSchema>;

/**
 * The Zod schema for the output of the chat history summarization flow.
 * @type {z.ZodObject<{summary: z.ZodString}>}
 */
const SummarizeChatHistoryOutputSchema = z.object({
  summary: z.string().describe('A concise, one-sentence summary of the chat history.'),
});
/**
 * The type definition for the output of the chat history summarization flow.
 * @typedef {z.infer<typeof SummarizeChatHistoryOutputSchema>} SummarizeChatHistoryOutput
 */
export type SummarizeChatHistoryOutput = z.infer<typeof SummarizeChatHistoryOutputSchema>;

/**
 * Summarizes a chat history by calling the underlying Genkit flow.
 * @param {SummarizeChatHistoryInput} input - The chat history to summarize.
 * @returns {Promise<SummarizeChatHistoryOutput>} A promise that resolves to the summary.
 */
export async function summarizeChatHistory(input: SummarizeChatHistoryInput): Promise<SummarizeChatHistoryOutput> {
  return summarizeChatHistoryFlow(input);
}

/**
 * The Genkit prompt that defines the AI's task for summarizing chat history.
 */
const summarizeChatHistoryPrompt = ai.definePrompt({
  name: 'summarizeChatHistoryPrompt',
  input: {schema: SummarizeChatHistoryInputSchema},
  output: {schema: SummarizeChatHistoryOutputSchema},
  prompt: `Provide a concise, one-sentence summary of the following chat history, extracting the key information and topics discussed. The summary should be suitable for a quick status update. Example: "The user is currently onboarding a new client named Acme Corp and has just created the CRM entry.":\n\n{{{chatHistory}}}`,
});

/**
 * The Genkit flow that orchestrates the summarization of chat history.
 */
const summarizeChatHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeChatHistoryFlow',
    inputSchema: SummarizeChatHistoryInputSchema,
    outputSchema: SummarizeChatHistoryOutputSchema,
  },
  async input => {
    const {output} = await summarizeChatHistoryPrompt(input);
    return output!;
  }
);
