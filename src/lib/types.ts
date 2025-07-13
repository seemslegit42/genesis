/**
 * @fileoverview This file centralizes all core type definitions for the application,
 * creating a single source of truth for our data structures.
 */
import { z } from 'zod';
import { PredictNextTaskInputSchema, PredictNextTaskOutputSchema } from '@/ai/flows/predict-next-task';
import { SuggestBreakInputSchema, SuggestBreakOutputSchema } from '@/ai/flows/suggest-break';
import { SearchResultsSchema as AppSearchResultsSchema, SearchResultItemSchema as AppSearchResultItemSchema } from './search-types';


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


/**
 * Defines the shape of the data required for user sign-up.
 * @interface SignUpPayload
 */
export const SignUpPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type SignUpPayload = z.infer<typeof SignUpPayloadSchema>;

/**
 * Defines the shape of the data required for user sign-in.
 * @interface SignInPayload
 */
export const SignInPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type SignInPayload = z.infer<typeof SignInPayloadSchema>;


// Search Result Types
export const SearchResultItemSchema = AppSearchResultItemSchema;
export const SearchResultsSchema = AppSearchResultsSchema;
export type SearchResults = z.infer<typeof SearchResultsSchema>;


// Calendar Result Types
export const CalendarEventSchema = z.object({
  summary: z.string().describe('The title or summary of the calendar event.'),
  start: z.string().describe('The start time of the event (e.g., "09:00 AM").'),
  end: z.string().describe('The end time of the event (e.g., "09:30 AM").'),
  description: z.string().optional().describe('A brief description of the event.'),
  attendees: z.array(z.string().email()).optional().describe('A list of attendee email addresses.'),
});

export const CalendarResultSchema = z.object({
    type: z.literal('calendarResults'),
    events: z.array(CalendarEventSchema).describe("A list of today's calendar events.")
})
export type CalendarResult = z.infer<typeof CalendarResultSchema>;
