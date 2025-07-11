'use client';

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';

/**
 * Props for the MessageInput component.
 * @interface MessageInputProps
 */
interface MessageInputProps {
  /** A callback function invoked when the user sends a message. */
  onSendMessage: (content: string) => void;
  /** A boolean indicating if the AI is currently processing a message, which disables the input. */
  isLoading: boolean;
}

/**
 * A controlled component for the user to type and send chat messages.
 * It serves as the "Central BEEP™ Command Strip," the primary interactive element
 * for communicating with the AI. It features a subtle pulsating glow when active
 * and supports send-on-enter functionality.
 * @param {MessageInputProps} props The props for the component.
 * @returns {JSX.Element} The rendered message input form.
 */
export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Handles the form submission event.
   * @param {React.FormEvent} e The form event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isLoading) {
      onSendMessage(content);
      setContent('');
    }
  };

  /**
   * Handles keydown events on the textarea for send-on-enter functionality.
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} e The keyboard event.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };
  
  // Effect to auto-resize the textarea based on its content.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // A little extra height to prevent scrollbar from flashing
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  }, [content]);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full"
    >
      <div 
        className={cn(
          "absolute inset-x-0 top-1/2 h-full -translate-y-1/2 rounded-full bg-gradient-to-r from-accent/50 via-primary/50 to-accent/50 blur-2xl transition-opacity duration-1000",
          !isLoading && content ? "opacity-50 animate-pulse" : "opacity-0"
        )}
      ></div>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="BEEP..."
        rows={1}
        className="w-full resize-none pr-12 py-3 pl-6 text-base bg-input backdrop-blur-sm border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-all duration-300 focus:shadow-[0_0_35px_hsl(var(--ring)/0.5)] max-h-48 rounded-full font-body"
        disabled={isLoading}
      />
       <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-primary hover:text-primary hover:bg-primary/10 disabled:opacity-50 rounded-full h-9 w-9"
        disabled={isLoading || !content.trim()}
      >
        <ArrowUp className="size-5" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
}
