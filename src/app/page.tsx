'use client';

import { useState, useEffect } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { MessageList } from '@/components/chat/message-list';
import { MessageInput } from '@/components/chat/message-input';
import { InitialPrompts } from '@/components/chat/initial-prompts';
import { generateInitialPromptIdeas, summarizeChatHistory } from '@/lib/actions';
import { getAiResponse } from '@/lib/actions';
import type { Message } from '@/lib/types';
import { Obelisk } from '@/components/obelisk';
import { Sidecar } from '@/components/sidecar';

/**
 * The main chat page component for the BEEP: Genesis application.
 * It orchestrates the entire chat experience, managing message state,
 * AI interactions, and the display of core UI elements like the Obelisk and Sidecar.
 * @returns {JSX.Element} The rendered chat page.
 */
export default function ChatPage() {
  /**
   * State for storing the list of messages in the current chat session.
   * @type {[Message[], React.Dispatch<React.SetStateAction<Message[]>>]}
   */
  const [messages, setMessages] = useState<Message[]>([]);

  /**
   * State for storing the message currently being streamed from the AI.
   * @type {[Message | null, React.Dispatch<React.SetStateAction<Message | null>>]}
   */
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);

  /**
   * State for storing the initial prompt suggestions for the user.
   * @type {[string[], React.Dispatch<React.SetStateAction<string[]>>]}
   */
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);

  /**
   * State to track whether the AI is currently generating a response.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isAiResponding, setIsAiResponding] = useState(false);

  /**
   * State for the content to be displayed in the Sidecar component.
   * Null if the sidecar should be hidden.
   * @type {[React.ReactNode | null, React.Dispatch<React.SetStateAction<React.ReactNode | null>>]}
   */
  const [sidecarContent, setSidecarContent] = useState<React.ReactNode | null>(null);
  
  /**
   * State for storing the summary of the chat history, displayed by the Obelisk.
   * @type {[string | null, React.Dispatch<React.SetStateAction<string | null>>]}
   */
  const [obeliskSummary, setObeliskSummary] = useState<string | null>(null);
  
  /**
   * State to track if the chat history is currently being summarized.
   * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
   */
  const [isSummarizing, setIsSummarizing] = useState(false);


  useEffect(() => {
    /**
     * Fetches the initial prompt ideas when the component mounts.
     */
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
   * Handles sending a new message from the user.
   * It adds the user's message to the state and triggers the AI response stream.
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
    setObeliskSummary(null); // Clear summary on new message

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

    /**
     * Processes the streaming response from the AI.
     */
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
   * Resets the chat state to start a new conversation.
   */
  const handleNewChat = () => {
    setMessages([]);
    setStreamingMessage(null);
    setSidecarContent(null);
    setObeliskSummary(null);
  };

  /**
   * Handles the click event on an initial prompt suggestion.
   * @param {string} prompt The text of the clicked prompt.
   */
  const onPromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };
  
  /**
   * Handles the click event on the Obelisk.
   * Toggles the display of the chat summary. If no summary is present,
   * it calls the summarization flow to generate one.
   */
  const handleObeliskClick = async () => {
    if (isSummarizing || messages.length === 0) return;
    
    if (obeliskSummary) {
        setObeliskSummary(null);
        return;
    }

    setIsSummarizing(true);
    try {
        const chatHistory = messages.map(m => `${m.role}: ${m.content}`).join('\n');
        const { summary } = await summarizeChatHistory({ chatHistory });
        setObeliskSummary(summary);
    } catch (error) {
        console.error("Failed to summarize chat history:", error);
        setObeliskSummary("Could not retrieve summary.");
    } finally {
        setIsSummarizing(false);
    }
  };

  /**
   * Determines whether to show the Obelisk and initial prompts.
   * This is true only when the chat is empty.
   * @type {boolean}
   */
  const showObelisk = messages.length === 0 && !streamingMessage;

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
                 <Obelisk onClick={handleObeliskClick} summary={obeliskSummary} isLoading={isSummarizing} isInteractive={messages.length > 0} />
              ) : (
                <MessageList messages={messages} streamingMessage={streamingMessage} isAiResponding={isAiResponding}/>
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
