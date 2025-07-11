'use client';
import { cn } from "@/lib/utils";

interface BottomBarProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * A mobile-only bottom bar that contains the primary interactive elements.
 * This component is a key part of the mobile-first strategy, relocating the 
 * MessageInput to an ergonomically superior position for thumb-driven interaction.
 * It appears as a floating, glassmorphic bar at the bottom of the screen, 
 * reinforcing the app's modern aesthetic while improving usability.
 * @param {BottomBarProps} props The props for the component.
 * @returns {JSX.Element} The rendered bottom bar component.
 */
export function BottomBar({ children, className }: BottomBarProps) {
    return (
        <footer className={cn(
            "sticky bottom-0 z-20 w-full p-2 md:hidden",
            className
        )}>
            <div className="glassmorphism rounded-full p-1">
                 {children}
            </div>
        </footer>
    );
}
