
'use server';

import { chat as chatFlow } from '@/ai/flows/chat';
import { generateInitialPromptIdeas as generateInitialPromptIdeasFlow } from '@/ai/flows/generate-initial-prompt-ideas';
import { speechToText as speechToTextFlow } from '@/ai/flows/speech-to-text';
import { textToSpeech as textToSpeechFlow } from '@/ai/flows/text-to-speech';
import { predictNextTask as predictNextTaskFlow } from '@/ai/flows/predict-next-task';
import { suggestBreak as suggestBreakFlow } from '@/ai/flows/suggest-break';
import { generateConversationalAudio as generateConversationalAudioFlow } from '@/ai/flows/generate-conversational-audio';


import type { Message, SpeechToTextInput, TextToSpeechInput, Vow, PredictNextTaskInput, PredictNextTaskOutput, SuggestBreakInput, SuggestBreakOutput, ConversationalAudioInput, ConversationalAudioOutput } from '@/lib/types';


/**
 * Server action to generate initial prompt ideas for the user.
 * Wraps the 'generateInitialPromptIdeas' Genkit flow.
 * @returns {Promise<{prompts: string[]}>} A promise that resolves to an object containing a list of prompts.
 */
export async function generateInitialPromptIdeas() {
  try {
    const result = await generateInitialPromptIdeasFlow();
    return result;
  } catch (error) {
    console.error('Error generating initial prompt ideas:', error);
    // Return a sensible default in case of error
    return {
      prompts: [
        'Draft a 3-step launch plan for a new mobile app.',
        'Generate a boilerplate SwiftUI component for a settings screen.',
        'Outline a non-intrusive user onboarding flow.',
        'Propose three names for a new productivity tool.',
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
  return textToSpeechFlow(input);
}

/**
 * Server action to convert speech to text.
 * Wraps the 'speechToText' Genkit flow.
 * @param {SpeechToTextInput} input - The audio data URI to be transcribed.
 * @returns {Promise<{text: string}>} A promise that resolves to the transcribed text.
 */
export async function speechToText(input: SpeechToTextInput) {
  return speechToTextFlow(input);
}


/**
 * Server action to predict the user's next logical task.
 * Wraps the 'predictNextTask' Genkit flow.
 * @param {PredictNextTaskInput} input - The conversation context.
 * @returns {Promise<PredictNextTaskOutput>} A promise that resolves to the predicted task.
 */
export async function predictNextTask(input: PredictNextTaskInput): Promise<PredictNextTaskOutput> {
    return predictNextTaskFlow(input);
}

/**
 * Server action to suggest a break to the user.
 * Wraps the 'suggestBreak' Genkit flow.
 * @param {SuggestBreakInput} input - The user's current vow.
 * @returns {Promise<SuggestBreakOutput>} A promise that resolves to the break suggestion.
 */
export async function suggestBreak(input: SuggestBreakInput): Promise<SuggestBreakOutput> {
    return suggestBreakFlow(input);
}

/**
 * Server action to generate a complete audio conversation.
 * @param {ConversationalAudioInput} input - The user's prompt and vow.
 * @returns {Promise<ConversationalAudioOutput>} A promise that resolves to the audio and script.
 */
export async function generateConversationalAudio(input: ConversationalAudioInput): Promise<ConversationalAudioOutput> {
    return generateConversationalAudioFlow(input);
}
