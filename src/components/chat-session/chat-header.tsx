'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageInput } from '@/components/chat-session/message-input';
import { Progress } from '../ui/progress';
import { Message } from '@/lib/types';

/**
 * Props for the ChatHeader component.
 * @interface ChatHeaderProps
 */
interface ChatHeaderProps {
  /** 
   * A callback function to be invoked when the user initiates a new chat.
   * This typically happens when the user clicks the logo. Provides a clear
   * reset mechanism for the user's workflow.
   */
  onNewChat: () => void;
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
  /** The array of messages in the current chat. */
  messages: Message[];
  /** A boolean indicating if transcription is unlocked. */
  transcriptionUnlocked: boolean;
}

/**
 * Displays user status and session information.
 * This is the Sovereignty Manifest, a real-time display of the Initiate's standing
 * within the Genesis ecosystem. It currently shows a mock currency balance (Ξ) and
 * session status to establish the visual language for a future in-app economy
 * and robust identity system, key components for a profit-driven architecture.
 * @returns {JSX.Element} The rendered component.
 */
const SovereigntyManifest = ({ messages, transcriptionUnlocked }: { messages: Message[], transcriptionUnlocked: boolean }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);

        // Set initial time
        setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        return () => clearInterval(timer);
    }, []);

    const calculateRelationshipLevel = () => {
        const basePoints = messages.length * 10;
        const bonusPoints = transcriptionUnlocked ? 1000 : 0;
        return basePoints + bonusPoints;
    }

    const level = calculateRelationshipLevel();
    const pointsForNextLevel = Math.floor(level / 100 + 1) * 100;
    const progress = (level % 100);

    return (
        <div className="flex items-center gap-4 text-xs text-right text-muted-foreground w-48">
            <div className="flex-grow">
                 <div className="font-bold text-foreground text-right" style={{ textShadow: '0 0 8px hsl(var(--primary)/0.7)' }}>
                    LVL: {Math.floor(level / 100)}
                </div>
                <Progress value={progress} className="h-1 bg-primary/20" />
            </div>
            <div className="font-mono text-lg text-foreground">{time}</div>
        </div>
    );
};


/**
 * The main header for the chat application, known as the "TopBar" or "Oracle's Edge."
 * It is the only persistent global UI element, holding the application logo, the
 * central BEEP™ Command Strip (MessageInput), and the Sovereignty Manifest. Its primary interactive purpose is to provide a way to
 * start a new chat session and send messages.
 * @param {ChatHeaderProps} props The props for the component.
 * @returns {JSX.Element} The rendered header component.
 */
export function ChatHeader({ onNewChat, onSendMessage, isLoading, isRecording, startRecording, stopRecording, messages, transcriptionUnlocked }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full glassmorphism h-[70px]">
      <div className="flex items-center justify-between p-4 h-full w-full mx-auto px-4 sm:px-6 lg:px-8 gap-4">
        <div className="flex items-center gap-2 cursor-pointer font-headline shrink-0" onClick={onNewChat} title="Start New Chat">
           <Image 
              src="/icons/logo.svg"
              alt="BEEP Logo"
              width={100}
              height={40}
              data-ai-hint="futuristic geometric logo"
              className="w-auto h-6"
           />
        </div>
        <div className="flex-1 w-full min-w-0 max-w-2xl">
          <MessageInput 
            onSendMessage={onSendMessage} 
            isLoading={isLoading}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
        </div>
        <div className="hidden md:flex items-center justify-end shrink-0">
          <SovereigntyManifest messages={messages} transcriptionUnlocked={transcriptionUnlocked} />
        </div>
      </div>
    </header>
  );
}
