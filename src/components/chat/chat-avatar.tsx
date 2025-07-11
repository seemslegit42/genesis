import { cn } from '@/lib/utils';
import { BeepIcon, UserIcon } from '@/components/icons';

interface ChatAvatarProps {
  role: 'user' | 'assistant';
}

export function ChatAvatar({ role }: ChatAvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center size-8 shrink-0 rounded-full border',
        role === 'user'
          ? 'bg-accent/20 border-accent'
          : 'bg-primary/20 border-primary'
      )}
    >
      {role === 'user' ? (
        <UserIcon className="size-5 text-accent" />
      ) : (
        <BeepIcon className="size-5 text-primary" />
      )}
    </div>
  );
}
