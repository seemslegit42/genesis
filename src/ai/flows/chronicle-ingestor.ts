'use server';
/**
 * @fileOverview A Genkit flow that acts as a full RAG (Retrieval-Augmented Generation) pipeline.
 * It takes a query, performs a web search, scrapes the top result, and synthesizes an answer.
 * This is the "Chronicle Ingestor."
 *
 * - chronicleIngestor - The main function to perform RAG.
 * - ChronicleIngestorInput - The input type for the function.
 * - ChronicleIngestorOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import FireCrawl from 'firecrawl';
import { generate } from 'genkit';

const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
if (!firecrawlApiKey) {
  console.warn('FIRECRAWL_API_KEY is not set. The Chronicle Ingestor tool will not work.');
}

const firecrawl = new FireCrawl({ apiKey: firecrawlApiKey || 'not-set' });


const ChronicleIngestorInputSchema = z.object({
  query: z.string().describe('The search query from the user.'),
});
export type ChronicleIngestorInput = z.infer<typeof ChronicleIngestorInputSchema>;

const ChronicleIngestorOutputSchema = z.object({
    answer: z.string().describe('A direct, synthesized answer to the query based on the ingested web content.'),
});
export type ChronicleIngestorOutput = z.infer<typeof ChronicleIngestorOutputSchema>;


export async function chronicleIngestor(input: ChronicleIngestorInput): Promise<ChronicleIngestorOutput> {
  return chronicleIngestorFlow(input);
}

const chronicleIngestorFlow = ai.defineFlow(
  {
    name: 'chronicleIngestorFlow',
    inputSchema: ChronicleIngestorInputSchema,
    outputSchema: ChronicleIngestorOutputSchema,
  },
  async ({ query }) => {
     if (!firecrawlApiKey) {
      return { answer: 'Error: The Chronicle Ingestor is not configured correctly. The Firecrawl API key is missing.' };
    }

    try {
        console.log(`[Chronicle Ingestor] Searching for: ${query}`);
        const searchResults = await firecrawl.search(query, {
            pageOptions: {
                fetchPageContent: true, // We need the content to summarize
                onlyMainContent: true,
            },
            limit: 1, // We only need the top result for a direct answer
        });

        if (!searchResults.data || searchResults.data.length === 0 || !searchResults.data[0].markdown) {
            return { answer: `I couldn't find a reliable source for "${query}".` };
        }
        
        const document = searchResults.data[0];
        console.log(`[Chronicle Ingestor] Ingesting content from: ${document.sourceURL}`);
        
        // Use a powerful model to synthesize an answer from the content.
        const llm = ai.model();
        const { text } = await generate({
            model: llm,
            prompt: `You are a synthesis engine. Based on the following web content, provide a direct and concise answer to the original query.
            Do not add any preamble like "Based on the content...". Just answer the question.

            Original Query: "${query}"
            
            Web Content to Synthesize:
            ---
            ${document.markdown.substring(0, 15000)}
            ---
            
            Synthesized Answer:`,
            config: {
                temperature: 0.1, // Be factual
            },
        });
        
        return { answer: text };

    } catch (error: any) {
        console.error(`[Chronicle Ingestor] Error processing query "${query}":`, error);
        return { answer: `Error while trying to consult the chronicles for "${query}": ${error.message}` };
    }
  }
);
