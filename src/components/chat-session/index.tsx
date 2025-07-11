'use client';

import { useState, useEffect, useRef } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { ChatHeader } from '@/components/chat-session/chat-header';
import { MessageList } from '@/components/chat-session/message-list';
import { InitialPrompts } from '@/components/chat-session/initial-prompts';
import { generateInitialPromptIdeas, getAiResponse, textToSpeech, speechToText } from '@/lib/actions';
import type { Message } from '@/lib/types';
import { Obelisk } from '@/components/obelisk';
import { Progress } from '@/components/ui/progress';
import { ShareToUnlock } from './share-to-unlock';

export function ChatSession() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [transcriptionUnlocked, setTranscriptionUnlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    video: false,
    audio: true,
  });

  useEffect(() => {
    if (mediaBlobUrl) {
      transcribeRecording(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  const transcribeRecording = async (blobUrl: string) => {
    if (!transcriptionUnlocked) {
      setShowShareModal(true);
      return;
    }
    
    setIsTranscribing(true);
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const { text } = await speechToText({ audioDataUri: base64Audio });
        if (text) {
          handleSendMessage(text);
        } else {
            console.error('Transcription failed to return text.');
        }
        setIsTranscribing(false);
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setIsTranscribing(false);
    }
  };


  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const { prompts } = await generateInitialPromptIdeas();
        setInitialPrompts(prompts);
      } catch (error) {
        console.error("Failed to fetch initial prompts:", error);
      }
    };
    fetchPrompts();
  }, []);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsAiResponding(true);

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
      
      // Once text is fully received, generate and play audio
      const { audioDataUri } = await textToSpeech({ text: accumulatedContent });
      if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.play();
      }

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

  const handleNewChat = () => {
    setMessages([]);
    setStreamingMessage(null);
  };

  const onPromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };
  
  const handleUnlock = () => {
    setTranscriptionUnlocked(true);
    setShowShareModal(false);
  };

  const showInitialState = messages.length === 0 && !isAiResponding && !streamingMessage;

  return (
    <div className="flex flex-col h-screen">
       <ShareToUnlock 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onUnlock={handleUnlock}
      />
      <ChatHeader 
        onNewChat={handleNewChat} 
        onSendMessage={handleSendMessage} 
        isLoading={isAiResponding || isTranscribing}
        isRecording={status === 'recording'}
        startRecording={startRecording}
        stopRecording={stopRecording}
      />
      <Progress value={isAiResponding ? 100 : 0} className="h-[2px] w-full bg-transparent transition-all duration-1000 fixed top-[68px] z-20" />
      
      <main className="flex-1 flex flex-col overflow-hidden pt-[70px]">
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
              <MessageList messages={messages} streamingMessage={streamingMessage} isAiResponding={isAiResponding} isTranscribing={isTranscribing} />
            </div>
          )}
        </div>
      </main>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
