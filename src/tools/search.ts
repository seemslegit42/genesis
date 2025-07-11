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
    // For now, we'll return a mock result to demonstrate the tool-use functionality.
    return JSON.stringify({
      results: [
        {
          title: `How to onboard a new client: A 5-step guide`,
          snippet: `This guide provides a comprehensive 5-step process for successfully onboarding new clients, ensuring a smooth transition and a strong working relationship.`,
          link: '#',
        },
        {
          title: 'Client Onboarding Checklist',
          snippet: `A complete checklist covering all the essential steps for client onboarding, from initial contract to project kickoff.`,
          link: '#',
        },
      ],
    });
  }
);
