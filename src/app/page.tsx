
'use client';

import { ChatSession } from '@/components/chat-session';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const DynamicChatSession = dynamic(
    () => import('@/components/chat-session').then((mod) => mod.ChatSession),
    { 
        ssr: false,
        loading: () => (
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
        )
    }
);


/**
 * The main entry point for BEEP: Genesis, the portal to the Initiate's Journey.
 * It establishes the core layout centered around the ChatSession, which houses the Obelisk
 * and the entire interactive experience. This structure embodies the "Cognitive Sanctuary"
 * principle by focusing the Initiate's attention on a single, powerful interface.
 * @returns {JSX.Element} The rendered chat page, the Initiate's cognitive sanctuary.
 */
export default function ChatPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DynamicChatSession />
    </div>
  );
}
