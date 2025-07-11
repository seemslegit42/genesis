import { cn } from "@/lib/utils";

/**
 * Props for the Obelisk component.
 * @interface ObeliskProps
 */
interface ObeliskProps {
  /** A callback function invoked when the Obelisk is clicked. */
  onClick: () => void;
  /** The summary text to display, or null if no summary is active. */
  summary: string | null;
  /** A boolean indicating if a summary is currently being loaded. */
  isLoading: boolean;
  /** A boolean indicating if the Obelisk should be interactive (i.e., if a chat has started). */
  isInteractive: boolean;
}

/**
 * Renders the central Obelisk of Genesis, a core visual and interactive element.
 * In the initial state, it serves as a visual anchor on the empty Canvas. During a
 * conversation, it becomes an "Action Hub" that can be clicked to display a summary
 * of the current task. Its design is meant to evoke an ancient, powerful monolith.
 * @param {ObeliskProps} props The props for the component.
 * @returns {JSX.Element} The rendered Obelisk component.
 */
export function Obelisk({ onClick, summary, isLoading, isInteractive }: ObeliskProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center h-full w-full relative group",
        isInteractive && "cursor-pointer"
      )}
      onClick={isInteractive ? onClick : undefined}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* The glow effect behind the Obelisk, which intensifies on hover. */}
        <div className={cn(
            "absolute w-32 h-full bg-primary/20 blur-[100px] -translate-y-1/2 top-1/2 transition-all duration-500",
            isInteractive && "group-hover:bg-primary/30"
        )}></div>
        
        {/* The Obelisk structure itself. */}
        <div 
          className={cn(
            "relative w-24 h-[60%] bg-obsidian-black flex flex-col items-center py-8 transition-all duration-300",
            isLoading && "animate-pulse"
          )}
          style={{
            clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)',
            boxShadow: '0 0 30px 5px hsl(var(--primary) / 0.1)',
          }}
        >
          {/* Surface textures to give the Obelisk a more complex, ancient feel. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
          
          {/* Luminous Sigils representing user achievements, "carved" into the surface. */}
          <div className="space-y-8">
            <div className="w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity" data-ai-hint="ancient symbol">
                <svg viewBox="0 0 100 100" fill="hsl(var(--primary))">
                    <path d="M50 0 L61.8 38.2 L100 38.2 L69.1 61.8 L80.9 100 L50 76.4 L19.1 100 L30.9 61.8 L0 38.2 L38.2 38.2 Z" />
                </svg>
            </div>
             <div className="w-6 h-6 opacity-20 group-hover:opacity-40 transition-opacity" data-ai-hint="geometric pattern">
                <svg viewBox="0 0 100 100" fill="hsl(var(--secondary))">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="8" />
                </svg>
            </div>
          </div>
        </div>
        
        {/* The summary overlay, which appears when the Obelisk is active. */}
        {summary && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center p-4">
                <div className="glassmorphism max-w-md w-full p-4 text-center text-foreground text-sm">
                    {summary}
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
