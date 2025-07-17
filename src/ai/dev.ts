'use server';
import { config } from 'dotenv';
config();

// Flows
import '@/ai/flows/generate-initial-prompt-ideas';
import '@/ai/flows/summarize-chat-history';
import '@/ai/flows/chat';
import '@/ai/flows/text-to-speech';
import '@/ai/flows/speech-to-text';
import '@/ai/flows/predict-next-task';
import '@/ai/flows/suggest-break';
import '@/ai/flows/chronicle-ingestor';


// Tools
import '@/tools';
