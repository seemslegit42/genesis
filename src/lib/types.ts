/**
 * @fileoverview This file centralizes all core type definitions for the application,
 * creating a single source of truth for our data structures.
 */

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
