'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Defines the shape of the ambient properties that can be manipulated.
interface AmbientState {
  intensity: number; // The opacity of the aurora effect.
  speed: number; // The duration of the background animation in seconds.
}

// Defines the possible states the ambient background can be in.
type FocusState = 'calm' | 'focus' | 'recording';

// Maps the FocusState to specific ambient values.
const stateMappings: Record<FocusState, AmbientState> = {
  calm: {
    intensity: 0.2,
    speed: 30,
  },
  focus: {
    intensity: 0.4,
    speed: 15,
  },
  recording: {
    intensity: 0.6,
    speed: 5,
  },
};

// Defines the shape of the context that will be provided.
interface AmbientStateContextType {
  setAmbientState: (focusState: FocusState) => void;
  currentState: AmbientState;
}

// Create the React Context.
const AmbientStateContext = createContext<AmbientStateContextType | null>(null);

// The provider component that wraps the application.
export const AmbientStateProvider = ({ children }: { children: ReactNode }) => {
  const [ambientState, setAmbientState] = useState<AmbientState>(stateMappings.calm);

  // Function to change the ambient state based on a FocusState.
  const setFocusState = useCallback((focusState: FocusState) => {
    setAmbientState(stateMappings[focusState] || stateMappings.calm);
  }, []);

  // Effect to apply the ambient state to the document's CSS custom properties.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--aurora-intensity', String(ambientState.intensity));
    root.style.setProperty('--aurora-speed', `${ambientState.speed}s`);
  }, [ambientState]);

  return (
    <AmbientStateContext.Provider value={{ setAmbientState: setFocusState, currentState: ambientState }}>
      {children}
    </AmbientStateContext.Provider>
  );
};

// Custom hook to easily consume the AmbientStateContext.
export const useAmbientState = () => {
  const context = useContext(AmbientStateContext);
  if (context === null) {
    throw new Error('useAmbientState must be used within an AmbientStateProvider');
  }
  return context;
};
