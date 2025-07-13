/**
 * @fileoverview Defines a 'search' tool that the AI can use to look up information.
 * This is a foundational tool for the "BEEP as Task Architect" feature, allowing the
 * AI to gather external context to formulate guided, step-by-step plans for the user.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { scrapeAndSummarizeWebsite } from './firecrawl';


/**
 * Defines a tool named 'search' that the AI can learn to call.
 * This tool now uses an AI-powered flow to generate dynamic, realistic mock
 * search results, making it fully interactive for demonstration purposes.
 */
export const search = ai.defineTool(
  {
    name: 'search',
    description: 'Search for information on the web. This is a proxy for scraping a specific URL.',
    inputSchema: z.object({
      query: z.string().describe("The user's search query. This will be used to find a relevant URL to scrape."),
    }),
    outputSchema: z.string(),
  },
  async input => {
    console.log(`[Search Tool] Simulating search for: ${input.query}`);
    
    // This is a temporary shim. A real implementation would use a search API
    // to find a URL based on the query. For now, we'll use a hardcoded example
    // if the query contains a known keyword, or default to a generic news site.
    let url;
    if (input.query.toLowerCase().includes('next.js')) {
        url = 'https://nextjs.org/docs';
    } else if (input.query.toLowerCase().includes('firebase')) {
        url = 'https://firebase.google.com/docs';
    } else {
        url = 'https://www.bbc.com/news';
    }

    console.log(`[Search Tool] Passing URL to scrape tool: ${url}`);
    
    // Call the Firecrawl tool to get the content.
    const result = await scrapeAndSummarizeWebsite({ url });
    
    // The chat message component expects a JSON object for rich display.
    // The scrape tool returns a plain summary string. We'll wrap it
    // in a structure that looks like a single search result.
    const searchResultPayload = {
        type: 'searchResults',
        results: [
            {
                title: `Summary of ${url}`,
                link: url,
                snippet: result,
            }
        ]
    }
    return JSON.stringify(searchResultPayload);
  }
);
