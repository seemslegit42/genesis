'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { ChatHeader } from '@/components/chat-session/chat-header';
import { MessageList } from '@/components/chat-session/message-list';
import { InitialPrompts } from '@/components/chat-session/initial-prompts';
import { generateInitialPromptIdeas, getAiResponse, textToSpeech, speechToText } from '@/lib/actions';
import type { Message } from '@/lib/types';
import { Obelisk } from '@/components/obelisk';
import { Progress } from '@/components/ui/progress';
import { ShareToUnlock } from './share-to-unlock';

/**
 * The main component that orchestrates the entire chat session.
 * It manages message state, handles user input (text and voice),
 * interacts with AI services via Server Actions, and controls the UI state 
 * (loading, recording, etc.). This component is the heart of the user-facing 
 * application and the central hub for all user interactions.
 * @returns {JSX.Element} The rendered chat session interface.
 */
export function ChatSession() {
  // State for managing the list of messages in the chat.
  const [messages, setMessages] = useState<Message[]>([]);
  // State for the message currently being streamed from the AI.
  const [streamingMessage, setStreamingMessage] = useState<Message | null>(null);
  // State for the initial prompt suggestions shown to the user.
  const [initialPrompts, setInitialPrompts] = useState<string[]>([]);
  // State to track if the AI is currently processing and responding.
  const [isAiResponding, setIsAiResponding] = useState(false);
  // State to track if audio is currently being transcribed.
  const [isTranscribing, setIsTranscribing] = useState(false);
  // State to control the visibility of the "Share to Unlock" modal, a key viral loop.
  const [showShareModal, setShowShareModal] = useState(false);
  // State to track if the transcription feature has been unlocked by the user.
  const [transcriptionUnlocked, setTranscriptionUnlocked] = useState(false);
  // Ref to the audio element for playing back TTS audio.
  const audioRef = useRef<HTMLAudioElement>(null);

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    video: false,
    audio: true,
  });

  /**
   * Handles sending a message to the AI and processing the streaming response.
   * This function is memoized with `useCallback` to prevent unnecessary re-renders,
   * which is critical for performance in a real-time chat application.
   * @param {string} content The text content of the user's message.
   */
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
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
      
      // Once text is fully received, generate and play audio for a full voice modality experience.
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
  }, [messages]);

  /**
   * Transcribes recorded audio and sends the resulting text as a message.
   * This function is memoized with `useCallback` for performance optimization.
   * It also contains the logic for the share-to-unlock viral loop.
   * @param {string} blobUrl The URL of the recorded audio blob.
   */
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

  // Effect to handle transcription when a recording is finished.
  // This effect correctly includes all its dependencies.
  useEffect(() => {
    if (mediaBlobUrl) {
      transcribeRecording(mediaBlobUrl);
    }
  }, [mediaBlobUrl, transcribeRecording]);


  // Effect to fetch initial prompt ideas on component mount. This improves the
  // onboarding experience by providing immediate, actionable suggestions.
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

  /**
   * Resets the chat session to its initial state, clearing all messages.
   * This action allows the Initiate to exit the "Focus Tunnel" and return to the calm
   * of the Obelisk.
   * @returns {void}
   */
  const handleNewChat = () => {
    setMessages([]);
    setStreamingMessage(null);
  };

  /**
   * Handles the click event on an initial prompt suggestion, sending it as a message.
   * This is the first step in the Initiate's journey, transforming their intent into action.
   * @param {string} prompt The text of the clicked prompt.
   * @returns {void}
   */
  const onPromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };
  
  /**
   * Handles unlocking the transcription feature after a successful share.
   * This is the reward mechanism for our viral loop.
   * @returns {void}
   */
  const handleUnlock = () => {
    setTranscriptionUnlocked(true);
    setShowShareModal(false);
  };

  // Determines if the UI should be in its initial state (showing the Obelisk)
  // or in the "Focus Tunnel" (showing the message list).
  const showInitialState = messages.length === 0 && !isAiResponding && !streamingMessage;

  return (
    <div className="flex flex-col h-full">
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
      {/* The Psyche-Fuel Gauge: a subtle, persistent signal of the AI's cognitive state. */}
      <Progress value={isAiResponding || isTranscribing ? 100 : 0} className="h-[2px] w-full bg-transparent" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
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
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
