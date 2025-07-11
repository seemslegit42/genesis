'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { ChatMessage, LoadingMessage } from './chat-message';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      {isLoading && <LoadingMessage />}
      <div ref={scrollRef} />
    </div>
  );
}
