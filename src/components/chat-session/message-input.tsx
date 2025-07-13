
'use client';

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTypographicState } from '@/hooks/use-typographic-state';
import { SendSigil, MicSigil, StopSigil } from '../aetheric-sigils';

/**
 * Props for the MessageInput component.
 * @interface MessageInputProps
 */
interface MessageInputProps {
  /** A callback function invoked when the user sends a message. */
  onSendMessage: (content: string) => void;
  /** A boolean indicating if the AI is currently processing a message, which disables the input. */
  isLoading: boolean;
  /** A boolean indicating if audio is currently being recorded. */
  isRecording: boolean;
  /** A callback function to start audio recording. */
  startRecording: () => void;
  /** A callback function to stop audio recording. */
  stopRecording: () => void;
}

/**
 * A controlled component for the user to type and send chat messages, or to initiate voice input.
 * It serves as the "Central BEEP™ Command Strip," the primary interactive element
 * for communicating with the AI. It features a subtle pulsating glow when active
 * and supports send-on-enter functionality, creating a fluid and responsive user experience.
 * @param {MessageInputProps} props The props for the component.
 * @returns {JSX.Element} The rendered message input form.
 */
export function MessageInput({ onSendMessage, isLoading, isRecording, startRecording, stopRecording }: MessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { applyState } = useTypographicState();

  /**
   * Handles the form submission event, sending the message content.
   * @param {React.FormEvent} e The form event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isLoading) {
      onSendMessage(content);
      setContent('');
      applyState('default');
    }
  };

  /**
   * Handles keydown events on the textarea for send-on-enter functionality,
   * a common UX pattern that improves chat efficiency.
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} e The keyboard event.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };
  
  // Effect to auto-resize the textarea based on its content, preventing scrollbars
  // in a single-line input and gracefully expanding for multi-line messages.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // The +2 is a small buffer to prevent the scrollbar from appearing on some browsers.
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
          (!isLoading && content) || isRecording ? "opacity-50 animate-pulse" : "opacity-0"
        )}
      ></div>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => applyState('active')}
        onBlur={() => applyState('default')}
        placeholder={isRecording ? "Listening..." : "BEEP..."}
        rows={1}
        className="w-full resize-none pr-24 py-3 pl-6 text-base bg-input/50 backdrop-blur-sm border-border/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-all duration-300 focus:shadow-[0_0_35px_hsl(var(--ring)/0.5)] max-h-48 rounded-full font-body"
        disabled={isLoading || isRecording}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "destructive" : "ghost"}
          onClick={isRecording ? stopRecording : startRecording}
          className="text-primary hover:text-primary disabled:opacity-50 rounded-full h-10 w-10"
          disabled={isLoading}
        >
          {isRecording ? <StopSigil isActive /> : <MicSigil isActive={isRecording} />}
          <span className="sr-only">{isRecording ? "Stop Recording" : "Start Recording"}</span>
        </Button>
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="text-primary hover:text-primary hover:bg-primary/10 disabled:opacity-50 rounded-full h-10 w-10"
          disabled={isLoading || !content.trim() || isRecording}
        >
          <SendSigil isActive={!!content.trim()} />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
}
