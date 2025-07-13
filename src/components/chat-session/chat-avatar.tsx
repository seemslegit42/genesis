import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Beep3DAvatar } from '../beep-3d-avatar';

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
  /** 
   * Optional path to a custom SVG icon for the avatar.
   * If provided, this will be rendered instead of the text identifier.
   * @type {string}
   * @example "/icons/user-sigil.svg"
   */
  icon?: string;
}

/**
 * Displays an avatar for a chat participant.
 * It can render a custom SVG icon if provided, otherwise it defaults to a
 * minimalist, text-based identifier (USER) or the dynamic Beep3DAvatar for the AI.
 * @param {ChatAvatarProps} props The props for the component.
 * @returns {JSX.Element} The rendered avatar component.
 */
export function ChatAvatar({ role, icon }: ChatAvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center size-10 shrink-0'
      )}
    >
      {role === 'assistant' ? (
        <Beep3DAvatar />
      ) : icon ? (
        <Image src={icon} alt={`${role} avatar`} width={24} height={24} className="opacity-80" />
      ) : (
        <div
          className={cn(
            'text-xs font-bold tracking-widest',
            'text-accent'
          )}
        >
          USER
        </div>
      )}
    </div>
  );
}
