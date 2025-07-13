
'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { TypographicState } from '@/hooks/use-typographic-state';
import { ArchitectSigil, OracleSigil, SentinelSigil } from './sigils';

interface ObeliskProps {
  typographicState: TypographicState;
  isInteractive?: boolean;
}

/**
 * Renders the central Obelisk of Genesis, a core visual and interactive element.
 * It's a pseudo-3D object that reacts to mouse movement and the application's
 * typographic state, creating an interactive and mesmerizing centerpiece.
 * Its appearance is now driven solely by direct user interaction state.
 * @returns {JSX.Element} The rendered Obelisk component.
 */
export function Obelisk({ typographicState, isInteractive = false }: ObeliskProps) {
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
  
  const { obeliskColor1, obeliskColor2, obeliskColor3, obeliskGlow, obeliskAnimation } = typographicState;
  
  return (
    <div className={cn(
        "flex flex-col items-center justify-center h-full w-full relative group animate-float-in",
        isInteractive && "cursor-pointer"
        )} style={{animationFillMode: 'backwards'}}>
      <div 
        className="relative transition-transform duration-200 ease-out" 
        style={{ transform, transformStyle: 'preserve-3d' }}
      >
        {/* The glow effect behind the Obelisk */}
        <div 
            className={cn(
                "absolute w-48 h-48 bg-primary/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-all duration-500 group-hover:bg-primary/30",
                 isInteractive && "bg-accent/40 group-hover:bg-accent/50 animate-pulse"
                )}
            style={{ opacity: obeliskGlow }}
        ></div>
        
        {/* The Obelisk structure itself */}
        <div 
          className={cn(
            "relative w-24 h-80 bg-obsidian-black flex flex-col items-center py-8 transition-all duration-300 shadow-[0_0_40px_10px_hsl(var(--primary)/0.1)]",
            isInteractive && "shadow-[0_0_50px_15px_hsl(var(--accent)/0.2)]"
          )}
          style={{
            transformStyle: 'preserve-3d',
            clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)',
            animation: obeliskAnimation
          }}
        >
          {/* Surface textures to give the Obelisk a more complex, ancient feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 opacity-70"></div>
          
          {/* Luminous Sigils "carved" into the surface */}
          <div 
            className="space-y-8 relative z-10" 
            style={{ transform: 'translateZ(10px)' }} // Bring sigils forward
          >
            <ArchitectSigil
              className="w-8 h-8 opacity-20 group-hover:opacity-60 transition-opacity duration-300 animate-pulse"
              style={{ color: `hsl(${obeliskColor1})` }}
            />
            <OracleSigil
              className="w-6 h-6 opacity-20 group-hover:opacity-60 transition-opacity duration-300 animate-pulse [animation-delay:0.2s]"
              style={{ color: `hsl(${obeliskColor2})` }}
            />
            <SentinelSigil
               className="w-10 h-10 opacity-10 group-hover:opacity-40 transition-opacity duration-300 animate-pulse [animation-delay:0.4s]"
               style={{ color: `hsl(${obeliskColor3})` }}
            />
          </div>
        </div>
      </div>
       {isInteractive && (
        <div className="absolute bottom-[-20px] text-xs font-bold tracking-widest text-accent/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          CLICK TO EXIT FOCUS
        </div>
      )}
    </div>
  );
}
