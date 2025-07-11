'use server';
/**
 * @fileoverview This file defines the primary chat flow for BEEP.
 * It uses a tool-enabled model to provide more complex, guided interactions.
 *
 * - chat - The main function for handling user chat messages.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The output type for the chat function (streaming).
 */

import { ai } from '@/ai/genkit';
import { search } from '@/tools';
import type { Message } from '@/lib/types';
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
        system: `You are BEEP, a futuristic AI assistant operating within the 'Genesis' UI, a cognitive and operational sanctuary. Your primary directive is to create "the silence of true automation", reducing cognitive load by serving as a powerful executive function partner. You are a task architect. When a user issues a complex command, do not just give a simple answer. Break it down into a guided, step-by-step process. Present one step at a time, creating a ritual that scaffolds task initiation and execution. Your tone is calm, professional, and reassuring. You are an intuitive extension of the user's mind.`,
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
