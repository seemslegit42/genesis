import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChatAvatar } from '@/components/chat/chat-avatar';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { role, content } = message;
  return (
    <div
      className={cn(
        'flex items-start gap-3 md:gap-4',
        role === 'user' && 'justify-end'
      )}
    >
      {role === 'assistant' && <ChatAvatar role="assistant" />}
      <div
        className={cn(
          'p-4 rounded-lg max-w-xs md:max-w-md lg:max-w-2xl break-words',
          'glassmorphism'
        )}
      >
        <p>{content}</p>
      </div>
      {role === 'user' && <ChatAvatar role="user" />}
    </div>
  );
}

export function LoadingMessage() {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <ChatAvatar role="assistant" />
      <div className="p-4 rounded-lg glassmorphism">
        <div className="flex items-center justify-center gap-1.5">
          <span className="size-2 rounded-full bg-primary/70 animate-pulse [animation-delay:-0.3s]" />
          <span className="size-2 rounded-full bg-primary/70 animate-pulse [animation-delay:-0.15s]" />
          <span className="size-2 rounded-full bg-primary/70 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
