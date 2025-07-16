
'use client';

import { ChatMessage, LoadingMessage } from '@/components/chat-session/chat-message';
import type { Message } from '@/lib/types';
import { useAppStore } from '@/hooks/use-app-store';

interface MessageListProps {
  messages: Message[];
  isAiResponding: boolean;
  focusedMessageId: string | null;
}

/**
 * Renders a list of chat messages.
 * It maps over the messages array and displays them using the ChatMessage component.
 * It also shows a loading indicator when the AI is responding.
 * This component is crucial for displaying the conversational history to the user.
 * @param {MessageListProps} props The props for the component.
 * @returns {JSX.Element} The rendered list of messages.
 */
export function MessageList({ messages, isAiResponding, focusedMessageId }: MessageListProps) {
  const isFocusMode = !!focusedMessageId;

  return (
    <div className="flex flex-col gap-6 py-8">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isFocused={focusedMessageId === message.id}
          isDimmed={isFocusMode && focusedMessageId !== message.id}
        />
      ))}
      {isAiResponding && <LoadingMessage />}
    </div>
  );
}
