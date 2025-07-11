'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';
import { InitialPrompts } from '@/components/chat/initial-prompts';
import { generateInitialPromptIdeas, getAiResponse } from '@/lib/actions';
import type { Message } from '@/lib/types';
import { nanoid } from 'nanoid';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    const fetchPrompts = async () => {
      const prompts = await generateInitialPromptIdeas();
      setInitialPrompts(prompts);
    };
    fetchPrompts();
  }, []);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    startTransition(async () => {
      const aiResponse = await getAiResponse(newMessages);
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: aiResponse,
      };
      setMessages(prev => [...prev, assistantMessage]);
    });
  };
  
  const handleNewChat = () => {
    setMessages([]);
  };

  const onPromptClick = (prompt: string) => {
    handleSendMessage(prompt);
    setInitialPrompts([]);
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader onNewChat={handleNewChat} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto h-full">
          {messages.length === 0 && initialPrompts.length > 0 && !isLoading ? (
            <InitialPrompts prompts={initialPrompts} onPromptClick={onPromptClick} />
          ) : (
            <MessageList messages={messages} isLoading={isLoading} />
          )}
        </div>
      </main>
      <div className="p-4 md:p-6 bg-background/0">
        <div className="max-w-4xl mx-auto">
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
