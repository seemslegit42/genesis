
'use client';

import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useAppStore } from '@/hooks/use-app-store';

interface ObeliskProps {
  isAiResponding: boolean;
  cipherStream: string[];
}

const ObeliskFace = ({ content, rotation }: { content: React.ReactNode, rotation: string }) => (
  <div
    className="absolute w-full h-full backface-hidden flex items-center justify-center"
    style={{ transform: rotation }}
  >
    {content}
  </div>
);


/**
 * Renders the central Obelisk of Genesis, a core visual and interactive element.
 * It's a pseudo-3D object that reacts to mouse movement and the application's
 * typographic state, creating an interactive and mesmerizing centerpiece.
 * Its appearance is now driven solely by direct user interaction state.
 */
export function Obelisk({ isAiResponding, cipherStream }: ObeliskProps) {
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');
  const [key, setKey] = useState(0);
  const { focusedMessageId, setFocusedMessageId } = useAppStore();
  
  const isInteractive = !!focusedMessageId;
  const glowOpacity = isInteractive || isAiResponding ? 0.4 : 0.2;
  const animation = isAiResponding ? 'float 3s ease-in-out infinite' : 'float 6s ease-in-out infinite';


  useEffect(() => {
    // This resets the CSS animation when the stream updates.
    setKey(prevKey => prevKey + 1);
  }, [cipherStream]);

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
  
  const cipherContent = (
      <div key={key} className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
        <div className="absolute bottom-0 left-0 w-full animate-cipher-scroll flex flex-col items-center text-center">
            {cipherStream.slice().reverse().map((line, index) => (
                <p key={index} className="font-mono text-primary/60 text-sm py-2 leading-tight tracking-wider" style={{ textShadow: '0 0 5px hsl(var(--primary)/0.7)'}}>
                    {line}
                </p>
            ))}
        </div>
      </div>
  );
  
  return (
    <div
      onClick={() => isInteractive && setFocusedMessageId(null)}
      className={cn(
        "flex flex-col items-center justify-center h-full w-full relative group animate-float-in",
        isInteractive && "cursor-pointer"
        )} style={{animationFillMode: 'backwards'}}>
      <div 
        className="relative transition-transform duration-200 ease-out w-24 h-80" 
        style={{ transform, transformStyle: 'preserve-3d' }}
      >
        {/* The glow effect behind the Obelisk */}
        <div 
            className={cn(
                "absolute w-48 h-48 bg-primary blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 transition-all duration-500 group-hover:bg-primary/80",
                 isInteractive && "bg-accent/80 group-hover:bg-accent",
                 isAiResponding && "animate-pulse"
                )}
            style={{ opacity: glowOpacity }}
        ></div>
        
        {/* The Obelisk structure itself */}
        <div 
          className={cn(
            "relative w-24 h-80 transition-all duration-300",
            isAiResponding && "animate-pulse"
          )}
          style={{
            transformStyle: 'preserve-3d',
            animation
          }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-black/80"></div>
             <ObeliskFace
              content={cipherContent}
              rotation="rotateY(0deg) translateZ(3rem)"
            />
            <ObeliskFace
              content={cipherContent}
              rotation="rotateY(90deg) translateZ(3rem)"
            />
             <ObeliskFace
              content={cipherContent}
              rotation="rotateY(180deg) translateZ(3rem)"
            />
             <ObeliskFace
              content={cipherContent}
              rotation="rotateY(-90deg) translateZ(3rem)"
            />
             <div
                className="absolute inset-0 border-x-2 border-primary/20"
                style={{ transform: 'translateZ(3rem) scaleY(1.01)' }}
            ></div>
            <div
                className="absolute inset-0 border-x-2 border-primary/20"
                style={{ transform: 'rotateY(90deg) translateZ(3rem) scaleY(1.01)' }}
            ></div>
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
