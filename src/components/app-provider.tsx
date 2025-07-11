
'use client';

import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { useAppStore } from '@/hooks/use-app-store';
import { TypographicStateProvider } from '@/hooks/use-typographic-state';

function AmbientController() {
  const ambientState = useAppStore((state) => state.ambientState);

  useEffect(() => {
    const root = document.documentElement;
    if (ambientState === 'focus') {
      root.style.setProperty('--aurora-intensity', '0.4');
      root.style.setProperty('--aurora-speed', '15s');
    } else if (ambientState === 'recording') {
      root.style.setProperty('--aurora-intensity', '0.6');
      root.style.setProperty('--aurora-speed', '8s');
    } else { // 'calm' state
      root.style.setProperty('--aurora-intensity', '0.2');
      root.style.setProperty('--aurora-speed', '30s');
    }
  }, [ambientState]);

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
