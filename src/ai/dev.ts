import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-prompt-ideas.ts';
import '@/ai/flows/summarize-chat-history.ts';
import '@/ai/flows/chat.ts';
import '@/ai/flows/text-to-speech';
import '@/ai/flows/speech-to-text';
import '@/ai/flows/predict-next-task';
import '@/ai/flows/suggest-break';
