'use client';

interface InvocationCardProps {
  title: string;
  description: string;
  onClick: () => void;
  sigil: React.ReactNode;
}

export function InvocationCard({ title, description, onClick, sigil }: InvocationCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative p-8 flex flex-col items-center text-center rounded-lg glassmorphism cursor-pointer transition-all duration-300 hover:border-primary/50 hover:-translate-y-2 hover:shadow-primary/20 hover:shadow-2xl prose prose-invert"
    >
      <div className="w-16 h-16 mb-6 text-primary transition-all duration-300 group-hover:text-primary group-hover:drop-shadow-[0_0_10px_hsl(var(--primary))] not-prose">
        {sigil}
      </div>
      <h3>{title}</h3>
      <p className="text-muted-foreground flex-grow">{description}</p>
       <div className="absolute bottom-4 right-4 text-xs font-bold text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 not-prose">
        SELECT
      </div>
    </div>
  );
}
