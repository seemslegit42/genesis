
'use client';

import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { useAppStore } from '@/hooks/use-app-store';
import { TypographicStateProvider } from '@/hooks/use-typographic-state';

function AmbientController() {
  const ambientState = useAppStore((state) => state.ambientState);
  const focusLevel = useAppStore((state) => state.focusLevel);

  useEffect(() => {
    const root = document.documentElement;
    let baseIntensity = 0.2; // Calm state intensity

    if (ambientState === 'focus') {
      baseIntensity = 0.4;
    } else if (ambientState === 'recording') {
      baseIntensity = 0.6;
    }

    // Modulate intensity by focus level (e.g., at 0 focus, intensity is 50% of base; at 100 focus, it's 100%)
    const focusMultiplier = 0.5 + (focusLevel / 100) * 0.5;
    const finalIntensity = baseIntensity * focusMultiplier;

    root.style.setProperty('--aurora-intensity', String(finalIntensity));
    
    // Adjust speed based on ambient state
    if (ambientState === 'focus') {
      root.style.setProperty('--aurora-speed', '15s');
    } else if (ambientState === 'recording') {
      root.style.setProperty('--aurora-speed', '8s');
    } else { // 'calm' state
      root.style.setProperty('--aurora-speed', '30s');
    }

  }, [ambientState, focusLevel]);

  return null; // This component does not render anything
}

/**
 * A client-side component that wraps the main application content.
 * It's responsible for setting up all client-side providers and controllers,
 * such as the Toaster for notifications, the AmbientController for background
 * visual effects, and the TypographicStateProvider for dynamic font styling.
 * This separation of concerns is crucial for Next.js App Router architecture.
 * @param {Readonly<{children: React.ReactNode;}>} props The props for the component.
 * @returns {JSX.Element} The rendered provider wrapper.
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AmbientController />
      <TypographicStateProvider>
        {children}
      </TypographicStateProvider>
      <Toaster />
    </>
  );
}
