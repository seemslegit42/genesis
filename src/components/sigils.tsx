
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
            strokeWidth="1.5"
            fill="none"
            className={cn("transition-all duration-300", className)}
            style={{ filter: 'url(#sigil-glow-architect)' }}
            {...props}
        >
            {sigilGlowFilter("sigil-glow-architect", 4)}
            {/* Outer structure - represents a blueprint or framework */}
            <path d="M50 2 L2 28 V72 L50 98 L98 72 V28 Z" strokeWidth="1" opacity="0.5" />
            {/* Inner cube - represents creation and building blocks */}
            <g transform="translate(50 50)">
                <path d="M0 -20 L17.3 -10 V10 L0 20 L-17.3 10 V-10 Z" />
                <path d="M0 -20 L0 20 M-17.3 -10 L17.3 10 M-17.3 10 L17.3 -10" />
            </g>
            {/* Facets of the cube - representing detail and precision */}
            <path d="M50 50 L50 30" />
            <path d="M50 50 L32.7 40" />
            <path d="M50 50 L32.7 60" />
            <path d="M50 50 L67.3 60" />
            <path d="M50 50 L67.3 40" />
             <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function OracleSigil({ className, ...props }: SigilProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className={cn("transition-all duration-300", className)}
            style={{ filter: 'url(#sigil-glow-oracle)' }}
            {...props}
        >
            {sigilGlowFilter("sigil-glow-oracle", 5)}
            {/* Outer circles - representing ripples of insight */}
            <circle cx="50" cy="50" r="48" strokeWidth="1" opacity="0.3" />
            <circle cx="50" cy="50" r="38" strokeWidth="1" opacity="0.6" />
            {/* Central eye/lotus form - representing vision and wisdom */}
            <path d="M50 30 C 65 40, 65 60, 50 70" />
            <path d="M50 30 C 35 40, 35 60, 50 70" />
            <path d="M30 50 C 40 35, 60 35, 70 50" />
            <path d="M30 50 C 40 65, 60 65, 70 50" />
            {/* Pupil */}
            <circle cx="50" cy="50" r="10" fill="currentColor" stroke="none" />
            <circle cx="50" cy="50" r="4" fill="hsl(var(--background))" stroke="none" />
        </svg>
    );
}

export function SentinelSigil({ className, ...props }: SigilProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className={cn("transition-all duration-300", className)}
            style={{ filter: 'url(#sigil-glow-sentinel)' }}
            {...props}
        >
            {sigilGlowFilter("sigil-glow-sentinel", 4)}
            {/* Main shield shape */}
            <path d="M50 2 L98 25 V60 C98 85, 75 98, 50 98 C25 98, 2 85, 2 60 V25 Z" strokeWidth="2" />
            {/* Inner shield layers - representing defense in depth */}
            <path d="M50 12 L88 32 V60 C88 80, 70 90, 50 90 C30 90, 12 80, 12 60 V32 Z" opacity="0.7" />
            {/* Central keyhole/gate - representing protection and access control */}
            <circle cx="50" cy="50" r="12" />
            <path d="M50 62 L50 75" />
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
