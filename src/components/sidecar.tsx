'use client';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface SidecarProps {
  predictedTask: string;
  onAcceptTask: (task: string) => void;
}

/**
 * The Sidecar: A Proactive Guide.
 * This component materializes when the AI predicts a user's next logical action.
 * It's a non-intrusive UI element that offers a one-click path to continue a workflow,
 * embodying the principle of reducing cognitive friction.
 * @param {SidecarProps} props The props for the component.
 * @returns {JSX.Element | null} The rendered sidecar, or null if there's no task.
 */
export function Sidecar({ predictedTask, onAcceptTask }: SidecarProps) {
  if (!predictedTask) {
    return null;
  }

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col items-center justify-center p-4 w-64 glassmorphism border-l-2 border-primary/20 m-4 rounded-lg animate-in fade-in-50 slide-in-from-right-10 duration-500'
      )}
    >
      <div className="text-center">
        <Zap className="mx-auto h-8 w-8 text-primary/80 mb-4" />
        <h3 className="font-headline text-lg text-primary mb-2">Next Step</h3>
        <p className="text-muted-foreground mb-6 text-sm">BEEP has predicted your next action.</p>
        <Button
          onClick={() => onAcceptTask(predictedTask)}
          className="w-full transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg"
        >
          {predictedTask}
        </Button>
      </div>
    </aside>
  );
}
