import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface InitialPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export function InitialPrompts({ prompts, onPromptClick }: InitialPromptsProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-3xl font-headline mb-2 text-primary drop-shadow-[0_0_5px_hsl(var(--primary))]">
        Welcome to BEEP
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        I am a futuristic AI assistant. What can I help you with today? Here are some ideas to get started:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {prompts.slice(0, 4).map((prompt, i) => (
          <Card
            key={i}
            onClick={() => onPromptClick(prompt)}
            className="group cursor-pointer bg-card/80 backdrop-blur-sm border border-border hover:border-accent/50 hover:bg-accent/10 transition-all duration-300"
          >
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-left">{prompt}</p>
              <ArrowRight className="size-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
