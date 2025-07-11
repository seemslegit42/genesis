'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Defines the possible ambient states of the application, which directly control
// the visual feedback of the "Living Sanctuary" environment.
type AmbientState = 'calm' | 'focus' | 'recording';

// Maps each AmbientState to specific CSS variable values that control the aurora.
// 'calm': The default, gentle state.
// 'focus': A more intense state, triggered by user interaction like typing.
// 'recording': A vibrant, pulsating state for voice input.
const stateMappings: Record<AmbientState, { intensity: number; speed: number }> = {
  calm: { intensity: 0.2, speed: 30 },
  focus: { intensity: 0.5, speed: 15 },
  recording: { intensity: 0.7, speed: 5 },
};

// Defines the shape of the context that will be provided to consumers.
interface AmbientStateContextType {
  setAmbientState: (state: AmbientState) => void;
  currentState: AmbientState;
}

// Create the React Context for the ambient state.
const AmbientStateContext = createContext<AmbientStateContextType | null>(null);

/**
 * The provider component that wraps the application, making the ambient state
 * available to all child components. It manages the current state and applies
 * the corresponding CSS variables to the root element.
 * @param {Readonly<{children: ReactNode}>} props The component's children.
 * @returns {JSX.Element} The rendered provider component.
 */
export const AmbientStateProvider = ({ children }: { children: ReactNode }) => {
  const [ambientState, setAmbientState] = useState<AmbientState>('calm');

  const setFocusState = useCallback((state: AmbientState) => {
    setAmbientState(state);
  }, []);

  // Effect to apply the ambient state to the document's CSS custom properties.
  useEffect(() => {
    const root = document.documentElement;
    const { intensity, speed } = stateMappings[ambientState] || stateMappings.calm;
    root.style.setProperty('--aurora-intensity', String(intensity));
    root.style.setProperty('--aurora-speed', `${speed}s`);
  }, [ambientState]);

  return (
    <AmbientStateContext.Provider value={{ setAmbientState: setFocusState, currentState: ambientState }}>
      {children}
    </AmbientStateContext.Provider>
  );
};

/**
 * Custom hook to easily consume the AmbientStateContext from any component.
 * This provides a simple API to change the application's ambient visual state.
 * @returns {AmbientStateContextType} The context value.
 */
export const useAmbientState = () => {
  const context = useContext(AmbientStateContext);
  if (context === null) {
    throw new Error('useAmbientState must be used within an AmbientStateProvider');
  }
  return context;
};
