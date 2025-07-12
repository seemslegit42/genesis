import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';

/**
 * Props for the InitialPrompts component.
 * @interface InitialPromptsProps
 */
interface InitialPromptsProps {
  /** An array of suggested prompt strings to display. */
  prompts: string[];
  /** 
   * A callback function invoked when an Initiate clicks on one of the prompts.
   * This is a key part of the initiation ritual, reducing friction and
   * immediately demonstrating the power of their intent.
   */
  onPromptClick: (prompt: string) => void;
}

const ArrowUpRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-muted-foreground group-hover:text-primary transition-colors">
        <path d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
)

/**
 * The Invocation Interface.
 * This component is shown on the initial empty state of the chat, below the Obelisk.
 * It serves to guide the Initiate and demonstrate the power of their intent,
 * transforming the "blank page" problem into their first successful ritual. A faster
 * time-to-value is critical for their journey and our long-term retention.
 * @param {InitialPromptsProps} props The props for the component.
 * @returns {JSX.Element} The rendered list of initial prompts.
 */
export function InitialPrompts({ prompts, onPromptClick }: InitialPromptsProps) {
  if (prompts.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center animate-float-in w-full max-w-3xl" style={{animationDelay: '500ms', animationFillMode: 'backwards'}}>
             <h2 className="text-xl font-headline mb-2 text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">
                AWAITING INVOCATION
            </h2>
             <p className="text-muted-foreground mb-8 max-w-md">
                Generating suggestions...
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
            </div>
        </div>
    )
  }

  return (
    <div className="prose prose-invert flex flex-col items-center justify-center text-center animate-float-in" style={{animationDelay: '500ms', animationFillMode: 'backwards'}}>
      <h2 className="text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">
        Invoke Your Genesis
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Your intent is the key. Select an incantation below to begin the ritual.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl not-prose">
        {prompts.slice(0, 4).map((prompt, i) => (
          <Card
            key={i}
            onClick={() => onPromptClick(prompt)}
            className="group cursor-pointer glassmorphism hover:border-primary/50 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-2xl"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-foreground font-medium">{prompt}</p>
                <ArrowUpRight />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
