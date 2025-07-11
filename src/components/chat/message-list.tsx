'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { ChatMessage, LoadingMessage } from './chat-message';

interface MessageListProps {
  messages: Message[];
  streamingMessage: Message | null;
  isAiResponding: boolean;
}

export function MessageList({ messages, streamingMessage, isAiResponding }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && (messages.length > 0 || streamingMessage)) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, streamingMessage?.content]);

  // Determine if we should show the loading indicator.
  // This is true if the last message is from the user, and we are not yet streaming a response.
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
