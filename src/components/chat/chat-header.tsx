'use client';

import Image from 'next/image';
import { MessageInput } from '@/components/chat/message-input';
import { Progress } from '@/components/ui/progress';

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
    <header className="sticky top-0 z-20 w-full bg-background/50 backdrop-blur-md">
      <div className="flex items-center p-4 h-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 gap-4">
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
        <div className="flex-1 w-full min-w-0">
          <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
      </div>
       <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent w-full" />
       <Progress value={isLoading ? 100 : 0} className="h-[2px] w-full bg-transparent transition-all duration-1000" />
    </header>
  );
}
