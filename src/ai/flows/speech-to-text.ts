
'use server';
/**
 * @fileOverview Transcribes audio to text using a Genkit flow.
 *
 * - speechToText - Transcribes audio data to text.
 * - SpeechToTextInput - The input type for the function.
 * - SpeechToTextOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

/**
 * The Zod schema for the input of the speech-to-text flow.
 * @type {z.ZodObject<{audioDataUri: z.ZodString}>}
 */
const SpeechToTextInputSchema = z.object({
  audioDataUri: z.string().describe("The audio to transcribe, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
/**
 * The type definition for the input of the speech-to-text flow.
 * @typedef {z.infer<typeof SpeechToTextInputSchema>} SpeechToTextInput
 */
export type SpeechToTextInput = z.infer<typeof SpeechToTextInputSchema>;

/**
 * The Zod schema for the output of the speech-to-text flow.
 * @type {z.ZodObject<{text: z.ZodString}>}
 */
const SpeechToTextOutputSchema = z.object({
  text: z.string().describe('The transcribed text.'),
});
/**
 * The type definition for the output of the speech-to-text flow.
 * @typedef {z.infer<typeof SpeechToTextOutputSchema>} SpeechToTextOutput
 */
export type SpeechToTextOutput = z.infer<typeof SpeechToTextOutputSchema>;


/**
 * Transcribes audio data to text by calling the underlying Genkit flow.
 * @param {SpeechToTextInput} input - The audio data to transcribe.
 * @returns {Promise<SpeechToTextOutput>} A promise that resolves to the transcribed text.
 */
export async function speechToText(input: SpeechToTextInput): Promise<SpeechToTextOutput> {
  return speechToTextFlow(input);
}

/**
 * The Genkit flow for transcribing audio to text.
 */
const speechToTextFlow = ai.defineFlow(
  {
    name: 'speechToTextFlow',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: SpeechToTextOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      model: googleAI.model('gemini-1.5-flash'),
      prompt: [{ media: { url: input.audioDataUri } }, { text: 'Transcribe the audio.' }],
    });
    return { text };
  }
);

    