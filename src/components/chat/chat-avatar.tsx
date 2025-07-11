import { cn } from '@/lib/utils';

interface ChatAvatarProps {
  role: 'user' | 'assistant';
}

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
