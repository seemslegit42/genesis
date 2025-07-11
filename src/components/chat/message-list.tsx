'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { ChatMessage, LoadingMessage } from './chat-message';

/**
 * Props for the MessageList component.
 * @interface MessageListProps
 */
interface MessageListProps {
  /** An array of completed messages in the chat. */
  messages: Message[];
  /** The message currently being streamed from the AI, or null if none. */
  streamingMessage: Message | null;
  /** A boolean indicating if the app is waiting for or receiving an AI response. */
  isAiResponding: boolean;
}

/**
 * Renders the list of chat messages, including completed messages,
 * the currently streaming message, and a loading indicator.
 * It also handles auto-scrolling to the latest message to keep the
 * conversation in view.
 * @param {MessageListProps} props The props for the component.
 * @returns {JSX.Element} The rendered list of messages.
 */
export function MessageList({ messages, streamingMessage, isAiResponding }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to the bottom of the message list as new messages are added.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, streamingMessage?.content]);

  /**
   * Determines if the loading indicator should be shown.
   * This is true if the AI is responding but has not yet started streaming content.
   */
  const showLoading = isAiResponding && !streamingMessage;

  return (
    <div className="space-y-8 pt-8">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {streamingMessage && <ChatMessage message={streamingMessage} />}
      {showLoading && <LoadingMessage />}
      <div ref={scrollRef} />
    </div>
  );
}
