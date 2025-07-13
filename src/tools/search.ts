/**
 * @fileoverview Defines a 'search' tool that the AI can use to look up information.
 * This is a foundational tool for the "BEEP as Task Architect" feature, allowing the
 * AI to gather external context to formulate guided, step-by-step plans for the user.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateMockSearchResults } from '@/ai/flows/generate-mock-search-results';


/**
 * Defines a tool named 'search' that the AI can learn to call.
 * This tool now uses an AI-powered flow to generate dynamic, realistic mock
 * search results, making it fully interactive for demonstration purposes.
 */
export const search = ai.defineTool(
  {
    name: 'search',
    description: 'Search for information on the web to answer a user\'s question.',
    inputSchema: z.object({
      query: z.string().describe("The user's search query."),
    }),
    outputSchema: z.string().describe('A JSON string of mock search results.'),
  },
  async input => {
    console.log(`[Search Tool] Simulating search for: ${input.query}`);
    
    // Call the flow to generate realistic, but fake, search results.
    const results = await generateMockSearchResults(input);
    
    // Return the results as a JSON string so the chat message can parse it.
    return JSON.stringify(results);
  }
);
