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
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCA0MEwzMCAwSDcwTDEwMCA0MEg3MEw0MCA0MEgwWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxwYXRoIGQ9Ik0zMy4zMzMzIDM0LjY2NjdMNDUgMjVINTVMNjYuNjY2NyAzNC42NjY3SDMzLjMzMzNaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"
              alt="ΛΞVON Logo"
              width={100}
              height={40}
              data-ai-hint="futuristic geometric logo"
              className="w-auto h-6"
           />
        </div>
      </div>
       <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent w-full" />
    </header>
  );
}
