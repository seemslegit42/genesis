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

interface ShareToUnlockProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export function ShareToUnlock({ isOpen, onClose, onUnlock }: ShareToUnlockProps) {
  // This is the ADHD-friendly dopamine trigger. A simple, one-time action for a permanent reward.
  const handleShare = () => {
    // In a real app, this would trigger the respective share APIs.
    // For now, we instantly grant the reward to complete the UI loop.
    // This makes the user feel powerful and smart for "gaming" the system.
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
          {/* Tactic: Social Proof & Viral Loop. We turn users into marketers. */}
          <Button
            size="lg"
            className="w-full font-bold text-lg"
            onClick={handleShare}
          >
            <Twitter className="mr-2" />
            Share on X
          </Button>
          <Button
            size="lg"
            className="w-full font-bold text-lg"
            onClick={handleShare}
          >
            <Linkedin className="mr-2" />
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
