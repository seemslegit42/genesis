'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

/**
 * Renders the central Obelisk of Genesis, a core visual and interactive element.
 * It's a pseudo-3D object that reacts to mouse movement, creating an interactive
 * and mesmerizing centerpiece for the application's initial state. It is the primary
 * action hub, inviting the user to begin their journey.
 * @returns {JSX.Element} The rendered Obelisk component.
 */
export function Obelisk() {
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

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative group animate-float-in" style={{animationFillMode: 'backwards'}}>
      <div 
        className="relative transition-transform duration-200 ease-out" 
        style={{ transform, transformStyle: 'preserve-3d' }}
      >
        {/* The glow effect behind the Obelisk */}
        <div className={cn(
            "absolute w-48 h-48 bg-primary/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-all duration-500",
            "group-hover:bg-primary/30",
            "opacity-[var(--obelisk-glow)]"
        )}></div>
        
        {/* The Obelisk structure itself */}
        <div 
          className={cn(
            "relative w-24 h-80 bg-obsidian-black flex flex-col items-center py-8 transition-all duration-300",
            "shadow-[0_0_40px_10px_hsl(var(--primary)/0.1)]",
            "animate-[var(--obelisk-animation)]"
          )}
          style={{
            transformStyle: 'preserve-3d',
            clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)',
          }}
        >
          {/* Surface textures to give the Obelisk a more complex, ancient feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 opacity-70"></div>
          
          {/* Luminous Sigils "carved" into the surface */}
          <div 
            className="space-y-8" 
            style={{ transform: 'translateZ(10px)' }} // Bring sigils forward
          >
            <div className="w-8 h-8 opacity-20 group-hover:opacity-60 transition-opacity duration-300 animate-pulse" data-ai-hint="ancient symbol">
                <svg viewBox="0 0 100 100" fill="hsl(var(--obelisk-color-1))">
                    <path d="M50 0 L61.8 38.2 L100 38.2 L69.1 61.8 L80.9 100 L50 76.4 L19.1 100 L30.9 61.8 L0 38.2 L38.2 38.2 Z" />
                </svg>
            </div>
             <div className="w-6 h-6 opacity-20 group-hover:opacity-60 transition-opacity duration-300 animate-pulse [animation-delay:0.2s]" data-ai-hint="geometric pattern">
                <svg viewBox="0 0 100 100" stroke="hsl(var(--obelisk-color-2))" strokeWidth="8" fill="transparent" >
                    <circle cx="50" cy="50" r="40" />
                    <line x1="50" y1="10" x2="50" y2="90" />
                </svg>
            </div>
             <div className="w-10 h-10 opacity-10 group-hover:opacity-40 transition-opacity duration-300 animate-pulse [animation-delay:0.4s]" data-ai-hint="arcane circle">
                <svg viewBox="0 0 100 100" stroke="hsl(var(--obelisk-color-3))" strokeWidth="4" fill="transparent">
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
