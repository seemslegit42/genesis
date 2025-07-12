
'use client';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Zap, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

interface SidecarProps {
  predictedTask: string;
  onAcceptTask: (task: string) => void;
  onClose: () => void;
}

const SidecarContent = ({ predictedTask, onAcceptTask }: { predictedTask: string; onAcceptTask: (task: string) => void; }) => (
    <div className="text-center flex flex-col items-center justify-center h-full p-4">
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
)

/**
 * The Sidecar: A Proactive Guide.
 * This component materializes when the AI predicts a user's next logical action.
 * On desktop, it's a persistent side panel. On mobile, it becomes a dismissable bottom sheet.
 * It's a non-intrusive UI element that offers a one-click path to continue a workflow,
 * embodying the principle of reducing cognitive friction.
 * @param {SidecarProps} props The props for the component.
 * @returns {JSX.Element | null} The rendered sidecar, or null if there's no task.
 */
export function Sidecar({ predictedTask, onAcceptTask, onClose }: SidecarProps) {
  const isMobile = useIsMobile();

  if (!predictedTask) {
    return null;
  }
  
  if (isMobile) {
    return (
        <Sheet open={!!predictedTask} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <SheetContent side="bottom" className="glassmorphism h-[45%] rounded-t-lg">
                <SidecarContent predictedTask={predictedTask} onAcceptTask={onAcceptTask} />
            </SheetContent>
        </Sheet>
    )
  }

  return (
    <aside
      className={cn(
        'relative hidden md:flex flex-col items-center justify-center p-4 w-64 glassmorphism border-l-2 border-primary/20 m-4 rounded-lg animate-in fade-in-50 slide-in-from-right-10 duration-500'
      )}
    >
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={onClose}>
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
      <SidecarContent predictedTask={predictedTask} onAcceptTask={onAcceptTask} />
    </aside>
  );
}
