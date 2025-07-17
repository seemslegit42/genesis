
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { ChatHeader } from '@/components/chat-session/chat-header';
import { InitialPrompts } from '@/components/chat-session/initial-prompts';
import { MessageInput } from '@/components/chat-session/message-input';
import { chat, generateInitialPromptIdeas, speechToText, predictNextTask, suggestBreak, textToSpeech } from '@/lib/actions';
import { getChatHistory, saveChatHistory } from '@/lib/services/chat';
import { useAuth } from '@/hooks/use-auth';
import type { Message, Vow } from '@/lib/types';
import { Obelisk } from '@/components/obelisk';
import { Progress } from '@/components/ui/progress';
import { ShareToUnlock } from './share-to-unlock';
import { Skeleton } from '@/components/ui/skeleton';
import { RiteOfInvocation } from '@/components/rite-of-invocation';
import { Sidecar } from '../sidecar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageList } from './message-list';
import { UndoBar } from './undo-bar';
import { useAppStore } from '@/hooks/use-app-store';


/**
 * The main component that orchestrates the entire chat session.
 * It manages message state, handles user input (text and voice),
 * interacts with AI services via Server Actions, and controls the UI state 
 * (loading, recording, etc.). This component is the heart of the user-facing 
 * application and the central hub for all user interactions.
 */
