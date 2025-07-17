
/**
 * @fileoverview This file centralizes all core type definitions for the application,
 * creating a single source of truth for our data structures.
 */
import { z } from 'zod';
import type { ChatInput as AppChatInput, ChatOutput as AppChatOutput } from '@/ai/flows/chat';
import { PredictNextTaskInputSchema, PredictNextTaskOutputSchema } from '@/ai/flows/predict-next-task';
import { SuggestBreakInputSchema, SuggestBreakOutputSchema } from '@/ai/flows/suggest-break';
import { SearchResultsSchema as AppSearchResultsSchema, SearchResultItemSchema as AppSearchResultItemSchema } from './search-types';
import type { TextToSpeechInput as TTSInput, TextToSpeechOutput as TTSOutput } from '@/ai/flows/text-to-speech';

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
 * Defines the input structure for the speech-to-text transcription flow.
 * @interface SpeechToTextInput
 */
export interface SpeechToTextInput {
    /** The audio to transcribe, as a Base64 encoded data URI. */
    audioDataUri: string;
}

export type ChatInput = AppChatInput;
export type ChatOutput = AppChatOutput;

export type TextToSpeechInput = TTSInput;
export type TextToSpeechOutput = TTSOutput;

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
    summary: z.string().describe("A high-level summary of the day's schedule."),
    events: z.array(CalendarEventSchema).describe("A list of today's calendar events."),
    meetings: z.array(z.string()).describe("A list of event summaries that are considered key meetings."),
    focusBlocks: z.array(z.string()).describe("A list of event summaries that are considered focus blocks."),
})
export type CalendarResult = z.infer<typeof CalendarResultSchema>;

// Sovereign's Council Types
export const AgentPerspectiveSchema = z.object({
  agent: z.enum(['Strategist', 'Cynic', 'Economist', 'Marketer', 'Builder']),
  perspective: z.string().describe("The agent's written analysis."),
  opportunities: z.array(z.string()).describe("Key opportunities identified."),
  risks: z.array(z.string()).describe("Key risks or vulnerabilities identified."),
});
export type AgentPerspective = z.infer<typeof AgentPerspectiveSchema>;

export const SovereignsCouncilResultSchema = z.object({
    type: z.literal('sovereignsCouncilResult'),
    idea: z.string().describe("The core idea being analyzed."),
    perspectives: z.array(AgentPerspectiveSchema).describe("The collection of analyses from each specialist agent."),
    verdict: z.object({
        summary: z.string().describe("The Chancellor's final synthesized verdict."),
        recommendations: z.array(z.string()).describe("A list of actionable next steps."),
    }).describe("The final verdict from the Chancellor."),
});
export type SovereignsCouncilResult = z.infer<typeof SovereignsCouncilResultSchema>;
