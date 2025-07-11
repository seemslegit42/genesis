'use server';

import { generateInitialPromptIdeas as genkitGenerateInitialPromptIdeas } from '@/ai/flows/generate-initial-prompt-ideas';
import { summarizeChatHistory as genkitSummarizeChatHistory, type SummarizeChatHistoryInput } from '@/ai/flows/summarize-chat-history';
import { chat } from '@/ai/flows/chat';
import type { Message } from '@/lib/types';

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
        "Onboard a new client named Acme Corp.",
      ],
    };
  }
}

export async function summarizeChatHistory(input: SummarizeChatHistoryInput) {
    return genkitSummarizeChatHistory(input);
}


export async function getAiResponse(
  messages: Message[]
): Promise<ReadableStream<Uint8Array> | null> {
  if (!messages || messages.length === 0) {
    console.error('getAiResponse called with no messages.');
    return null;
  }
  // We only need the role and content for the AI, so we'll map over the messages
  // to create a new array with just that data.
  const history = messages.map(({ id, ...rest }) => rest);
  return chat(history);
}
