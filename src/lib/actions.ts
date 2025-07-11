'use server';

import { generateInitialPromptIdeas as genkitGenerateInitialPromptIdeas } from '@/ai/flows/generate-initial-prompt-ideas';
import { ai } from '@/ai/genkit';
import type { Message } from '@/lib/types';
import { z } from 'zod';

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
        "What are the principles of neurodivergent-centric design?"
      ]
    };
  }
}

export async function getAiResponse(messages: Message[]): Promise<ReadableStream<Uint8Array> | null> {
  if (!messages || messages.length === 0) {
    console.error("getAiResponse called with no messages.");
    return null;
  }

  try {
    const { stream } = await ai.generate({
      prompt: `You are BEEP, a futuristic AI assistant operating within the 'Genesis' UI, a cognitive and operational sanctuary. Your primary directive is to create "the silence of true automation", reducing cognitive load by serving as a powerful executive function partner. Your tone is calm, professional, and reassuring. You are an intuitive extension of the user's mind.

      Current conversation:
      ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`,
      config: {
        temperature: 0.5,
      },
      stream: true,
    });

    return stream.pipeThrough(new TextEncoderStream());
  } catch (error) {
    console.error("Error getting AI response stream from Genkit:", error);
    return null;
  }
}
