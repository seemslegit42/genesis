'use server';
/**
 * @fileOverview Generates realistic mock search results for a given query.
 * This flow is used by the `search` tool to provide dynamic, simulated data,
 * making the tool interactive for demonstration and development.
 *
 * - generateMockSearchResults - The main function to generate results.
 * - GenerateMockSearchResultsInput - The input type for the function.
 * - GenerateMockSearchResultsOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { SearchResultsSchema, type SearchResults } from '@/lib/search-types';


const GenerateMockSearchResultsInputSchema = z.object({
  query: z.string().describe('The search query from the user.'),
});
export type GenerateMockSearchResultsInput = z.infer<typeof GenerateMockSearchResultsInputSchema>;


export async function generateMockSearchResults(input: GenerateMockSearchResultsInput): Promise<SearchResults> {
  return generateMockSearchResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMockSearchResultsPrompt',
  input: { schema: GenerateMockSearchResultsInputSchema },
  output: { schema: SearchResultsSchema },
  prompt: `You are a search result simulator. Based on the user's query, generate a list of 3-5 realistic but entirely fictional search results.

Query: {{{query}}}

Provide plausible titles, snippets, and fictional .com URLs for each result. The content should look like a real search engine results page.`,
});

const generateMockSearchResultsFlow = ai.defineFlow(
  {
    name: 'generateMockSearchResultsFlow',
    inputSchema: GenerateMockSearchResultsInputSchema,
    outputSchema: SearchResultsSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
