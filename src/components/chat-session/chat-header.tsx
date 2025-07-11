'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageInput } from '@/components/chat-session/message-input';

/**
 * Props for the ChatHeader component.
 * @interface ChatHeaderProps
 */
interface ChatHeaderProps {
  /** 
   * A callback function to be invoked when the user initiates a new chat.
   * This typically happens when the user clicks the logo.
   */
  onNewChat: () => void;
  /** A callback function invoked when the user sends a message. */
  onSendMessage: (content: string) => void;
  /** A boolean indicating if the AI is currently processing a message, which disables the input. */
  isLoading: boolean;
}

const SovereigntyManifest = () => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);

        // Set initial time
        setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-4 text-xs text-right text-muted-foreground">
            <div className="flex flex-col items-end">
                <div className="font-bold text-foreground" style={{ textShadow: '0 0 8px hsl(var(--primary)/0.7)' }}>
                    1,337.42 Ξ
                </div>
                <div className='hidden sm:block'>Admin User | Session: Active</div>
            </div>
            <div className="font-mono text-lg text-foreground">{time}</div>
        </div>
    );
};


/**
 * The main header for the chat application, known as the "TopBar" or "Oracle's Edge."
 * It is the only persistent global UI element, holding the application logo and the
 * central BEEP™ Command Strip. Its primary interactive purpose is to provide a way to
 * start a new chat session and send messages.
 * @param {ChatHeaderProps} props The props for the component.
 * @returns {JSX.Element} The rendered header component.
 */
export function ChatHeader({ onNewChat, onSendMessage, isLoading }: ChatHeaderProps) {
  return (
    <header className="fixed top-0 z-20 w-full glassmorphism h-[70px]">
      <div className="flex items-center justify-between p-4 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-4">
        <div className="flex items-center gap-2 cursor-pointer font-headline shrink-0" onClick={onNewChat} title="Start New Chat">
           <Image 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCA0MEwzMCAwSDcwTDEwMCA0MEg3MEw0MCA0MEgwWiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+CjxwYXRoIGQ9Ik0zMy4zMzMzIDM0LjY2NjdMNDUgMjVINTVMNjYuNjY2NyAzNC42NjY3SDMzLjMzMzNaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"
              alt="ΛΞVON Logo"
              width={100}
              height={40}
              data-ai-hint="futuristic geometric logo"
              className="w-auto h-6"
           />
        </div>
        <div className="flex-1 w-full min-w-0 max-w-2xl">
          <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
        <div className="hidden md:flex items-center justify-end shrink-0">
          <SovereigntyManifest />
        </div>
      </div>
    </header>
  );
}
