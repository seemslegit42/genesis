'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Defines the shape of the typographic variables that can be manipulated.
interface TypographicState {
  wght: number;
  slnt: number;
  letterSpacing: number;
  transform: string;
}

// Defines the possible states the typography can be in.
type NexusState = 'default' | 'active' | 'sanctuary' | 'echo';

// Maps the NexusState to specific typographic values. This is the core of the TSE.
const stateMappings: Record<NexusState, TypographicState> = {
  default: { wght: 400, slnt: 0, letterSpacing: 0, transform: 'none' },
  active: { wght: 500, slnt: -2, letterSpacing: 0, transform: 'none' },
  sanctuary: { wght: 350, slnt: 0, letterSpacing: 2, transform: 'none' },
  echo: { wght: 400, slnt: -5, letterSpacing: 0, transform: 'skewX(-3deg)' },
};

// Defines the shape of the context that will be provided.
interface TypographicStateContextType {
  applyState: (nexusState: NexusState) => void;
}

// Create the React Context.
const TypographicStateContext = createContext<TypographicStateContextType | null>(null);

// The provider component that wraps the application.
export const TypographicStateProvider = ({ children }: { children: ReactNode }) => {
  const [typographicState, setTypographicState] = useState<TypographicState>(stateMappings.default);

  // Function to change the typographic state based on a NexusState.
  const applyState = (nexusState: NexusState) => {
    setTypographicState(stateMappings[nexusState] || stateMappings.default);
  };

  // Effect to apply the typographic state to the document's CSS custom properties.
  useEffect(() => {
    document.documentElement.style.setProperty('--sigil-wght', String(typographicState.wght));
    document.documentElement.style.setProperty('--sigil-slnt', String(typographicState.slnt));
    document.documentElement.style.setProperty('--sigil-letterspacing', `${typographicState.letterSpacing}%`);
    document.documentElement.style.setProperty('--sigil-transform', typographicState.transform);
  }, [typographicState]);

  return (
    <TypographicStateContext.Provider value={{ applyState }}>
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
