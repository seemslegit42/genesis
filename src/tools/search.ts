
/**
 * @fileoverview Defines a 'search' tool that the AI can use to look up information.
 * This is a foundational tool for the "BEEP as Task Architect" feature, allowing the
 * AI to gather external context to formulate guided, step-by-step plans for the user.
 * It's powered by the "Chronicle Ingestor" flow.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { chronicleIngestor } from '@/ai/flows/chronicle-ingestor';


/**
 * Defines a tool named 'search' that the AI can learn to call.
 * This tool uses the Chronicle Ingestor flow to perform a web search,
 * scrape the content of the top result, and return a synthesized answer.
 */
export const search = ai.defineTool(
  {
    name: 'search',
    description: 'Search for information on the web to answer a user\'s question. Provides a direct, synthesized answer from the top search result.',
    inputSchema: z.object({
      query: z.string().describe("The user's search query."),
    }),
    outputSchema: z.string().describe('A synthesized answer based on the content of the top web search result.'),
  },
  async input => {
    console.log(`[Search Tool] Engaging Chronicle Ingestor for: ${input.query}`);
    
    const { answer } = await chronicleIngestor(input);
    
    // Return the synthesized answer directly.
    return answer;
  }
);
