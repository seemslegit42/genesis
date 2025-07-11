/**
 * @fileoverview A dynamic, animated logo component representing the BEEP brand.
 * This replaces a static SVG to align with the "Aetheric Sigil" design philosophy,
 * making the core brand identity feel alive and responsive.
 */

import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Renders the animated BEEP logo.
 * The logo consists of stylized letterforms that subtly animate, giving it
 * a "living" quality that's central to the app's aesthetic.
 * @param {LogoProps} props The props for the component.
 * @returns {JSX.Element} The rendered logo component.
 */
export function Logo({ className, width = 100, height = 40 }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 40"
      width={width}
      height={height}
      className={cn('transition-all duration-300 hover:opacity-80', className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="logo-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>
          {`
            @keyframes pulse-letter {
              0%, 100% { opacity: 0.8; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.05); }
            }
            .pulse-1 { animation: pulse-letter 6s ease-in-out infinite; animation-delay: 0s; }
            .pulse-2 { animation: pulse-letter 6s ease-in-out infinite; animation-delay: 0.2s; }
            .pulse-3 { animation: pulse-letter 6s ease-in-out infinite; animation-delay: 0.4s; }
            .pulse-4 { animation: pulse-letter 6s ease-in-out infinite; animation-delay: 0.6s; }
          `}
        </style>
      </defs>
      <g fill="hsl(var(--primary))" style={{ filter: 'url(#logo-glow)' }}>
        {/* B */}
        <path d="M5,5 V35 H20 C27.76,35 30,30 30,20 C30,10 27.76,5 20,5 H5 Z M12,12 H18 C21.31,12 23,14 23,20 C23,26 21.31,28 18,28 H12 V12 Z" className="pulse-1" />
        {/* E */}
        <path d="M35,5 V35 H50 V23 H42 V17 H50 V5 H35 Z" className="pulse-2" />
        {/* E */}
        <path d="M55,5 V35 H70 V23 H62 V17 H70 V5 H55 Z" className="pulse-3" />
        {/* P */}
        <path d="M75,5 V35 H83 V20 C83,12 88,10 92,10 C96,10 95,14 95,17 V35 H100 V15 C100,5 95,5 90,5 C85,5 83,8 83,12 V5 H75 Z" transform="translate(-5, 0)" className="pulse-4" />
      </g>
    </svg>
  );
}
