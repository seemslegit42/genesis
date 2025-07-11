'use server';

import { generateInitialPromptIdeas as genkitGenerateInitialPromptIdeas } from '@/ai/flows/generate-initial-prompt-ideas';
import { ai } from '@/ai/genkit';
import type { Message } from '@/lib/types';
import { z } from 'zod';

export async function generateInitialPromptIdeas() {
  try {
    const result = await genkitGenerateInitialPromptIdeas();
    return result.prompts;
  } catch (error) {
    console.error('Error generating initial prompt ideas:', error);
    return [];
  }
}

export async function getAiResponse(messages: Message[]): Promise<string> {
  if (!messages || messages.length === 0) {
    return "I can't respond to an empty conversation. Say something!";
  }

  try {
    const llmResponse = await ai.generate({
      prompt: `You are BEEP, a futuristic AI assistant. Your responses should be helpful and concise. You have a slightly robotic but friendly tone. Use markdown for formatting when appropriate. The user is interacting with you through a sleek, neon-themed chat interface.

      Current conversation:
      ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`,
      config: {
        temperature: 0.7,
      }
    });

    return llmResponse.text();
  } catch (error) {
    console.error('Error getting AI response:', error);
    return 'I am unable to respond at the moment due to a system error.';
  }
}
