
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
  setAmbientState: (newState: AmbientState) => void;
}

/**
 * Creates a central Zustand store for managing global application state.
 * This modern approach is more efficient than React Context, preventing unnecessary
 * re-renders and providing a clean, centralized API for state management.
 *
 * It manages the current 'ambientState' which dictates the application's visual mood.
 */
export const useAppStore = create<AppState>((set) => ({
  ambientState: 'calm',
  setAmbientState: (newState) => set({ ambientState: newState }),
}));
