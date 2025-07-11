/**
 * @fileoverview This file centralizes all core type definitions for the application,
 * creating a single source of truth for our data structures.
 */
import { z } from 'zod';
import { PredictNextTaskInputSchema, PredictNextTaskOutputSchema } from '@/ai/flows/predict-next-task';
import { SuggestBreakInputSchema, SuggestBreakOutputSchema } from '@/ai/flows/suggest-break';

/**
 * Represents a single message in a chat conversation.
 * This is the fundamental unit of communication between the user and the AI.
 * @interface Message
 */
export interface Message {
  /** A unique identifier for the message. */
  id: string;
  /** The role of the entity that sent the message ('user' or 'assistant'). */
  role: 'user' | 'assistant';
  /** The text content of the message. */
  content: string;
}

/**
 * Defines the possible Vows an Initiate can take.
 * @typedef {'Architect' | 'Oracle' | 'Sentinel'} Vow
 */
export const VowSchema = z.enum(['Architect', 'Oracle', 'Sentinel']);
export type Vow = z.infer<typeof VowSchema>;


/**
 * Defines the input structure for the text-to-speech conversion flow.
 * @interface TextToSpeechInput
 */
export interface TextToSpeechInput {
    /** The text to be synthesized into audio. */
    text: string;
}

/**
 * Defines the input structure for the speech-to-text transcription flow.
 * @interface SpeechToTextInput
 */
export interface SpeechToTextInput {
    /** The audio to transcribe, as a Base64 encoded data URI. */
    audioDataUri: string;
}

export type PredictNextTaskInput = z.infer<typeof PredictNextTaskInputSchema>;
export type PredictNextTaskOutput = z.infer<typeof PredictNextTaskOutputSchema>;

export type SuggestBreakInput = z.infer<typeof SuggestBreakInputSchema>;
export type SuggestBreakOutput = z.infer<typeof SuggestBreakOutputSchema>;
