import { cn } from "@/lib/utils";
import { ArrowUp, Mic, Square } from "lucide-react";

interface SigilProps {
    className?: string;
    isActive?: boolean;
}

export function SendSigil({ className, isActive }: SigilProps) {
    return (
        <div className={cn("relative w-8 h-8", className)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                <defs>
                    <filter id="glow-send" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation={isActive ? "2.5" : "1.5"} result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                 <g style={{ filter: 'url(#glow-send)' }}>
                    <ArrowUp
                        className={cn("w-full h-full text-primary transition-all duration-300", isActive ? "opacity-100" : "opacity-70")}
                        strokeWidth={2}
                    />
                </g>
            </svg>
        </div>
    );
}

export function MicSigil({ className, isActive }: SigilProps) {
    return (
        <div className={cn("relative w-8 h-8", className)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
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
                     <Mic
                        className={cn("w-full h-full text-primary transition-all duration-300", isActive ? "text-destructive" : "text-primary")}
                        strokeWidth={1.5}
                        fill={isActive ? "hsl(var(--primary) / 0.3)" : "none"}
                     />
                     {isActive && (
                        <>
                           <path d="M5 12a7 7 0 0 0 14 0" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.5" className="animate-pulse" />
                           <path d="M8 12a4 4 0 0 0 8 0" stroke="hsl(var(--primary))" strokeWidth="1" strokeOpacity="0.7" className="animate-pulse [animation-delay:0.2s]" />
                        </>
                     )}
                </g>
            </svg>
        </div>
    );
}


export function StopSigil({ className, isActive }: SigilProps) {
     return (
        <div className={cn("relative w-8 h-8", className)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                 <defs>
                    <filter id="glow-stop" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                 <g style={{ filter: 'url(#glow-stop)' }}>
                    <Square
                        className="w-full h-full text-destructive animate-pulse"
                        strokeWidth={2}
                        fill="hsl(var(--destructive) / 0.5)"
                    />
                </g>
            </svg>
        </div>
    );
}
