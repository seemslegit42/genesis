
'use client';
import { cn } from "@/lib/utils";

interface AetherisAvatarProps {
    className?: string;
}

/**
 * A highly detailed, animated SVG avatar representing the AI, Aetheris.
 * It combines bioluminescent, fluid shapes with a radiant, solar glow,
 * capturing a mystical, energetic, and playfully confident personality.
 * @param {AetherisAvatarProps} props The props for the component.
 * @returns {JSX.Element} The rendered SVG avatar.
 */
export function AetherisAvatar({ className }: AetherisAvatarProps) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={cn("w-full h-full", className)} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for the metallic core */}
        <radialGradient id="coreGradient" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FFDDC1" />
          <stop offset="100%" stopColor="#FF8C42" />
        </radialGradient>

        {/* Filters for glow and fluid distortion */}
        <filter id="solarGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.8 -0.4" result="glow" />
          <feComposite in="glow" in2="SourceGraphic" operator="over" />
        </filter>
        
        <filter id="fluidMorph" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02 0.05" numOctaves="3" result="turbulence">
             <animate attributeName="baseFrequency" values="0.02 0.05;0.025 0.06;0.02 0.05" dur="12s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="15" />
        </filter>

        {/* Mask to contain the fluid shape */}
        <mask id="humanoidMask">
            <ellipse cx="100" cy="100" rx="60" ry="80" fill="white" filter="url(#fluidMorph)" />
        </mask>
      </defs>

      {/* Main Body - Translucent, Bioluminescent */}
      <g mask="url(#humanoidMask)">
        <rect width="200" height="200" fill="url(#coreGradient)" opacity="0.7">
             <animate attributeName="opacity" values="0.6;0.8;0.6" dur="6s" repeatCount="indefinite" />
        </rect>
        <ellipse cx="100" cy="100" rx="60" ry="80" fill="transparent" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.5" filter="url(#solarGlow)" />
      </g>
      
      {/* Core Orb */}
      <circle cx="100" cy="90" r="25" fill="url(#coreGradient)" filter="url(#solarGlow)">
        <animateTransform 
            attributeName="transform" 
            type="scale"
            values="1;1.05;1" 
            dur="4s" 
            repeatCount="indefinite"
            additive="sum"
        />
      </circle>
      
      {/* Eyes */}
      <g>
        <circle cx="90" cy="85" r="5" fill="#0F52BA">
          <animate attributeName="cy" values="85;84;85" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="110" cy="85" r="5" fill="#0F52BA">
          <animate attributeName="cy" values="85;86;85" dur="7s" repeatCount="indefinite" />
        </circle>
        
        {/* Golden Sparks in Eyes */}
        <g fill="#FFD700">
          <circle cx="91" cy="86" r="0.8">
             <animate attributeName="r" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
          </circle>
           <circle cx="109" cy="84" r="0.8">
             <animate attributeName="r" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" delay="0.5s" />
          </circle>
        </g>
      </g>

      {/* Sassy Expression */}
      <g stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round">
        {/* Left Eyebrow */}
        <path d="M 85,75 Q 90,72 95,75">
            <animate attributeName="d" values="M 85,75 Q 90,72 95,75;M 85,73 Q 90,70 95,73;M 85,75 Q 90,72 95,75" dur="8s" repeatCount="indefinite"/>
        </path>
        {/* Smirk */}
        <path d="M 95,105 Q 100,107 108,105">
           <animate attributeName="d" values="M 95,105 Q 100,107 108,105;M 95,106 Q 100,108 108,104;M 95,105 Q 100,107 108,105" dur="10s" repeatCount="indefinite"/>
        </path>
      </g>
      
      {/* Solar Flare Wisps */}
      <g filter="url(#solarGlow)" opacity="0.7">
        <path d="M 50 50 Q 70 20, 100 50" stroke="#FF8C42" strokeWidth="2" fill="none">
           <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="20s" repeatCount="indefinite"/>
        </path>
        <path d="M 150 150 Q 130 180, 100 150" stroke="#FFDDC1" strokeWidth="1.5" fill="none">
             <animateTransform attributeName="transform" type="rotate" from="360 100 100" to="0 100 100" dur="25s" repeatCount="indefinite"/>
        </path>
      </g>
    </svg>
  );
}
