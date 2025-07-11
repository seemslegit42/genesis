'use client';

import { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);


  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full"
    >
      <div className={cn(
        "absolute inset-0 rounded-full bg-primary/50 blur-xl transition-opacity duration-500",
        isLoading ? "opacity-100 animate-pulse" : "opacity-0"
      )}></div>
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="BEEP..."
        rows={1}
        className="w-full resize-none pr-14 py-3 pl-6 text-lg bg-input backdrop-blur-sm border-border focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0 transition-all duration-300 focus:shadow-[0_0_25px_hsl(var(--accent)/0.7)] max-h-48 rounded-full"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary hover:bg-primary/10 disabled:opacity-50 rounded-full h-9 w-9"
        disabled={isLoading || !content.trim()}
      >
        <ArrowUp className="size-6" />
        <span className="sr-only">Send Message</span>
      </Button>
    </form>
  );
}
