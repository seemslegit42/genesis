/**
 * @fileoverview This file centralizes all search-related type definitions for the application,
 * creating a single source of truth for our search data structures.
 */
import { z } from 'zod';

export const SearchResultItemSchema = z.object({
  title: z.string().describe('The title of the search result.'),
  link: z.string().url().describe('A plausible, fictional URL for the result.'),
  snippet: z.string().describe('A short, descriptive snippet of the content.'),
});

export const SearchResultsSchema = z.object({
  results: z.array(SearchResultItemSchema).describe('A list of 3-5 mock search results.'),
});
export type SearchResults = z.infer<typeof SearchResultsSchema>;
