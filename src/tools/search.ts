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
    description: 'Search for information on the web.',
    inputSchema: z.object({
      query: z.string(),
    }),
    outputSchema: z.string(),
  },
  async input => {
    console.log(`[Search Tool] Simulating search for: ${input.query}`);
    // Generate mock results using an internal AI flow.
    const mockResults = await generateMockSearchResults({ query: input.query });
    // Return the results as a JSON string, which the frontend will parse.
    return JSON.stringify(mockResults);
  }
);
