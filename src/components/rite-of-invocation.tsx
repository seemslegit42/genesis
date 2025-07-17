
'use client';
import { Vow } from '@/lib/types';
import { InvocationCard } from './invocation-card';
import { ArchitectSigil, OracleSigil, SentinelSigil } from './sigils';
import { cn } from '@/lib/utils';

interface RiteOfInvocationProps {
  onComplete: (vow: Vow) => void;
}

export function RiteOfInvocation({ onComplete }: RiteOfInvocationProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-float-in">
      <div className="text-center mb-12 prose prose-invert animate-float-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
        <h1 className="text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">
          Choose Your Vow
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This choice attunes BEEP to your primary intent. It can be changed later, but your origin is eternal.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <div className="animate-float-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
          <InvocationCard
            title="The Architect"
            description="For those who build. This path focuses on creation, system design, and bringing ideas to life with precision and structure."
            onClick={() => onComplete('Architect')}
            sigil={ <ArchitectSigil /> }
          />
        </div>
        <div className="animate-float-in" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
          <InvocationCard
            title="The Oracle"
            description="For those who seek wisdom. This path enhances strategic insight, pattern recognition, and uncovering hidden opportunities."
            onClick={() => onComplete('Oracle')}
            sigil={ <OracleSigil /> }
          />
        </div>
        <div className="animate-float-in" style={{ animationDelay: '800ms', animationFillMode: 'backwards' }}>
          <InvocationCard
            title="The Sentinel"
            description="For those who protect. This path prioritizes security, problem-solving, and defending digital sovereignty with vigilance."
            onClick={() => onComplete('Sentinel')}
            sigil={ <SentinelSigil /> }
          />
        </div>
      </div>
    </div>
  );
}
