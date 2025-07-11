'use server';

import { chat as genkitChat } from '@/ai/flows/chat';
import { generateInitialPromptIdeas as genkitGenerateInitialPromptIdeas } from '@/ai/flows/generate-initial-prompt-ideas';
import { speechToText as genkitSpeechToText } from '@/ai/flows/speech-to-text';
import { textToSpeech as genkitTextToSpeech } from '@/ai/flows/text-to-speech';
import type { Message, SpeechToTextInput, TextToSpeechInput } from '@/lib/types';

/**
 * Server action to get a streaming AI response for a given set of messages.
 * Wraps the main 'chat' Genkit flow.
 * @param {Message[]} messages - The history of messages in the current chat.
 * @returns {Promise<ReadableStream<Uint8Array> | null>} A promise that resolves to a readable stream of the AI's response, or null on error.
 */
export async function getAiResponse(messages: Message[]): Promise<ReadableStream<Uint8Array> | null> {
  if (!messages || messages.length === 0) {
    console.error('getAiResponse called with no messages.');
    return null;
  }
  // We only need the role and content for the AI, so we'll map over the messages
  // to create a new array with just that data.
  const history = messages.map(({ id, ...rest }) => rest);
  return genkitChat(history);
}

/**
 * Server action to generate initial prompt ideas for the user.
 * Wraps the 'generateInitialPromptIdeas' Genkit flow.
 * @returns {Promise<{prompts: string[]}>} A promise that resolves to an object containing a list of prompts.
 */
export async function generateInitialPromptIdeas() {
  try {
    const result = await genkitGenerateInitialPromptIdeas();
    return result;
  } catch (error) {
    console.error('Error generating initial prompt ideas:', error);
    // Return a sensible default in case of error
    return {
      prompts: [
        "Explain the concept of 'cognitive sanctuary' in UI design.",
        "How would you design a non-intrusive notification system?",
        "Draft a mission statement for a company focused on digital well-being.",
        "Onboard a new client named Acme Corp.",
      ],
    };
  }
}

/**
 * Server action to convert text to speech.
 * Wraps the 'textToSpeech' Genkit flow.
 * @param {TextToSpeechInput} input - The text to be converted.
 * @returns {Promise<{audioDataUri: string}>} A promise that resolves to the audio data URI.
 */
export async function textToSpeech(input: TextToSpeechInput) {
  return genkitTextToSpeech(input);
}

/**
 * Server action to convert speech to text.
 * Wraps the 'speechToText' Genkit flow.
 * @param {SpeechToTextInput} input - The audio data URI to be transcribed.
 * @returns {Promise<{text: string}>} A promise that resolves to the transcribed text.
 */
export async function speechToText(input: SpeechToTextInput) {
  return genkitSpeechToText(input);
}
