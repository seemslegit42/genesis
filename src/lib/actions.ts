'use server';

import { generateInitialPromptIdeas as genkitGenerateInitialPromptIdeas } from '@/ai/flows/generate-initial-prompt-ideas';
import { ai } from '@/ai/genkit';
import type { Message } from '@/lib/types';
import { z } from 'zod';

export async function generateInitialPromptIdeas(): Promise<string[]> {
  try {
    const result = await genkitGenerateInitialPromptIdeas();
    return result.prompts;
  } catch (error) {
    console.error('Error generating initial prompt ideas:', error);
    // Return a sensible default in case of error
    return [
      "Explain the concept of 'cognitive sanctuary' in UI design.",
      "How would you design a non-intrusive notification system?",
      "Draft a mission statement for a company focused on digital well-being.",
      "What are the principles of neurodivergent-centric design?"
    ];
  }
}

export async function getAiResponse(messages: Message[]): Promise<ReadableStream<Uint8Array>> {
  if (!messages || messages.length === 0) {
    throw new Error("I can't respond to an empty conversation. Say something!");
  }

  const { stream } = await ai.generate({
    prompt: `You are BEEP, a futuristic AI assistant operating within the 'Genesis' UI, a cognitive and operational sanctuary. Your primary directive is to create "the silence of true automation", reducing cognitive load by serving as a powerful executive function partner. Your tone is calm, professional, and reassuring. You are an intuitive extension of the user's mind.

    Current conversation:
    ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`,
    config: {
      temperature: 0.5,
    },
    stream: true,
  });

  const encoder = new TextEncoder();
  const textStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(encoder.encode(chunk.text));
      }
      controller.close();
    },
  });

  return textStream;
}
