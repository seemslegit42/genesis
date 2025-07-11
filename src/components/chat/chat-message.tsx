import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChatAvatar } from '@/components/chat/chat-avatar';

/**
 * Props for the ChatMessage component.
 * @interface ChatMessageProps
 */
interface ChatMessageProps {
  /** The message object to display. */
  message: Message;
}

/**
 * Renders a single chat message, including the avatar and the message content bubble.
 * It adapts its layout based on whether the message is from the 'user' or 'assistant',
 * creating the classic conversational flow. The message bubble uses the 'glassmorphism'
 * style to appear as a floating, translucent panel.
 * @param {ChatMessageProps} props The props for the component.
 * @returns {JSX.Element} The rendered chat message.
 */
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
        <div className="prose prose-invert prose-p:leading-relaxed">
          {content}
        </div>
      </div>
      {role === 'user' && <ChatAvatar role="user" />}
    </div>
  );
}

/**
 * Displays a loading indicator to show that the AI assistant is "thinking".
 * This is shown after a user sends a message but before the AI response stream begins.
 * It provides crucial feedback that the system has received the input and is working.
 * @returns {JSX.Element} The rendered loading indicator component.
 */
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
