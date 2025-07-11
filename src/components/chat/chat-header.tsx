'use client';

import Image from 'next/image';

interface ChatHeaderProps {
  onNewChat: () => void;
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full bg-background/50 backdrop-blur-md">
      <div className="flex items-center justify-between p-4 h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onNewChat} title="Start New Chat">
           <Image 
              src="https://placehold.co/100x40.png/000000/FFFFFF?text=ΛΞVON"
              alt="ΛΞVON Logo"
              width={100}
              height={40}
              data-ai-hint="futuristic logo"
              className="w-auto h-6"
           />
        </div>
      </div>
       <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent w-full" />
    </header>
  );
}
