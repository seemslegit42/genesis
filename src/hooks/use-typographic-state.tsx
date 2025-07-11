'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Defines the shape of the typographic variables that can be manipulated.
interface TypographicState {
  wght: number;
  slnt: number;
  letterSpacing: number;
  transform: string;
  obeliskColor1: string; // HSL string for var()
  obeliskColor2: string; // HSL string for var()
  obeliskColor3: string; // HSL string for var()
  obeliskGlow: number; // Opacity value
  obeliskAnimation: string; // Animation property value
}

// Defines the possible states the typography can be in.
type NexusState = 'default' | 'active' | 'sanctuary' | 'echo';

// Maps the NexusState to specific typographic values. This is the core of the TSE.
const stateMappings: Record<NexusState, TypographicState> = {
  default: { 
    wght: 400, 
    slnt: 0, 
    letterSpacing: 0, 
    transform: 'none',
    obeliskColor1: 'var(--primary)',
    obeliskColor2: 'var(--secondary)',
    obeliskColor3: 'var(--accent)',
    obeliskGlow: 0.2,
    obeliskAnimation: 'float 6s ease-in-out infinite'
  },
  active: { 
    wght: 500, 
    slnt: -2, 
    letterSpacing: 0, 
    transform: 'none',
    obeliskColor1: 'var(--primary)',
    obeliskColor2: 'var(--primary)',
    obeliskColor3: 'var(--secondary)',
    obeliskGlow: 0.4,
    obeliskAnimation: 'float 3s ease-in-out infinite'
  },
  sanctuary: { 
    wght: 350, 
    slnt: 0, 
    letterSpacing: 2, 
    transform: 'none',
    obeliskColor1: 'var(--muted)',
    obeliskColor2: 'var(--muted-foreground)',
    obeliskColor3: 'var(--border)',
    obeliskGlow: 0.1,
    obeliskAnimation: 'float 12s ease-in-out infinite'
  },
  echo: { 
    wght: 400, 
    slnt: -5, 
    letterSpacing: 0, 
    transform: 'skewX(-3deg)',
    obeliskColor1: 'var(--accent)',
    obeliskColor2: 'var(--accent)',
    obeliskColor3: 'var(--accent)',
    obeliskGlow: 0.5,
    obeliskAnimation: 'float 1s ease-in-out infinite'
  },
};

// Defines the shape of the context that will be provided.
interface TypographicStateContextType {
  applyState: (nexusState: NexusState) => void;
  currentState: TypographicState;
}

// Create the React Context.
const TypographicStateContext = createContext<TypographicStateContextType | null>(null);

// The provider component that wraps the application.
export const TypographicStateProvider = ({ children }: { children: ReactNode }) => {
  const [typographicState, setTypographicState] = useState<TypographicState>(stateMappings.default);

  // Function to change the typographic state based on a NexusState.
  const applyState = useCallback((nexusState: NexusState) => {
    setTypographicState(stateMappings[nexusState] || stateMappings.default);
  }, []);

  // Effect to apply the typographic state to the document's CSS custom properties.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--sigil-wght', String(typographicState.wght));
    root.style.setProperty('--sigil-slnt', String(typographicState.slnt));
    root.style.setProperty('--sigil-letterspacing', `${typographicState.letterSpacing}%`);
    root.style.setProperty('--sigil-transform', typographicState.transform);
    root.style.setProperty('--obelisk-color-1', `hsl(${typographicState.obeliskColor1})`);
    root.style.setProperty('--obelisk-color-2', `hsl(${typographicState.obeliskColor2})`);
    root.style.setProperty('--obelisk-color-3', `hsl(${typographicState.obeliskColor3})`);
    root.style.setProperty('--obelisk-glow', String(typographicState.obeliskGlow));
    root.style.setProperty('--obelisk-animation', typographicState.obeliskAnimation);
  }, [typographicState]);

  return (
    <TypographicStateContext.Provider value={{ applyState, currentState: typographicState }}>
      {children}
    </TypographicStateContext.Provider>
  );
};

// Custom hook to easily consume the TypographicStateContext.
export const useTypographicState = () => {
  const context = useContext(TypographicStateContext);
  if (context === null) {
    throw new Error('useTypographicState must be used within a TypographicStateProvider');
  }
  return context;
};
