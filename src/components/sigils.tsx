import { cn } from "@/lib/utils";
import { Scale, ShieldQuestion, Briefcase, HeartHandshake, Construction, ArrowUp, Mic, Square } from "lucide-react";

interface SigilProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    isActive?: boolean;
}

const sigilGlowFilter = (id: string, stdDeviation: string | number) => (
    <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={stdDeviation} result="coloredBlur" />
            <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
);

// --- Bespoke Aetheric Glyphs ---

export function ArchitectSigil({ className, ...props }: SigilProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className={cn("transition-all duration-300", className)}
            style={{ filter: 'url(#sigil-glow-bespoke)' }}
            {...props}
        >
            {sigilGlowFilter("sigil-glow-bespoke", 3)}
            <rect x="20" y="20" width="60" height="60" />
            <line x1="20" y1="20" x2="80" y2="80" />
            <line x1="80" y1="20" x2="20" y2="80" />
            <circle cx="50" cy="50" r="15" />
        </svg>
    );
}

export function OracleSigil({ className, ...props }: SigilProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className={cn("transition-all duration-300", className)}
            style={{ filter: 'url(#sigil-glow-bespoke)' }}
            {...props}
        >
            {sigilGlowFilter("sigil-glow-bespoke", 3)}
            <circle cx="50" cy="50" r="40" />
            <path d="M 50 30 A 20 20 0 0 1 50 70" />
            <path d="M 50 30 A 20 20 0 0 0 50 70" />
            <circle cx="50" cy="50" r="8" fill="currentColor"/>
        </svg>
    );
}

export function SentinelSigil({ className, ...props }: SigilProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className={cn("transition-all duration-300", className)}
            style={{ filter: 'url(#sigil-glow-bespoke)' }}
            {...props}
        >
            {sigilGlowFilter("sigil-glow-bespoke", 3)}
            <path d="M10 50 L50 10 L90 50 L50 90 Z" />
            <path d="M30 50 L50 30 L70 50 L50 70 Z" />
        </svg>
    );
}


// --- Stylized Lucide Primal Forms ---

interface LucideSigilProps {
    className?: string;
    isActive?: boolean;
}

export function SendSigil({ className, isActive }: LucideSigilProps) {
    return (
        <div className={cn("relative w-8 h-8", className)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                {sigilGlowFilter("glow-send", isActive ? "2.5" : "1.5")}
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

export function MicSigil({ className, isActive }: LucideSigilProps) {
    return (
        <div className={cn("relative w-8 h-8", className)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                {sigilGlowFilter("glow-mic", isActive ? "3" : "2")}
                <g style={{ filter: 'url(#glow-mic)' }}>
                     <Mic
                        className={cn("w-full h-full transition-all duration-300", isActive ? "text-destructive" : "text-primary")}
                        strokeWidth={1.5}
                        fill={isActive ? "hsl(var(--destructive) / 0.3)" : "none"}
                     />
                     {isActive && (
                        <>
                           <path d="M5 12a7 7 0 0 0 14 0" stroke="hsl(var(--destructive))" strokeWidth="1" strokeOpacity="0.5" className="animate-pulse" />
                           <path d="M8 12a4 4 0 0 0 8 0" stroke="hsl(var(--destructive))" strokeWidth="1" strokeOpacity="0.7" className="animate-pulse [animation-delay:0.2s]" />
                        </>
                     )}
                </g>
            </svg>
        </div>
    );
}


export function StopSigil({ className }: LucideSigilProps) {
     return (
        <div className={cn("relative w-8 h-8", className)}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                {sigilGlowFilter("glow-stop", "2.5")}
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


// --- Sovereign's Council Sigils (Lucide Primal Forms) ---
const baseIconProps = {
    strokeWidth: 1.5,
    width: "100%",
    height: "100%",
};

export const StrategistSigil = () => <Scale {...baseIconProps} />;
export const CynicSigil = () => <ShieldQuestion {...baseIconProps} />;
export const EconomistSigil = () => <Briefcase {...baseIconProps} />;
export const MarketerSigil = () => <HeartHandshake {...baseIconProps} />;
export const BuilderSigil = () => <Construction {...baseIconProps} />;
