import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-prompt-ideas.ts';
import '@/ai/flows/summarize-chat-history.ts';
import '@/ai/flows/chat.ts';
