import { Card, CardContent } from '@/components/ui/card';

interface InitialPromptsProps {
  prompts: string[];
  onPromptClick: (prompt: string) => void;
}

export function InitialPrompts({ prompts, onPromptClick }: InitialPromptsProps) {
  if (prompts.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
             <h2 className="text-xl font-headline mb-2 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">
                BEEP
            </h2>
             <p className="text-muted-foreground mb-8 max-w-md">
                Loading suggestions...
            </p>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-xl font-headline mb-2 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">
        BEEP
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        This is your cognitive and operational sanctuary. How can I assist?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {prompts.slice(0, 4).map((prompt, i) => (
          <Card
            key={i}
            onClick={() => onPromptClick(prompt)}
            className="group cursor-pointer glassmorphism hover:border-accent/50 transition-all duration-300 text-left"
          >
            <CardContent className="p-4 flex items-center justify-between">
              <p className="text-foreground">{prompt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
