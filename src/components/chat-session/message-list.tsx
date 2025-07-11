'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { ChatMessage, LoadingMessage } from './chat-message';
import { Mic } from 'lucide-react';

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
  /** A boolean indicating if transcription is in progress. */
  isTranscribing: boolean;
}

/**
 * A component that visually represents the transcription process is active.
 * It provides immediate feedback to the user that their voice input is being processed,
 * which is crucial for a good user experience in voice-driven interfaces.
 * @returns {JSX.Element} The rendered transcribing message indicator.
 */
const TranscribingMessage = () => {
    return (
      <div className="flex items-center gap-3 md:gap-4 justify-end">
         <div className="p-4 rounded-lg glassmorphism">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mic className="size-4 animate-pulse" />
                <span>Transcribing...</span>
            </div>
        </div>
        <div className="flex items-center justify-center size-10 shrink-0">
            <div className="text-xs font-bold tracking-widest text-accent">
                USER
            </div>
        </div>
      </div>
    );
  }

/**
 * Renders the list of chat messages, including completed messages,
 * the currently streaming message, and loading/transcribing indicators.
 * It also handles auto-scrolling to the latest message to keep the
 * conversation in view, a critical feature for a seamless chat experience.
 * @param {MessageListProps} props The props for the component.
 * @returns {JSX.Element} The rendered list of messages.
 */
export function MessageList({ messages, streamingMessage, isAiResponding, isTranscribing }: MessageListProps) {
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
      {isTranscribing && <TranscribingMessage />}
      <div ref={scrollRef} />
    </div>
  );
}
