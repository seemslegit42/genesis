'use client';
import { InvocationCard } from './invocation-card';

interface RiteOfInvocationProps {
  onComplete: (vow: string) => void;
}

export function RiteOfInvocation({ onComplete }: RiteOfInvocationProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-float-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline text-primary drop-shadow-[0_0_10px_hsl(var(--primary))] mb-2">
          Choose Your Vow
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your first choice defines your path. This Vow attunes BEEP: Genesis to your primary intent. It can be changed later, but your origin is eternal.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <InvocationCard
          title="The Architect"
          description="For those who build. Choose this path to focus on creation, system design, and bringing ideas to life with precision and structure."
          onClick={() => onComplete('Architect')}
          sigil={
            <svg viewBox="0 0 100 100" stroke="currentColor" strokeWidth="4" fill="none">
              <rect x="20" y="20" width="60" height="60" />
              <line x1="20" y1="20" x2="80" y2="80" />
              <line x1="80" y1="20" x2="20" y2="80" />
              <circle cx="50" cy="50" r="15" />
            </svg>
          }
        />
        <InvocationCard
          title="The Oracle"
          description="For those who seek wisdom. This path enhances strategic insight, pattern recognition, and uncovering hidden opportunities."
          onClick={() => onComplete('Oracle')}
          sigil={
            <svg viewBox="0 0 100 100" stroke="currentColor" strokeWidth="4" fill="none">
                <circle cx="50" cy="50" r="40" />
                <path d="M 50 30 A 20 20 0 0 1 50 70" />
                <path d="M 50 30 A 20 20 0 0 0 50 70" />
                <circle cx="50" cy="50" r="8" fill="currentColor"/>
            </svg>
          }
        />
        <InvocationCard
          title="The Sentinel"
          description="For those who protect. This path prioritizes security, problem-solving, and defending your digital sovereignty with vigilance."
          onClick={() => onComplete('Sentinel')}
          sigil={
            <svg viewBox="0 0 100 100" stroke="currentColor" strokeWidth="4" fill="none">
                <path d="M10 50 L50 10 L90 50 L50 90 Z" />
                <path d="M30 50 L50 30 L70 50 L50 70 Z" />
            </svg>
          }
        />
      </div>
    </div>
  );
}
