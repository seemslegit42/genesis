'use client';

import { useState, useEffect, useTransition } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';
import { InitialPrompts } from '@/components/chat/initial-prompts';
import { generateInitialPromptIdeas } from '@/lib/actions';
import { getAiResponse } from '@/lib/actions';
import type { Message } from '@/lib/types';
import { nanoid } from 'nanoid';
import { Obelisk } from '@/components/obelisk';
import { Sidecar } from '@/components/sidecar';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [sidecarContent, setSidecarContent] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const {prompts} = await generateInitialPromptIdeas();
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
    setIsAiResponding(true);

    // MOCK: Trigger Sidecar for onboarding task
    if (content.toLowerCase().includes('onboard')) {
      setSidecarContent(
        <div>
          <h3 className="font-headline text-lg text-primary mb-2">Onboard New Client</h3>
          <p className="text-sm text-muted-foreground">Step 1: Create CRM Entry</p>
          <p className="mt-4 text-sm">Please provide the client's full name and email address.</p>
        </div>
      );
    } else if (content.toLowerCase().includes('complete')) {
        setSidecarContent(null);
    }


    const processStream = async () => {
      try {
        const stream = await getAiResponse(newMessages);
        if (!stream) {
            const errorMessage: Message = {
                id: nanoid(),
                role: 'assistant',
                content: "Sorry, I couldn't get a response. Please check the connection and try again.",
            };
            setMessages(prev => [...prev, errorMessage]);
            setStreamingMessage(null);
            setIsAiResponding(false);
            return;
        }


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
        setIsAiResponding(false);
      }
    };
    
    processStream();
  };
  
  const handleNewChat = () => {
    setMessages([]);
    setStreamingMessage(null);
    setSidecarContent(null);
  };

  const onPromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const showObelisk = messages.length === 0 && !streamingMessage && !isAiResponding;

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader onNewChat={handleNewChat} />

      <div className="sticky top-16 z-10 w-full bg-transparent p-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <MessageInput onSendMessage={handleSendMessage} isLoading={isAiResponding} />
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden px-4 md:px-6">
        <div className="flex-1 flex flex-col items-center">
            <div className="max-w-4xl w-full mx-auto flex-1 overflow-y-auto">
              {showObelisk ? (
                 <Obelisk />
              ) : (
                <MessageList messages={messages} streamingMessage={streamingMessage} />
              )}
            </div>
            {showObelisk && (
              <div className="pb-8 w-full">
                <InitialPrompts prompts={initialPrompts} onPromptClick={onPromptClick} />
              </div>
            )}
        </div>

        {sidecarContent && <Sidecar>{sidecarContent}</Sidecar>}
      </main>
    </div>
  );
}
