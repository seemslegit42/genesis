import { cn } from "@/lib/utils";

interface SigilProps {
    className?: string;
    isActive?: boolean;
}

export function SendSigil({ className, isActive }: SigilProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)}>
            <defs>
                <filter id="glow-send" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation={isActive ? "2.5" : "1.5"} result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path 
                d="M7 11L12 6L17 11M12 18V7" 
                stroke="hsl(var(--primary))" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className={cn("transition-all duration-300", isActive ? "opacity-100" : "opacity-70")}
                style={{ filter: 'url(#glow-send)' }}
            />
        </svg>
    );
}

export function MicSigil({ className, isActive }: SigilProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)}>
             <defs>
                <filter id="glow-mic" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation={isActive ? "3" : "2"} result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g style={{ filter: 'url(#glow-mic)' }}>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"  stroke="hsl(var(--primary))" strokeWidth="1.5" fill={isActive ? "hsl(var(--primary) / 0.3)" : "none"} className="transition-all duration-300" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="hsl(var(--primary))" strokeWidth="1.5" className="transition-all duration-300" />
                <line x1="12" y1="19" x2="12" y2="23" stroke="hsl(var(--primary))" strokeWidth="1.5" className="transition-all duration-300" />
                 {isActive && (
                    <>
                        <path d="M5 12a7 7 0 0 0 14 0" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.5" className="animate-pulse" />
                        <path d="M8 12a4 4 0 0 0 8 0" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.7" className="animate-pulse [animation-delay:0.2s]" />
                    </>
                 )}
            </g>
        </svg>
    );
}


export function StopSigil({ className, isActive }: SigilProps) {
     return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("w-6 h-6", className)}>
             <defs>
                <filter id="glow-stop" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <rect 
                x="6" y="6" width="12" height="12" rx="2" 
                stroke="hsl(var(--destructive))"
                fill="hsl(var(--destructive) / 0.5)"
                strokeWidth="2" 
                className="animate-pulse"
                style={{ filter: 'url(#glow-stop)' }}
            />
        </svg>
    );
}
