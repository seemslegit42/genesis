
'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface UndoBarProps {
  isVisible: boolean;
  onUndo: () => void;
}

/**
 * A persistent, predictable safety net.
 * This component renders a slim, glowing bar at the bottom of the screen
 * that allows for instant, one-click reversal of the last significant action.
 * It appears briefly after a user sends a message, providing a window to
 * undo the action before it becomes permanent in the session.
 * @param {UndoBarProps} props The props for the component.
 * @returns {JSX.Element} The rendered undo bar component.
 */
export function UndoBar({ isVisible, onUndo }: UndoBarProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 transition-all duration-300 ease-in-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
        'pointer-events-none' // Pass clicks through the container
      )}
    >
      <div className="relative pointer-events-auto flex items-center justify-center gap-4 rounded-full glassmorphism p-2 shadow-2xl shadow-primary/20">
        <p className="text-sm text-muted-foreground">Regret your last action?</p>
        <Button variant="ghost" size="sm" onClick={onUndo} className="text-primary hover:text-primary hover:bg-primary/10">
          <RotateCcw className="mr-2 h-4 w-4" />
          Undo
        </Button>
      </div>
    </div>
  );
}
