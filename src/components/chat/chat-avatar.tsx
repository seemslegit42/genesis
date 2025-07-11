import { cn } from '@/lib/utils';

/**
 * Props for the ChatAvatar component.
 * @interface ChatAvatarProps
 */
interface ChatAvatarProps {
  /** 
   * The role of the entity this avatar represents. This determines the
   * styling and text of the avatar.
   * 'user' represents the human user.
   * 'assistant' represents the AI, BEEP.
   * @type {'user' | 'assistant'}
   */
  role: 'user' | 'assistant';
}

/**
 * Displays a minimalist, text-based avatar for a chat participant (USER or BEEP).
 * This component strictly adheres to the "NO ICONS" design principle, using only
 * typography to identify the speaker.
 * @param {ChatAvatarProps} props The props for the component.
 * @returns {JSX.Element} The rendered avatar component.
 */
export function ChatAvatar({ role }: ChatAvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center size-10 shrink-0'
      )}
    >
      <div
        className={cn(
          'text-xs font-bold tracking-widest',
          role === 'user' ? 'text-accent' : 'text-primary'
        )}
      >
        {role === 'user' ? 'USER' : 'BEEP'}
      </div>
    </div>
  );
}
