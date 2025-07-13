/**
 * @fileoverview Defines a tool for scraping and summarizing website content using Firecrawl.
 * This tool allows the AI to access and process real-time information from the web.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import FireCrawl from 'firecrawl';

// Ensure the API key is being loaded from environment variables
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
if (!firecrawlApiKey) {
  console.warn('FIRECRAWL_API_KEY is not set. The scrapeAndSummarizeWebsite tool will not work.');
}

const firecrawl = new FireCrawl({ apiKey: firecrawlApiKey || 'not-set' });

/**
 * Defines a tool that scrapes a website's content using Firecrawl and then
 * summarizes it using a powerful language model.
 */
export const scrapeAndSummarizeWebsite = ai.defineTool(
  {
    name: 'scrapeAndSummarizeWebsite',
    description: 'Scrapes a URL for its main content and provides a summary. Use this to get up-to-date information or details from a specific webpage.',
    inputSchema: z.object({
      url: z.string().url().describe('The full URL of the website to scrape and summarize.'),
    }),
    outputSchema: z.string().describe('A concise summary of the website content.'),
  },
  async ({ url }) => {
    if (!firecrawlApiKey) {
      return 'Error: Firecrawl API key is not configured.';
    }

    try {
      console.log(`[Firecrawl Tool] Scraping URL: ${url}`);
      const scrapeResult = await firecrawl.scrape(url, {
        pageOptions: {
          onlyMainContent: true, // Focus on the important parts of the page
        },
      });
      
      if (!scrapeResult || !scrapeResult.data.markdown) {
        return `Could not retrieve content from ${url}.`;
      }
      
      console.log(`[Firecrawl Tool] Summarizing content for: ${url}`);
      
      // Use a powerful model to summarize the scraped text.
      const llm = ai.model('googleai/gemini-2.0-flash');
      const { text: summary } = await ai.generate({
        model: llm,
        prompt: `Provide a concise, neutral summary of the following web content. Focus on the key facts and information. Do not add any preamble.
        
        Content to summarize:
        ---
        ${scrapeResult.data.markdown.substring(0, 15000)}
        ---
        Summary:`,
        config: {
            temperature: 0.2,
        },
      });
      
      return summary;

    } catch (error: any) {
      console.error(`[Firecrawl Tool] Error scraping or summarizing ${url}:`, error);
      return `Error processing URL ${url}: ${error.message}`;
    }
  }
);
