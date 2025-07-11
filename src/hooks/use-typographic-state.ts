
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TypographicState {
  wght: number;
  slnt: number;
  letterSpacing: number;
  transform: string;
}

type NexusState = 'default' | 'active' | 'sanctuary' | 'echo';

const stateMappings: Record<NexusState, TypographicState> = {
  default: { wght: 400, slnt: 0, letterSpacing: 0, transform: 'none' },
  active: { wght: 500, slnt: -2, letterSpacing: 0, transform: 'none' },
  sanctuary: { wght: 350, slnt: 0, letterSpacing: 2, transform: 'none' },
  echo: { wght: 400, slnt: -5, letterSpacing: 0, transform: 'skewX(-3deg)' },
};

interface TypographicStateContextType {
  applyState: (nexusState: NexusState) => void;
}

const TypographicStateContext = createContext<TypographicStateContextType | undefined>(undefined);

export const TypographicStateProvider = ({ children }: { children: ReactNode }) => {
  const [typographicState, setTypographicState] = useState<TypographicState>(stateMappings.default);

  const applyState = (nexusState: NexusState) => {
    setTypographicState(stateMappings[nexusState] || stateMappings.default);
  };

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

export const useTypographicState = () => {
  const context = useContext(TypographicStateContext);
  if (context === undefined) {
    throw new Error('useTypographicState must be used within a TypographicStateProvider');
  }
  return context;
};
