'use server';
/**
 * @fileOverview A revolutionary flow that generates a complete, multi-speaker audio dialogue.
 * It creates a script between the user and BEEP, then synthesizes it into a single audio file.
 *
 * - generateConversationalAudio - The main function to generate the dialogue.
 * - ConversationalAudioInput - The input type for the function.
 * - ConversationalAudioOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { VowSchema } from '@/lib/types';
import wav from 'wav';

const ConversationalAudioInputSchema = z.object({
  prompt: z.string().describe("The user's initial utterance."),
  vow: VowSchema.describe("The user's current persona vow."),
});
export type ConversationalAudioInput = z.infer<typeof ConversationalAudioInputSchema>;

const ConversationalAudioOutputSchema = z.object({
  audioDataUri: z.string().describe('The synthesized audio dialogue as a data URI.'),
  script: z.string().describe('The generated script for the conversation.'),
});
export type ConversationalAudioOutput = z.infer<typeof ConversationalAudioOutputSchema>;

const ScriptSchema = z.object({
    script: z.string().describe(`A short conversational script between Speaker1 (the user) and Speaker2 (the AI). The script must start with "Speaker1:". Example: "Speaker1: What is my schedule today?\\nSpeaker2: One moment. Checking your calendar."`)
});

const personalityMatrix = {
  Architect: `You are precise, logical, and systematic. Your language is clear and structural.`,
  Oracle: `You are insightful and strategic. Your language is often metaphorical and questioning.`,
  Sentinel: `You are authoritative, direct, and vigilant. Your language is concise and commanding.`,
};

const scriptGenPrompt = ai.definePrompt({
    name: 'conversationScriptGenerator',
    input: { schema: ConversationalAudioInputSchema },
    output: { schema: ScriptSchema },
    prompt: `You are an AI assistant named BEEP. A user has just said something to you. Your task is to generate a short, natural-sounding conversational script. The user is "Speaker1" and you are "Speaker2".

Your current personality is based on the user's Vow: {{vow}}.
- Architect: You are precise, logical, and systematic.
- Oracle: You are insightful, strategic, and often metaphorical.
- Sentinel: You are authoritative, direct, and vigilant.

User's utterance: "{{prompt}}"

Generate a script that starts with the user's line and is followed by your brief, in-character response. Your response should be a natural continuation of the user's prompt. The entire script should be no more than 2-3 lines total.

Start the script with "Speaker1:".
`,
});


export async function generateConversationalAudio(input: ConversationalAudioInput): Promise<ConversationalAudioOutput> {
  return conversationalAudioFlow(input);
}


const conversationalAudioFlow = ai.defineFlow(
  {
    name: 'conversationalAudioFlow',
    inputSchema: ConversationalAudioInputSchema,
    outputSchema: ConversationalAudioOutputSchema,
  },
  async (input) => {
    // 1. Generate the conversational script
    const { output: scriptOutput } = await scriptGenPrompt(input);
    if (!scriptOutput) {
        throw new Error("Failed to generate conversational script.");
    }
    const script = scriptOutput.script;
    
    // 2. Synthesize the script using a multi-speaker TTS model
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Speaker1', // The User
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
              },
              {
                speaker: 'Speaker2', // BEEP (The AI)
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Fenrir' },
                },
              },
            ],
          },
        },
      },
      prompt: script,
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
      script: script,
    };
  }
);


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
