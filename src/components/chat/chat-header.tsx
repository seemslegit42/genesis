'use client';

import { Button } from '@/components/ui/button';
import { BeepIcon } from '@/components/icons';
import { PlusCircle } from 'lucide-react';

interface ChatHeaderProps {
  onNewChat: () => void;
}

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/50 backdrop-blur-md">
      <div className="flex items-center justify-between p-4 h-16 max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <BeepIcon className="size-8 text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
          <h1 className="text-2xl font-headline font-bold text-gray-100 tracking-wider">
            BEEP
          </h1>
        </div>
        <Button
          variant="ghost"
          className="text-accent hover:bg-accent/10 hover:text-accent drop-shadow-[0_0_8px_hsl(var(--accent))]"
          onClick={onNewChat}
        >
          <PlusCircle className="mr-2 size-5" />
          New Chat
        </Button>
      </div>
    </header>
  );
}
