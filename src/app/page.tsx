'use client';

import { useState, useEffect } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageList } from '@/components/chat/message-list';
import { InitialPrompts } from '@/components/chat/initial-prompts';
import { generateInitialPromptIdeas } from '@/lib/actions';
import { getAiResponse } from '@/lib/actions';
import type { Message } from '@/lib/types';
import { Obelisk } from '@/components/obelisk';

/**
 * The main chat page component for the BEEP: Genesis application.
 * It orchestrates the entire chat experience, managing message state,
 * AI interactions, and the display of core UI elements.
 * This component serves as the "Canvas" where the user's dialogue with BEEP unfolds.
 * @returns {JSX.Element} The rendered chat page, the user's cognitive sanctuary.
 */
export default function ChatPage() {
  /**
   * State for storing the list of messages in the current chat session.
   * This represents the ongoing dialogue between the user and BEEP.
   * @type {[Message[], React.Dispatch<React.SetStateAction<Message[]>>]}
   */
  const [messages, setMessages] = useState<Message[]>([]);

  /**
   * State for storing the message currently being streamed from the AI.
   * This allows for a real-time, "typing" effect as BEEP formulates a response.
   * @type {[Message | null, React.Dispatch<React.SetStateAction<Message | null>>]}
   */
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);

  /**
   * State for storing the initial prompt suggestions, which help guide the user
   * when they first enter the sanctuary.
   * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]}
   */
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);

  /**
   * State to track whether the AI is currently generating a response. This is used
   * to disable the input field and show loading indicators.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isAiResponding, setIsAiResponding] = useState(false);
  
  // Fetches initial prompt ideas when the component first mounts.
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

  /**
   * Sends a new message from the user to the chat, adding it to the message
   * list and triggering the AI response stream.
   * @param {string} content The text content of the message to send.
   */
  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsAiResponding(true);

    // Processes the streaming response from the AI.
    const processStream = async () => {
      try {
        const stream = await getAiResponse(newMessages);
        if (!stream) {
            const errorMessage: Message = {
                id: String(Date.now() + 1),
                role: 'assistant',
                content: "Sorry, I couldn't get a response. Please check the connection and try again.",
            };
            setMessages(prev => [...prev, errorMessage]);
            setStreamingMessage(null);
            setIsAiResponding(false);
            return;
        }

        const assistantMessage: Message = {
          id: String(Date.now() + 1),
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
          id: String(Date.now() + 1),
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
  
  /**
   * Resets the chat state to start a new conversation, clearing the Canvas.
   */
  const handleNewChat = () => {
    setMessages([]);
    setStreamingMessage(null);
  };

  /**
   * Handles the click event on an initial prompt suggestion, sending the
   * prompt as a new message.
   * @param {string} prompt The text of the clicked prompt.
   */
  const onPromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };
  
  /**
   * Determines whether to show the initial state (Obelisk and prompts)
   * or the active chat view.
   * @type {boolean}
   */
  const showInitialState = messages.length === 0 && !isAiResponding && !streamingMessage;

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader onNewChat={handleNewChat} onSendMessage={handleSendMessage} isLoading={isAiResponding} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {showInitialState ? (
             <div className="flex flex-col items-center justify-center h-full p-4">
                <div className="flex-1 flex items-center justify-center w-full">
                  <Obelisk />
                </div>
                <div className="pb-8 w-full max-w-4xl mx-auto">
                    <InitialPrompts prompts={initialPrompts} onPromptClick={onPromptClick} />
                </div>
             </div>
          ) : (
            <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <MessageList messages={messages} streamingMessage={streamingMessage} isAiResponding={isAiResponding}/>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
