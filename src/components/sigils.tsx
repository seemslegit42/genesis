import { cn } from "@/lib/utils";
import { Scale, ShieldQuestion, Briefcase, HeartHandshake, Construction } from "lucide-react";

interface SigilProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    isActive?: boolean;
}

const sigilGlowFilter = (
    <defs>
        <filter id="sigil-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
    </defs>
);

export function ArchitectSigil({ className, ...props }: SigilProps) {
    return (
        <svg
            viewBox="0 0 100 100"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className={cn("transition-all duration-300", className)}
            style={{ filter: 'url(#sigil-glow)' }}
            {...props}
        >
            {sigilGlowFilter}
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
            style={{ filter: 'url(#sigil-glow)' }}
            {...props}
        >
            {sigilGlowFilter}
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
            style={{ filter: 'url(#sigil-glow)' }}
            {...props}
        >
            {sigilGlowFilter}
            <path d="M10 50 L50 10 L90 50 L50 90 Z" />
            <path d="M30 50 L50 30 L70 50 L50 70 Z" />
        </svg>
    );
}


// Sovereign's Council Sigils
const baseIconProps = {
    strokeWidth: 1,
    width: "100%",
    height: "100%",
};

export const StrategistSigil = () => <Scale {...baseIconProps} />;
export const CynicSigil = () => <ShieldQuestion {...baseIconProps} />;
export const EconomistSigil = () => <Briefcase {...baseIconProps} />;
export const MarketerSigil = () => <HeartHandshake {...baseIconProps} />;
export const BuilderSigil = () => <Construction {...baseIconProps} />;
