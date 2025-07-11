
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Defines the shape of the typographic state.
 * These properties map directly to the CSS custom properties that control the font variations.
 * @interface TypographicState
 */
interface TypographicState {
  wght: number;
  slnt: number;
  letterSpacing: number;
  transform: string;
}

/**
 * Defines the possible states the Nexus typography can be in.
 * Each state corresponds to a preset configuration of typographic variables.
 * @type {('default' | 'active' | 'sanctuary' | 'echo')}
 */
type NexusState = 'default' | 'active' | 'sanctuary' | 'echo';

/**
 * A mapping of Nexus states to their corresponding typographic configurations.
 * This is the core of the state-to-style translation.
 * @const {Record<NexusState, TypographicState>}
 */
const stateMappings: Record<NexusState, TypographicState> = {
  default: { wght: 400, slnt: 0, letterSpacing: 0, transform: 'none' },
  active: { wght: 500, slnt: -2, letterSpacing: 0, transform: 'none' },
  sanctuary: { wght: 350, slnt: 0, letterSpacing: 2, transform: 'none' },
  echo: { wght: 400, slnt: -5, letterSpacing: 0, transform: 'skewX(-3deg)' },
};

/**
 * Defines the shape of the context provided by the TypographicStateProvider.
 * @interface TypographicStateContextType
 */
interface TypographicStateContextType {
  applyState: (nexusState: NexusState) => void;
}

/**
* The React Context for managing the global typographic state.
* @const {React.Context<TypographicStateContextType | undefined>}
*/
const TypographicStateContext = createContext<TypographicStateContextType | undefined>(undefined);

/**
 * The provider component for the Typographic State Engine (TSE).
 * It manages the typographic state and applies it to the document's root element.
 * This component should wrap the entire application.
 * @param {{ children: ReactNode }} props The props for the component.
 * @returns {JSX.Element} The rendered provider component.
 */
export const TypographicStateProvider = ({ children }: { children: ReactNode }) => {
  const [typographicState, setTypographicState] = useState<TypographicState>(stateMappings.default);

  /**
   * Sets the global typographic state based on a named Nexus state.
   * @param {NexusState} nexusState The desired state to apply.
   */
  const applyState = (nexusState: NexusState) => {
    setTypographicState(stateMappings[nexusState] || stateMappings.default);
  };

  // Effect to apply the typographic state to the document's CSS variables.
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

/**
 * The custom hook for accessing the Typographic State Engine.
 * This provides a clean interface for components to trigger typographic state changes.
 * @returns {TypographicStateContextType} The context value, including the `applyState` function.
 */
export const useTypographicState = (): TypographicStateContextType => {
  const context = useContext(TypographicStateContext);
  if (context === undefined) {
    throw new Error('useTypographicState must be used within a TypographicStateProvider');
  }
  return context;
};
