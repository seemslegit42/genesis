
'use client';

import type { Message, Vow } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChatAvatar } from '@/components/chat-session/chat-avatar';
import { useAppStore } from '@/hooks/use-app-store';
import { SearchResult } from '../search-result';
import { CalendarResult } from '../calendar-result';
import { SovereignsCouncil } from '../sovereigns-council';
import type { SearchResults, CalendarResult as CalendarResultType, SovereignsCouncilResult } from '@/lib/types';

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
  /** The current Vow of the user, to pass to the avatar. */
  vow: Vow | null;
}

/**
 * Parses the message content to see if it's a known rich component type.
 * @param {string} content - The content of the message.
 * @returns {any | null} The parsed object or null.
 */
function parseRichContent(content: string): any | null {
  try {
    // This is a special case. If the content is just a plain string with no JSON structure,
    // we can't parse it. Return null immediately.
    if (!content.trim().startsWith('{')) {
      return null;
    }
    
    const json = JSON.parse(content);
    // Check for a 'type' property to identify rich content
    if (json && json.type) {
      return json;
    }
    return null;
  } catch (error) {
    // It's common for regular chat messages to not be valid JSON, so we just return null.
    return null;
  }
}


/**
 * Renders a single chat message, including the avatar and the message content bubble.
 * It adapts its layout based on whether the message is from the 'user' or 'assistant',
 * creating the classic conversational flow. The 'glassmorphism' style reinforces the
 * app's premium, modern aesthetic, increasing perceived value.
 * @param {ChatMessageProps} props The props for the component.
 * @returns {JSX.Element} The rendered chat message.
 */
export function ChatMessage({ message, isFocused, isDimmed, vow }: ChatMessageProps) {
  const { role, content, id } = message;
  const { setFocusedMessageId } = useAppStore();
  const richContent = parseRichContent(content);

  const handleFocus = () => {
    // Toggle focus: if it's already focused, unfocus it. Otherwise, focus it.
    setFocusedMessageId(isFocused ? null : id);
  };
  
  const renderContent = () => {
    if (richContent) {
      switch (richContent.type) {
        case 'searchResults':
          return <SearchResult results={(richContent as SearchResults).results} />;
        case 'calendarResults':
          return <CalendarResult data={(richContent as CalendarResultType)} />;
        case 'sovereignsCouncilResult':
            return <SovereignsCouncil data={(richContent as SovereignsCouncilResult)} />;
        default:
          // Fallback for unknown rich content types
          return (
            <div className="prose prose-sm sm:prose-base prose-invert max-w-none prose-p:text-foreground/90" dangerouslySetInnerHTML={{ __html: content }} />
          );
      }
    }
    // Default to plain text rendering
    return (
       <div className="prose prose-sm sm:prose-base prose-invert max-w-none prose-p:text-foreground/90" dangerouslySetInnerHTML={{ __html: content }} />
    );
  };

  return (
    <div
      className={cn(
        'group flex items-start gap-4 transition-opacity duration-300',
        role === 'user' && 'justify-end',
        isDimmed && 'opacity-30 hover:opacity-100',
        isFocused && 'opacity-100'
      )}
      onClick={handleFocus}
    >
      {role === 'assistant' && <ChatAvatar role="assistant" vow={vow} />}
      <div
        className={cn(
          'p-4 rounded-lg max-w-sm md:max-w-lg lg:max-w-4xl break-words cursor-pointer',
          'glassmorphism',
           isFocused && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
           richContent ? 'p-0' : 'p-4' 
        )}
      >
        {renderContent()}
      </div>
      {role === 'user' && <ChatAvatar role="user" vow={vow} />}
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
export function LoadingMessage({ vow }: { vow: Vow | null }) {
  return (
    <div className="flex items-center gap-4">
      <ChatAvatar role="assistant" vow={vow} />
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
