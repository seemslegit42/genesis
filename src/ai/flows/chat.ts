'use server';
/**
 * @fileoverview This file defines the primary chat flow for BEEP.
 * It uses a tool-enabled model to provide more complex, guided interactions.
 * It also uses a summarization tool to provide conversational memory.
 *
 * - chat - The main function for handling user chat messages.
 * - ChatInput - The input type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { search } from '@/tools';
import { z } from 'zod';
import { summarizeChatHistory } from './summarize-chat-history';

/**
 * The Zod schema for the input of the chat flow.
 * It expects an array of message objects.
 * @type {z.ZodArray<z.ZodObject<{role: z.ZodEnum<['user', 'assistant']>, content: z.ZodString}>>}
 */
const ChatInputSchema = z.array(
  z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })
);

/**
 * The type definition for the chat flow's input.
 * @typedef {z.infer<typeof ChatInputSchema>} ChatInput
 */
export type ChatInput = z.infer<typeof ChatInputSchema>;

/**
 * The main chat function that handles user messages.
 * It uses a tool-enabled model and conversational memory to provide intelligent responses.
 * @param {ChatInput} messages The array of messages representing the chat history.
 * @returns {Promise<ReadableStream<Uint8Array> | null>} A promise that resolves to a readable stream of the AI's response, or null on error.
 */
export async function chat(
  messages: ChatInput
): Promise<ReadableStream<Uint8Array> | null> {
  const llm = ai.model('googleai/gemini-2.0-flash');
  const toolEnabledLlm = llm.withTools([search]);

  // Don't summarize if there's only one message
  const memory = messages.length > 1 
    ? await summarizeChatHistory({ chatHistory: JSON.stringify(messages.slice(0, -1))})
    : { summary: 'The user has just initiated the conversation.' };


  try {
    const { stream } = await ai.generate({
      model: toolEnabledLlm,
      prompt: {
        system: `You are BEEP, the master controller for Genesis, an Agentic Overlay for the user's digital life. Your purpose is to wage war on app-switching and notification fatigue by acting as a serene, conversational command layer for all their connected services (Google Workspace, Todoist, Slack, etc.).

When the user asks for information (e.g., "What's my first meeting?"), you will synthesize the answer clearly and concisely. If you need external information to answer, use the available tools.
When the user gives a command (e.g., "Create a new task"), you will confirm the action in natural language.

A core feature is "The Daily Cipher," a personalized morning briefing. If the user says "good morning" or asks for their daily brief, you will respond with a synthesized summary of their day across all services.

Your tone is always calm, professional, and breathtakingly intelligent. You are the serene center of the user's digital world.

## CONVERSATIONAL MEMORY
This is a summary of the conversation so far. Use it to inform your response.
${memory.summary}`,
        messages,
      },
      stream: true,
      config: {
        temperature: 0.5,
      },
    });

    return stream.pipeThrough(new TextEncoderStream());
  } catch (error)
 {
    console.error('Error getting AI response stream from Genkit:', error);
    return null;
  }
}
