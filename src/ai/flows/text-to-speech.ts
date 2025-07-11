
'use server';
/**
 * @fileOverview Converts text to speech using a Genkit flow.
 *
 * - textToSpeech - Converts text to audio data.
 * - TextToSpeechInput - The input type for the function.
 * - TextToSpeechOutput - The output type for the function.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';

/**
 * The Zod schema for the input of the text-to-speech flow.
 * @type {z.ZodObject<{text: z.ZodString}>}
 */
const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to synthesize.'),
});
/**
 * The type definition for the input of the text-to-speech flow.
 * @typedef {z.infer<typeof TextToSpeechInputSchema>} TextToSpeechInput
 */
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

/**
 * The Zod schema for the output of the text-to-speech flow.
 * @type {z.ZodObject<{audioDataUri: z.ZodString}>}
 */
const TextToSpeechOutputSchema = z.object({
  audioDataUri: z.string().describe('The synthesized audio as a data URI.'),
});
/**
 * The type definition for the output of the text-to-speech flow.
 * @typedef {z.infer<typeof TextToSpeechOutputSchema>} TextToSpeechOutput
 */
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

/**
 * Converts text to speech by calling the underlying Genkit flow.
 * @param {TextToSpeechInput} input - The text to synthesize.
 * @returns {Promise<TextToSpeechOutput>} A promise that resolves to the audio data URI.
 */
export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

/**
 * The Genkit flow that orchestrates the text-to-speech conversion.
 */
const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
      prompt: text,
    });
    if (!media) {
      throw new Error('No audio media returned from the TTS model.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavData = await toWav(audioBuffer);
    return {
      audioDataUri: 'data:audio/wav;base64,' + wavData,
    };
  }
);

/**
 * Converts raw PCM audio data to a WAV format Base64 string.
 * This is necessary because the TTS model returns raw audio data.
 * @param {Buffer} pcmData - The raw PCM audio data.
 * @param {number} [channels=1] - The number of audio channels.
 * @param {number} [rate=24000] - The sample rate of the audio.
 * @param {number} [sampleWidth=2] - The sample width in bytes.
 * @returns {Promise<string>} A promise that resolves to the Base64 encoded WAV data.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
