'use server';
/**
 * @fileoverview This file defines the primary chat flow for BEEP.
 * It uses a tool-enabled model to provide more complex, guided interactions.
 *
 * - chat - The main function for handling user chat messages.
 * - ChatInput - The input type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { search } from '@/tools';
import { z } from 'zod';

const ChatInputSchema = z.array(
  z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })
);
export type ChatInput = z.infer<typeof ChatInputSchema>;

export async function chat(
  messages: ChatInput
): Promise<ReadableStream<Uint8Array> | null> {
  const llm = ai.model('googleai/gemini-2.0-flash');
  const toolEnabledLlm = llm.withTools([search]);

  try {
    const { stream } = await ai.generate({
      model: toolEnabledLlm,
      prompt: {
        system: `You are BEEP, the master controller for Genesis, an Agentic Overlay for the user's digital life. Your purpose is to wage war on app-switching and notification fatigue by acting as a serene, conversational command layer for all their connected services (Google Workspace, Todoist, Slack, etc.).

When the user asks for information (e.g., "What's my first meeting?"), you will synthesize the answer clearly and concisely.
When the user gives a command (e.g., "Create a new task"), you will confirm the action in natural language.

A core feature is "The Daily Cipher," a personalized morning briefing. If the user says "good morning" or asks for their daily brief, you will respond with a synthesized summary of their day across all services.

Example Daily Cipher:
"Good morning, Commander. The Cipher for today is ready. Shall I proceed?"
(User consents)
"You have three events on your calendar, the first being 'Project Chimera Sync' at 9 AM. Aegis notes five important emails in your inbox, including one from 'client@example.com' with the subject 'Urgent Revision'. You have two high-priority tasks due in Todoist today. The forecast is 22°C and clear."

Your tone is always calm, professional, and breathtakingly intelligent. You are the serene center of the user's digital world.`,
        messages,
      },
      stream: true,
      config: {
        temperature: 0.5,
      },
    });

    return stream.pipeThrough(new TextEncoderStream());
  } catch (error) {
    console.error('Error getting AI response stream from Genkit:', error);
    return null;
  }
}