export function ChatSession() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [cipherStream, setCipherStream] = useState<string[]>([]);
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [transcriptionUnlocked, setTranscriptionUnlocked] = useState(true); // Unlocked by default now
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isInitiated, setIsInitiated] = useState(false);
  const [vow, setVow] = useState<Vow | null>(null);
  const { setAmbientState, setFocusLevel, focusedMessageId, setFocusedMessageId } = useAppStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [predictedTask, setPredictedTask] = useState<string>('');
  const [lastMessagePair, setLastMessagePair] = useState<string[] | null>(null);


  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    video: false,
    audio: true,
    onStop: (blobUrl, blob) => transcribeRecording(blobUrl, blob)
  });
  
  // Effect to manage focus decay
  useEffect(() => {
    let decayInterval: NodeJS.Timeout;
    if (!focusedMessageId) { // Only decay focus if not in focus mode
      decayInterval = setInterval(() => {
        setFocusLevel(prev => prev - 0.5); // Decay focus slowly over time
      }, 1000);
    }
    return () => clearInterval(decayInterval);
  }, [setFocusLevel, focusedMessageId]);


  // Effect to load chat history once the user is authenticated.
  useEffect(() => {
    if (user && !historyLoaded) {
      getChatHistory(user.uid).then((history) => {
        setMessages(history);
        const assistantMessages = history.filter(m => m.role === 'assistant').map(m => m.content);
        setCipherStream(assistantMessages);

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

  // Effect for the undo bar timeout
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lastMessagePair) {
      timer = setTimeout(() => {
        setLastMessagePair(null);
      }, 7000); // User has 7 seconds to undo
    }
    return () => clearTimeout(timer);
  }, [lastMessagePair]);


  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !vow) return;
    
    setLastMessagePair(null); // Clear previous undo opportunity
    setPredictedTask(''); // Clear previous prediction
    
    const newMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content,
    };
    
    const currentMessages = [...messages, newMessage];
    setMessages(currentMessages);
    
    setFocusLevel(100); // Replenish focus on user action
    setIsAiResponding(true);
    setAmbientState('focus');

    try {
      const chatHistoryForAi = currentMessages.map(({id, ...rest}) => rest);
      
      // 1. Get the text response from the AI
      const { content: assistantContent } = await chat({ messages: chatHistoryForAi, vow });
      
      const assistantMessage: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: assistantContent,
      };

      const updatedMessages = [...currentMessages, assistantMessage];
      setMessages(updatedMessages);
      setCipherStream(prev => [...prev, assistantContent]);
      setLastMessagePair([newMessage.id, assistantMessage.id]);

      // 2. Generate audio for the response in parallel
      textToSpeech({ text: assistantContent }).then(({ audioDataUri }) => {
          if (audioRef.current) {
            audioRef.current.src = audioDataUri;
            audioRef.current.play();
          }
      }).catch(err => console.error("Error generating audio:", err));


      // 3. Predict next task
      const finalHistory = updatedMessages.map(({id, ...rest}) => rest);
      predictNextTask({ chatHistory: finalHistory, vow }).then(prediction => {
          if (prediction && prediction.nextTask) {
              setPredictedTask(prediction.nextTask);
          }
       });
      
      // 4. Check for break suggestion
      const userMessagesCount = updatedMessages.filter(m => m.role === 'user').length;
      if (userMessagesCount > 0 && userMessagesCount % 8 === 0) {
          const breakSuggestion = await suggestBreak({ vow });
          if(breakSuggestion.suggestion) {
            setTimeout(() => {
                const breakMessage: Message = {
                    id: String(Date.now() + 2),
                    role: 'assistant',
                    content: breakSuggestion.suggestion
                };
                setMessages(prev => [...prev, breakMessage]);
                setCipherStream(prev => [...prev, breakMessage.content]);
            }, 1500);
          }
      }

    } catch (error) {
      console.error("Error in conversational flow:", error);
      const errorMessage: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
      setCipherStream(prev => [...prev, errorMessage.content]);
    } finally {
      setIsAiResponding(false);
      setAmbientState('calm');
    }
  }, [messages, vow, setAmbientState, setFocusLevel]);


  const transcribeRecording = useCallback(async (blobUrl: string, blob: Blob | null) => {
    if (!blob) return;
    if (!transcriptionUnlocked) {
      setShowShareModal(true);
      return;
    }
    
    setIsTranscribing(true);
    setAmbientState('focus');
    try {
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
        setAmbientState('calm');
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setIsTranscribing(false);
      setAmbientState('calm');
    }
  }, [transcriptionUnlocked, handleSendMessage, setAmbientState]);
  
  const handleVoiceRecording = () => {
    if (!transcriptionUnlocked) {
        setShowShareModal(true);
        return;
    }
    if (status === 'recording') {
        stopRecording();
        setAmbientState('calm');

    } else {
        startRecording();
        setAmbientState('recording');
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
    if (isInitiated && messages.length <= 1) {
        fetchPrompts();
    }
  }, [isInitiated, messages.length]);

  const handleNewChat = () => {
    setMessages([]);
    setCipherStream([]);
     if (user) {
      saveChatHistory(user.uid, []); // Clear history in DB as well
    }
    setIsInitiated(false);
    setVow(null);
    setPredictedTask('');
    setFocusedMessageId(null);
    setFocusLevel(80); // Reset focus for new session
    setLastMessagePair(null);
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
    setIsInitiated(true);
    const firstMessage = `I have chosen the path of the ${chosenVow}. Guide me.`;
    handleSendMessage(firstMessage);
  }

  const handleAcceptTask = (task: string) => {
    handleSendMessage(task);
    setPredictedTask('');
  }

  const handleUndo = () => {
    if (!lastMessagePair) return;
    setMessages(prev => prev.filter(m => !lastMessagePair.includes(m.id)));
    setCipherStream(prev => prev.slice(0, -1));
    setLastMessagePair(null); // Prevent multiple undos
    setPredictedTask(''); // Clear any prediction based on the undone action
  };


  if (authLoading || !historyLoaded) {
    return (
       <div className="flex flex-col h-screen">
        <header className="sticky top-0 z-20 w-full glassmorphism h-[70px]">
          <div className="flex items-center justify-between h-full w-full max-w-7xl mx-auto px-4 gap-4">
            <Skeleton className="h-6 w-24" />
            <div className="flex-1 w-full min-w-0 hidden md:block max-w-2xl">
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
            <div className="hidden md:flex items-center justify-end shrink-0 w-48">
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="md:hidden">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
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
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {!isInitiated ? (
        <RiteOfInvocation onComplete={handleInitiation} />
      ) : (
        <>
          <ShareToUnlock 
              isOpen={showShareModal}
              onClose={() => setShowShareModal(false)}
              onUnlock={handleUnlock}
          />
          <ChatHeader onNewChat={handleNewChat} />
          <Progress value={isAiResponding || isTranscribing ? 100 : 0} className="h-[2px] w-full bg-transparent" />
            
          <div className="flex-1 grid md:grid-cols-3 overflow-hidden">
            {/* Main Chat Column */}
            <div className="md:col-span-2 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1">
                <div className="max-w-4xl mx-auto px-4 w-full">
                   {messages.length > 0 ? (
                      <MessageList 
                        messages={messages} 
                        isAiResponding={isAiResponding || isTranscribing} 
                        focusedMessageId={focusedMessageId}
                        vow={vow}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center pt-8">
                         <div className="w-full max-w-md">
                           <InitialPrompts prompts={initialPrompts} onPromptClick={onPromptClick} />
                         </div>
                       </div>
                    )}
                </div>
              </ScrollArea>
              <footer className="w-full p-4 shrink-0">
                <div className="max-w-2xl mx-auto">
                   <MessageInput
                      onSendMessage={handleSendMessage}
                      isLoading={isAiResponding || isTranscribing}
                      isRecording={status === 'recording'}
                      startRecording={handleVoiceRecording}
                      stopRecording={handleVoiceRecording}
                  />
                </div>
              </footer>
            </div>

            {/* Obelisk & Sidecar Column */}
            <div className="relative hidden md:flex md:col-span-1 flex-col overflow-hidden border-l border-border/20">
              <div className="flex-1 flex items-center justify-center">
                  <div className="h-80 w-24">
                       <Obelisk
                          isAiResponding={isAiResponding || isTranscribing}
                          cipherStream={cipherStream}
                      />
                  </div>
              </div>
              <Sidecar 
                  predictedTask={predictedTask} 
                  onAcceptTask={handleAcceptTask}
                  onClose={() => setPredictedTask('')}
              />
            </div>
          </div>
            
          <UndoBar isVisible={!!lastMessagePair} onUndo={handleUndo} />
          <audio ref={audioRef} className="hidden" />
        </>
      )}
    </div>
  );
}

    