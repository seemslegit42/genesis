import type { SearchResults } from '@/lib/search-types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Globe } from 'lucide-react';

interface SearchResultProps {
  results: SearchResults['results'];
}

/**
 * Renders a list of search results in a structured, visually appealing card format.
 * This component takes the raw JSON output from the search tool and transforms it
 * into a rich, interactive element within the chat stream, making the information
 * immediately scannable and actionable for the user.
 * @param {SearchResultProps} props The props for the component.
 * @returns {JSX.Element} The rendered search results component.
 */
export function SearchResult({ results }: SearchResultProps) {
  return (
    <Card className="bg-transparent border-0 shadow-none w-full max-w-sm md:max-w-lg lg:max-w-3xl">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-4 pt-5 px-5">
        <Globe className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg font-headline text-primary">Web Search Results</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-4">
          {results.map((result, index) => (
            <a
              key={index}
              href={result.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors duration-200"
            >
              <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors duration-200">
                {result.title}
              </h4>
              <p className="text-xs text-secondary/80 pt-1 pb-2 truncate">{result.link}</p>
              <p className="text-sm text-muted-foreground">{result.snippet}</p>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
