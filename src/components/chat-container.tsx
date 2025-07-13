
'use client';

import { AuthGate } from '@/components/auth-gate';
import { ChatSession } from '@/components/chat-session';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';


/**
 * A client-side component that wraps the core application logic.
 * It handles the authentication state and conditionally renders either the
 * AuthGate (for login/signup) or the main ChatSession. This component
 * is dynamically imported to prevent server-side rendering of client-only code.
 * @returns {JSX.Element} The rendered component.
 */
export function ChatContainer() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <header className="sticky top-0 z-20 w-full glassmorphism h-[70px]">
          <div className="flex items-center justify-between h-full w-full max-w-7xl mx-auto px-4 gap-4">
            <Skeleton className="h-6 w-24" />
            <div className="flex-1 w-full min-w-0 hidden md:block max-w-2xl">
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
            <div className="hidden md:flex items-center justify-end shrink-0 w-48">
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="md:hidden">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="flex-1 flex items-center justify-center w-full">
              <Skeleton className="w-24 h-80" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AuthGate user={user}>
        <ChatSession />
      </AuthGate>
    </div>
  );
}
