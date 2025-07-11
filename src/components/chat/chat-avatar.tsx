import { cn } from '@/lib/utils';

/**
 * Props for the ChatAvatar component.
 * @interface
 */
interface ChatAvatarProps {
  /** The role of the entity this avatar represents, either 'user' or 'assistant'. */
  role: 'user' | 'assistant';
}

/**
 * Displays a text-based avatar for a chat participant (USER or BEEP).
 * Conforms to the "NO ICONS" rule of the design blueprint.
 * @param {ChatAvatarProps} props - The props for the component.
 * @returns {JSX.Element} The rendered avatar.
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
