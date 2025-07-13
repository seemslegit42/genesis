import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChatAvatar } from '@/components/chat-session/chat-avatar';
import { useAppStore } from '@/hooks/use-app-store';

/**
 * Props for the ChatMessage component.
 * @interface ChatMessageProps
 */
interface ChatMessageProps {
  /** The message object to display. */
  message: Message;
  /** A boolean indicating if this message is part of a "focus tunnel". */
  isFocused: boolean;
  /** A boolean indicating if another message is currently focused. */
  isDimmed: boolean;
}

/**
 * Renders a single chat message, including the avatar and the message content bubble.
 * It adapts its layout based on whether the message is from the 'user' or 'assistant',
 * creating the classic conversational flow. The 'glassmorphism' style reinforces the
 * app's premium, modern aesthetic, increasing perceived value.
 * @param {ChatMessageProps} props The props for the component.
 * @returns {JSX.Element} The rendered chat message.
 */
export function ChatMessage({ message, isFocused, isDimmed }: ChatMessageProps) {
  const { role, content, id } = message;
  const { setFocusedMessageId } = useAppStore();

  const handleFocus = () => {
    // Toggle focus: if it's already focused, unfocus it. Otherwise, focus it.
    setFocusedMessageId(isFocused ? null : id);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 transition-opacity duration-300',
        role === 'user' && 'justify-end',
        isDimmed && 'opacity-30 hover:opacity-100',
        isFocused && 'opacity-100'
      )}
      onClick={handleFocus}
    >
      {role === 'assistant' && <ChatAvatar role="assistant" />}
      <div
        className={cn(
          'p-4 rounded-lg max-w-sm md:max-w-lg lg:max-w-3xl break-words cursor-pointer',
          'glassmorphism',
           isFocused && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
        )}
      >
        <div className="prose prose-sm sm:prose-base prose-invert max-w-none prose-p:text-foreground/90">
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
 * It provides crucial feedback that the system has received the input and is working,
 * which manages user expectation and reduces perceived latency.
 * @returns {JSX.Element} The rendered loading indicator component.
 */
export function LoadingMessage() {
  return (
    <div className="flex items-center gap-4">
      <ChatAvatar role="assistant" />
      <div className="p-4 rounded-lg glassmorphism">
        <div className="flex items-center justify-center gap-2">
          <span className="size-2 rounded-full bg-primary/70 animate-pulse [animation-delay:-0.3s]" />
          <span className="size-2 rounded-full bg-primary/70 animate-pulse [animation-delay:-0.15s]" />
          <span className="size-2 rounded-full bg-primary/70 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
