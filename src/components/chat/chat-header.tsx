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
           <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
             <span className="font-bold text-lg text-gray-400">ΛΞ</span>
           </div>
        </div>
      </div>
       <div className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent w-full" />
    </header>
  );
}
