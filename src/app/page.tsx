'use client';

import { useState, useEffect, useTransition } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';
import { InitialPrompts } from '@/components/chat/initial-prompts';
import { generateInitialPromptIdeas, getAiResponse } from '@/lib/actions';
import type { Message } from '@/lib/types';
import { nanoid } from 'nanoid';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const prompts = await generateInitialPromptIdeas();
        setInitialPrompts(prompts);
      } catch (error) {
        console.error("Failed to fetch initial prompts:", error);
      }
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
      try {
        const stream = await getAiResponse(newMessages);

        const assistantMessage: Message = {
          id: nanoid(),
          role: 'assistant',
          content: '',
        };
        setStreamingMessage(assistantMessage);

        let accumulatedContent = '';
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;
          setStreamingMessage({ ...assistantMessage, content: accumulatedContent });
        }
        
        setMessages(prev => [...prev, { ...assistantMessage, content: accumulatedContent }]);
      } catch (error) {
        console.error("Error getting AI response stream:", error);
        const errorMessage: Message = {
          id: nanoid(),
          role: 'assistant',
          content: "Sorry, I encountered an error. Please try again.",
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setStreamingMessage(null);
      }
    });
  };
  
  const handleNewChat = () => {
    setMessages([]);
    setStreamingMessage(null);
  };

  const onPromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader onNewChat={handleNewChat} />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto h-full">
          {messages.length === 0 && !streamingMessage && !isLoading ? (
            <InitialPrompts prompts={initialPrompts} onPromptClick={onPromptClick} />
          ) : (
            <MessageList messages={messages} streamingMessage={streamingMessage} />
          )}
        </div>
      </main>
      <div className="p-4 md:p-6 bg-transparent">
        <div className="max-w-4xl mx-auto">
          <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading || !!streamingMessage} />
        </div>
      </div>
    </div>
  );
}
