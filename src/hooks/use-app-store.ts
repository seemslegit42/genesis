
'use client';

import { create } from 'zustand';

/**
 * Defines the possible ambient states of the application.
 * These states control the visual feedback of the UI, such as the aurora's intensity and speed.
 */
export type AmbientState = 'calm' | 'focus' | 'recording';

/**
 * The shape of the central application state store.
 */
interface AppState {
  ambientState: AmbientState;
  focusLevel: number; // Represents focus from 0 to 100
  setAmbientState: (newState: AmbientState) => void;
  setFocusLevel: (level: number | ((prev: number) => number)) => void;
}

/**
 * Creates a central Zustand store for managing global application state.
 * This modern approach is more efficient than React Context, preventing unnecessary
 * re-renders and providing a clean, centralized API for state management.
 *
 * It manages the current 'ambientState' which dictates the application's visual mood,
 * and the 'focusLevel' which controls the intensity of visual feedback.
 */
export const useAppStore = create<AppState>((set) => ({
  ambientState: 'calm',
  focusLevel: 80, // Start with a default high focus
  setAmbientState: (newState) => set({ ambientState: newState }),
  setFocusLevel: (level) => set((state) => ({
    focusLevel: typeof level === 'function' ? Math.max(0, Math.min(100, level(state.focusLevel))) : Math.max(0, Math.min(100, level)),
  })),
}));
