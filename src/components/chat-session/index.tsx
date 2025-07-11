'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { ChatHeader } from '@/components/chat-session/chat-header';
import { MessageList } from '@/components/chat-session/message-list';
import { InitialPrompts } from '@/components/chat-session/initial-prompts';
import { generateInitialPromptIdeas, getAiResponse, textToSpeech, speechToText } from '@/lib/actions';
import { getChatHistory, saveChatHistory } from '@/lib/services/chat';
import { useAuth } from '@/hooks/use-auth';
import type { Message, Vow } from '@/lib/types';
import { Obelisk } from '@/components/obelisk';
import { Progress } from '@/components/ui/progress';
import { ShareToUnlock } from './share-to-unlock';
import { Skeleton } from '@/components/ui/skeleton';
import { RiteOfInvocation } from '@/components/rite-of-invocation';
import { useTypographicState } from '@/hooks/use-typographic-state';
import { useCollectiveState } from '@/hooks/use-collective-state';


/**
 * The main component that orchestrates the entire chat session.
 * It manages message state, handles user input (text and voice),
 * interacts with AI services via Server Actions, and controls the UI state 
 * (loading, recording, etc.). This component is the heart of the user-facing 
 * application and the central hub for all user interactions.
 * @returns {JSX.Element} The rendered chat session interface.
 */
export function ChatSession() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [transcriptionUnlocked, setTranscriptionUnlocked] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isInitiated, setIsInitiated] = useState(false);
  const [vow, setVow] = useState<Vow | null>(null);
  const { currentState } = useTypographicState();
  const { totalUsers, totalEngagement } = useCollectiveState();
  const audioRef = useRef<HTMLAudioElement>(null);

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    video: false,
    audio: true,
  });
  
  // Effect to load chat history once the user is authenticated.
  useEffect(() => {
    if (user && !historyLoaded) {
      getChatHistory(user.uid).then((history) => {
        setMessages(history);
        if (history.length > 0) {
            setIsInitiated(true);
            // A simple way to persist the vow is to check the first message.
            // In a real app, this would be stored in the user's profile.
            const firstUserMessage = history.find(m => m.role === 'user')?.content || '';
            if (firstUserMessage.includes('Architect')) setVow('Architect');
            else if (firstUserMessage.includes('Oracle')) setVow('Oracle');
            else if (firstUserMessage.includes('Sentinel')) setVow('Sentinel');
        }
        setHistoryLoaded(true);
      });
    }
  }, [user, historyLoaded]);

  // Effect to save chat history whenever messages change.
  useEffect(() => {
    if (user && historyLoaded && messages.length > 0) {
      saveChatHistory(user.uid, messages);
    }
  }, [messages, user, historyLoaded]);


  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !vow) return;
    
    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content,
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsAiResponding(true);

    try {
      const stream = await getAiResponse(updatedMessages, vow);
      if (!stream) {
        throw new Error("Failed to get a response from the AI. The stream is null.");
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
      
      const finalMessage = { ...assistantMessage, content: accumulatedContent };
      setMessages(prev => [...prev, finalMessage]);
      
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
  }, [messages, vow]);

  const transcribeRecording = useCallback(async (blobUrl: string) => {
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
  }, [transcriptionUnlocked, handleSendMessage]);
  
  const handleVoiceRecording = () => {
    if (!transcriptionUnlocked) {
        setShowShareModal(true);
        return;
    }
    if (status === 'recording') {
        stopRecording();
    } else {
        startRecording();
    }
  };

  useEffect(() => {
    if (mediaBlobUrl) {
      transcribeRecording(mediaBlobUrl);
    }
  }, [mediaBlobUrl, transcribeRecording]);


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

  const handleNewChat = () => {
    setMessages([]);
    setStreamingMessage(null);
     if (user) {
      saveChatHistory(user.uid, []); // Clear history in DB as well
    }
    setIsInitiated(false);
    setVow(null);
  };

  const onPromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };
  
  const handleUnlock = () => {
    setTranscriptionUnlocked(true);
    setShowShareModal(false);
  };

  const handleInitiation = (chosenVow: Vow) => {
    setVow(chosenVow);
    handleSendMessage(`I have chosen the path of the ${chosenVow}. Guide me.`);
    setIsInitiated(true);
  }

  if (authLoading || !historyLoaded) {
    return (
       <div className="flex flex-col h-screen">
        <header className="sticky top-0 z-20 w-full glassmorphism h-[70px]">
          <div className="flex items-center justify-between p-4 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-full max-w-2xl rounded-full" />
            <Skeleton className="h-8 w-40 hidden md:block" />
          </div>
        </header>
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="flex-1 flex items-center justify-center w-full">
              <Skeleton className="w-24 h-80" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  const showInitialPrompts = messages.length === 0 && !isAiResponding && !streamingMessage;

  return (
    <div className="flex flex-col h-screen">
      {!isInitiated ? (
        <RiteOfInvocation onComplete={handleInitiation} />
      ) : (
        <>
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
                startRecording={handleVoiceRecording}
                stopRecording={handleVoiceRecording}
                messages={messages}
                transcriptionUnlocked={transcriptionUnlocked}
            />
            <Progress value={isAiResponding || isTranscribing ? 100 : 0} className="h-[2px] w-full bg-transparent" />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                {showInitialPrompts ? (
                    <div className="flex flex-col items-center justify-center h-full p-4">
                        <div className="flex-1 flex items-center justify-center w-full">
                          <Obelisk 
                            typographicState={currentState}
                            totalUsers={totalUsers}
                            totalEngagement={totalEngagement}
                          />
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
            </div>
            <audio ref={audioRef} className="hidden" />
        </>
      )}
    </div>
  );
}
