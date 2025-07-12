/**
 * @fileoverview Defines a 'search' tool that the AI can use to look up information.
 * This is a foundational tool for the "BEEP as Task Architect" feature, allowing the
 * AI to gather external context to formulate guided, step-by-step plans for the user.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

/**
 * Defines a tool named 'search' that the AI can learn to call.
 * This allows the AI to search for information on the web. In a real application,
 * this would be wired up to a proper search API.
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
    console.log(`[Search Tool] Searching for: ${input.query}`);
    // In a real application, this would call a search API (e.g., Google Search).
    // For now, we'll return an empty result to indicate it is a placeholder.
    return JSON.stringify({
      results: [],
    });
  }
);
