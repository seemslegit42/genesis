'use client';

import { useState, useEffect } from 'react';
import { Progress } from '../ui/progress';
import { Message } from '@/lib/types';
import { Logo } from '../logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

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
  /** The array of messages in the current chat. */
  messages: Message[];
  /** A boolean indicating if transcription is unlocked. */
  transcriptionUnlocked: boolean;
  /** The content to be rendered in the center of the header (e.g., the message input on desktop). */
  children?: React.ReactNode;
  /** A boolean indicating if the current view is mobile. */
  isMobile: boolean;
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
    const progress = (level % 100);

    return (
        <div className="flex items-center gap-4 text-xs text-right text-muted-foreground w-48">
            <div className="flex-grow">
                 <div className="font-bold text-foreground text-right text-lg" style={{ textShadow: '0 0 8px hsl(var(--primary)/0.7)' }}>
                    {Math.floor(level / 100)}
                </div>
                <Progress value={progress} className="h-1" />
            </div>
            <div className="font-mono text-lg text-foreground">{time}</div>
        </div>
    );
};

const MobileMenu = ({ onNewChat, messages, transcriptionUnlocked }: { onNewChat: () => void, messages: Message[], transcriptionUnlocked: boolean }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        return () => clearInterval(timer);
    }, []);
    
    const calculateRelationshipLevel = () => {
        const basePoints = messages.length * 10;
        const bonusPoints = transcriptionUnlocked ? 1000 : 0;
        return basePoints + bonusPoints;
    }
    const level = calculateRelationshipLevel();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu />
                    <span className="sr-only">Open Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glassmorphism">
                <DropdownMenuLabel>Session Info</DropdownMenuLabel>
                <div className="px-2 py-1.5 text-sm">
                   <div className="flex justify-between items-center">
                       <span>Time:</span>
                       <span className="font-mono">{time}</span>
                   </div>
                    <div className="flex justify-between items-center">
                       <span>Relationship Lvl:</span>
                       <span>{Math.floor(level / 100)}</span>
                   </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onNewChat}>New Chat</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


/**
 * The main header for the chat application, known as the "TopBar" or "Oracle's Edge."
 * It is the only persistent global UI element, holding the application logo, the
 * central BEEP™ Command Strip (MessageInput), and the Sovereignty Manifest. Its primary interactive purpose is to provide a way to
 * start a new chat session and send messages.
 * @param {ChatHeaderProps} props The props for the component.
 * @returns {JSX.Element} The rendered header component.
 */
export function ChatHeader({ onNewChat, messages, transcriptionUnlocked, children, isMobile }: ChatHeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full glassmorphism h-[70px]">
      <div className="flex items-center justify-between p-2 sm:p-4 h-full w-full mx-auto px-2 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 cursor-pointer font-headline shrink-0" onClick={onNewChat} title="Start New Chat">
           <Logo className="h-6 w-auto" />
        </div>
        
        <div className="flex-1 w-full min-w-0 max-w-2xl">
          {children}
        </div>

        <div className="hidden md:flex items-center justify-end shrink-0">
          <SovereigntyManifest messages={messages} transcriptionUnlocked={transcriptionUnlocked} />
        </div>

        {isMobile && (
           <div className="md:hidden">
                <MobileMenu onNewChat={onNewChat} messages={messages} transcriptionUnlocked={transcriptionUnlocked} />
            </div>
        )}
      </div>
    </header>
  );
}
