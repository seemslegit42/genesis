'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ChatHeaderProps {
  onNewChat: () => void;
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/50 backdrop-blur-md">
      <div className="flex items-center justify-between p-4 h-16 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          {/* Placeholder for ΛΞVON Logo */}
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="font-bold text-lg text-gray-400">ΛΞ</span>
          </div>
          <h1 className="text-2xl font-headline font-bold text-gray-100 tracking-wider">
            BEEP
          </h1>
        </div>
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={onNewChat}
        >
          New Chat
        </Button>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent w-full" />
    </header>
  );
}
