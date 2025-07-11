export function Obelisk() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute w-32 h-full bg-primary/20 blur-[100px] -translate-y-1/2 top-1/2"></div>
        
        {/* Obelisk */}
        <div 
          className="relative w-24 h-[60%] bg-obsidian-black flex flex-col items-center py-8"
          style={{
            clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)',
            boxShadow: '0 0 30px 5px hsl(var(--primary) / 0.1)',
          }}
        >
          {/* Surface texture using gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
          
          {/* Placeholder for Sigils */}
          <div className="space-y-8">
            <div className="w-8 h-8 opacity-20" data-ai-hint="ancient symbol">
                <svg viewBox="0 0 100 100" fill="hsl(var(--primary))">
                    <path d="M50 0 L61.8 38.2 L100 38.2 L69.1 61.8 L80.9 100 L50 76.4 L19.1 100 L30.9 61.8 L0 38.2 L38.2 38.2 Z" />
                </svg>
            </div>
             <div className="w-6 h-6 opacity-20" data-ai-hint="geometric pattern">
                <svg viewBox="0 0 100 100" fill="hsl(var(--secondary))">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" />
                    <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="8" />
                </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
