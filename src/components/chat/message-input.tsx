'use client';

import { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isLoading) {
      onSendMessage(content);
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full"
    >
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Message BEEP..."
        rows={1}
        className="w-full resize-none pr-14 py-3 pl-4 text-base bg-input backdrop-blur-sm border-border focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary hover:bg-primary/10 disabled:opacity-50"
        disabled={isLoading || !content.trim()}
      >
        <SendHorizonal className="size-6" />
        <span className="sr-only">Send Message</span>
      </Button>
    </form>
  );
}
