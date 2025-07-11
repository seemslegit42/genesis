'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { TypographicState } from '@/hooks/use-typographic-state';

/**
 * A single, permanent sigil carved into the Obelisk.
 * Its properties are determined by a seed to give each one a unique,
 * yet deterministic, appearance and animation.
 */
const PermanentSigil = ({ seed }: { seed: number }) => {
    const size = 1 + (seed % 3); // 1, 2, or 3
    const animationDelay = (seed * 1.37 % 5).toFixed(2);
    const opacity = (0.05 + (seed * 0.13 % 0.1)).toFixed(2);
    const top = (10 + (seed * 3.14 % 80));
    const left = (20 + (seed * 2.71 % 60));

    return (
        <div 
            className="absolute animate-pulse"
            style={{
                width: `${size * 5}px`,
                height: `${size * 5}px`,
                top: `${top}%`,
                left: `${left}%`,
                animationDelay: `${animationDelay}s`,
                animationDuration: `${6 + (seed % 4)}s`,
                opacity: Number(opacity),
                transform: `rotate(${seed * 17 % 360}deg)`
            }}
        >
            <svg viewBox="0 0 100 100" stroke="hsl(var(--primary-foreground))" strokeWidth="10" fill="none">
                 <circle cx="50" cy="50" r={20 + (seed % 15)} />
                 <line x1={20 + (seed%10)} y1={20 + (seed%10)} x2={80 - (seed%10)} y2={80 - (seed%10)} />
            </svg>
        </div>
    )
}

interface ObeliskProps {
  typographicState: TypographicState;
  totalUsers: number;
  totalEngagement: number;
}

/**
 * Renders the central Obelisk of Genesis, a core visual and interactive element.
 * It's a pseudo-3D object that reacts to mouse movement and the application's
 * typographic state, creating an interactive and mesmerizing centerpiece.
 * As a Legacy Engine, its luminosity and the number of "carved" sigils on its
 * surface reflect the collective activity of the entire user base.
 * @returns {JSX.Element} The rendered Obelisk component.
 */
export function Obelisk({ typographicState, totalUsers, totalEngagement }: ObeliskProps) {
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (window.innerWidth < 768) { // Disable on mobile for performance
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
        return;
      }
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      const rotateY = (clientX / innerWidth - 0.5) * 20; // Max rotation 10deg
      const rotateX = (0.5 - clientY / innerHeight) * 20; // Max rotation 10deg
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const { obeliskColor1, obeliskColor2, obeliskColor3 } = typographicState;
  
  // The Obelisk's energy state is now tied to the collective, not just the individual.
  const collectiveGlow = Math.min(0.2 + (totalEngagement / 5000), 0.7);
  const collectiveAnimation = `float ${Math.max(6 - (totalEngagement / 200), 1.5)}s ease-in-out infinite`;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative group animate-float-in" style={{animationFillMode: 'backwards'}}>
      <div 
        className="relative transition-transform duration-200 ease-out" 
        style={{ transform, transformStyle: 'preserve-3d' }}
      >
        {/* The glow effect behind the Obelisk */}
        <div 
            className="absolute w-48 h-48 bg-primary/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-all duration-500 group-hover:bg-primary/30"
            style={{ opacity: collectiveGlow }}
        ></div>
        
        {/* The Obelisk structure itself */}
        <div 
          className="relative w-24 h-80 bg-obsidian-black flex flex-col items-center py-8 transition-all duration-300 shadow-[0_0_40px_10px_hsl(var(--primary)/0.1)]"
          style={{
            transformStyle: 'preserve-3d',
            clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)',
            animation: collectiveAnimation
          }}
        >
          {/* Surface textures to give the Obelisk a more complex, ancient feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 opacity-70"></div>
          
           {/* The permanent sigils carved by the collective of Initiates */}
          <div className="absolute inset-0 z-0">
             {Array.from({ length: Math.min(totalUsers, 50) }).map((_, i) => (
                <PermanentSigil key={i} seed={i} />
            ))}
          </div>

          {/* Luminous Sigils "carved" into the surface */}
          <div 
            className="space-y-8 relative z-10" 
            style={{ transform: 'translateZ(10px)' }} // Bring sigils forward
          >
            <div className="w-8 h-8 opacity-20 group-hover:opacity-60 transition-opacity duration-300 animate-pulse" data-ai-hint="ancient symbol">
                <svg viewBox="0 0 100 100" fill={obeliskColor1}>
                    <path d="M50 0 L61.8 38.2 L100 38.2 L69.1 61.8 L80.9 100 L50 76.4 L19.1 100 L30.9 61.8 L0 38.2 L38.2 38.2 Z" />
                </svg>
            </div>
             <div className="w-6 h-6 opacity-20 group-hover:opacity-60 transition-opacity duration-300 animate-pulse [animation-delay:0.2s]" data-ai-hint="geometric pattern">
                <svg viewBox="0 0 100 100" stroke={obeliskColor2} strokeWidth="8" fill="transparent" >
                    <circle cx="50" cy="50" r="40" />
                    <line x1="50" y1="10" x2="50" y2="90" />
                </svg>
            </div>
             <div className="w-10 h-10 opacity-10 group-hover:opacity-40 transition-opacity duration-300 animate-pulse [animation-delay:0.4s]" data-ai-hint="arcane circle">
                <svg viewBox="0 0 100 100" stroke={obeliskColor3} strokeWidth="4" fill="transparent">
                    <circle cx="50" cy="50" r="45" />
                    <circle cx="50" cy="50" r="35" />
                    <path d="M 50,5 L 95,50 L 50,95 L 5,50 Z" />
                </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
