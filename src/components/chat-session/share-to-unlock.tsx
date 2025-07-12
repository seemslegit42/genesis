import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Twitter = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-3.3 1.4-6.7 1.4-6.7-1.4 0-5.6 5.6-5.6 5.6-3.3 0-3.3-1.4-3.3-1.4-1.4 0-2.1.7-2.1.7-1.4.7-2.8 1.4-2.8 1.4-2.8 0-5.6-2.1-5.6-2.1L.8 12.1c0 0 2.1-2.1 3.5-2.1S6 12.1 6 12.1s3.3-2.1 4.2-2.1c.9 0 2.1 2.1 2.1 2.1L15 14.2s-2.1 2.8-4.2 2.8c-2.1 0-4.2-1.4-4.2-1.4" />
    </svg>
)

const Linkedin = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
)


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
      <DialogContent className="sm:max-w-md glassmorphism">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">
            Unlock Unlimited Transcription
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-lg text-muted-foreground">
            Share BEEP: Genesis once to permanently unlock voice-to-text.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-6">
          <Button
            size="lg"
            variant="outline"
            className="w-full font-bold text-lg"
            onClick={handleShare}
          >
            <Twitter />
            Share on X
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full font-bold text-lg"
            onClick={handleShare}
          >
            <Linkedin />
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
