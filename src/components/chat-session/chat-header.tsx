
'use client';

import { useState, useEffect } from 'react';
import { Progress } from '../ui/progress';
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
import { Menu, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import { useAppStore } from '@/hooks/use-app-store';

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
  /** The content to be rendered in the center of the header (e.g., the message input on desktop). */
  children?: React.ReactNode;
}

/**
 * Displays user status and session information.
 * This is the Sovereignty Manifest, a real-time display of the Initiate's standing
 * within the Genesis ecosystem. It currently shows a mock currency balance (Ξ) and
 * session status to establish the visual language for a future in-app economy
 * and robust identity system, key components for a profit-driven architecture.
 * @returns {JSX.Element} The rendered component.
 */
const SovereigntyManifest = () => {
    const [time, setTime] = useState('');
    const focusLevel = useAppStore((state) => state.focusLevel);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);

        // Set initial time
        setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-4 text-xs w-48">
            <div className="flex-grow">
                 <div className="font-bold text-foreground text-right text-lg" style={{ textShadow: '0 0 8px hsl(var(--primary)/0.7)' }}>
                    FOCUS
                </div>
                <Progress value={focusLevel} className="h-1" />
            </div>
            <div className="font-mono text-lg text-muted-foreground">{time}</div>
        </div>
    );
};

const MobileMenu = ({ onNewChat }: { onNewChat: () => void }) => {
    const { signOut } = useAuth();
    const [time, setTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        return () => clearInterval(timer);
    }, []);

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
                       <span>Status:</span>
                       <span>Connected</span>
                   </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onNewChat}>New Chat</DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
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
export function ChatHeader({ onNewChat, children }: ChatHeaderProps) {
  const isMobile = useIsMobile();
  return (
    <header className="sticky top-0 z-20 w-full glassmorphism h-[70px]">
      <div className="flex items-center justify-between h-full w-full max-w-7xl mx-auto px-4 gap-4">
        <div className="flex items-center gap-2 cursor-pointer font-headline shrink-0" onClick={onNewChat} title="Start New Chat">
           <Logo className="h-6 w-auto" />
        </div>

        <div className="flex-1 w-full min-w-0 hidden md:block max-w-2xl">
          {children}
        </div>

        <div className="hidden md:flex items-center justify-end shrink-0">
          <SovereigntyManifest />
        </div>

        {isMobile && (
           <div className="md:hidden">
                <MobileMenu onNewChat={onNewChat} />
            </div>
        )}
      </div>
    </header>
  );
}
