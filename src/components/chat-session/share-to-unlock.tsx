import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Twitter, Linkedin } from 'lucide-react';


/**
 * Props for the ShareToUnlock component.
 * @interface ShareToUnlockProps
 */
interface ShareToUnlockProps {
  /** A boolean indicating whether the dialog is open. */
  isOpen: boolean;
  /** A callback function invoked when the dialog is closed. */
  onClose: () => void;
  /** A callback function invoked when the user "unlocks" the feature. */
  onUnlock: () => void;
}

/**
 * A modal dialog that prompts the user to share the application on social media
 * in order to unlock a feature. This is a powerful viral marketing tactic and
 * a core component of our growth engine. It transforms users into marketers
 * by offering a clear, immediate reward (feature access) for a simple action (sharing).
 * @param {ShareToUnlockProps} props The props for the component.
 * @returns {JSX.Element} The rendered dialog component.
 */
export function ShareToUnlock({ isOpen, onClose, onUnlock }: ShareToUnlockProps) {
  /**
   * Handles the share action. In a production environment, this would integrate
   * with social media APIs. For now, it instantly grants the reward to complete
   * the UI loop, providing immediate gratification which is key for user satisfaction
   * and habit formation.
   */
  const handleShare = () => {
    onUnlock();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glassmorphism p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">
            Unlock Unlimited Transcription
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-lg text-muted-foreground">
            Share BEEP: Genesis once to permanently unlock voice-to-text.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Button
            size="lg"
            variant="outline"
            className="w-full font-bold text-lg"
            onClick={handleShare}
          >
            <Twitter className="mr-2 h-5 w-5" />
            Share on X
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full font-bold text-lg"
            onClick={handleShare}
          >
            <Linkedin className="mr-2 h-5 w-5" />
            Share on LinkedIn
          </Button>
        </div>
        <DialogFooter className="sm:justify-center">
            <Button type="button" variant="link" onClick={onClose}>
                Maybe later
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
