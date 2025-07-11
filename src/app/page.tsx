'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const ChatSession = dynamic(
  () => import('@/components/chat-session').then((mod) => mod.ChatSession),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-screen">
        <header className="fixed top-0 z-20 w-full glassmorphism h-[70px]">
           <div className="flex items-center justify-between p-4 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-full max-w-2xl rounded-full" />
              <Skeleton className="h-8 w-40 hidden md:block" />
           </div>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden pt-[70px]">
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="flex-1 flex items-center justify-center w-full">
               <Skeleton className="w-24 h-80" />
            </div>
            <div className="pb-8 w-full max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <Skeleton className="h-4 w-96 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                        <Skeleton className="h-16 rounded-lg" />
                        <Skeleton className="h-16 rounded-lg" />
                        <Skeleton className="h-16 rounded-lg" />
                        <Skeleton className="h-16 rounded-lg" />
                    </div>
                </div>
            </div>
          </div>
        </main>
      </div>
    ),
  }
);

/**
 * The main entry point for the BEEP: Genesis application.
 * Its primary responsibility is to render the core `ChatSession`, which
 * orchestrates the entire user experience. This modular approach ensures
 * the main page remains clean and is prepared for future logic, such as
 * gating access for different user tiers.
 * @returns {JSX.Element} The rendered chat page, the user's cognitive sanctuary.
 */
export default function ChatPage() {
  return <ChatSession />;
}
