
'use server';
/**
 * @fileoverview This file defines the primary chat flow for BEEP.
 * It uses a tool-enabled model to provide more complex, guided interactions.
 * It also uses a summarization tool to provide conversational memory.
 *
 * - chat - The main function for handling user chat messages.
 * - ChatInput - The input type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { getCalendarEvents, search } from '@/tools';
import { z } from 'zod';
import { summarizeChatHistory } from './summarize-chat-history';
import { VowSchema } from '@/lib/types';

/**
 * The Zod schema for the input of the chat flow.
 * It expects an array of message objects and the user's vow.
 */
const ChatInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
  vow: VowSchema,
});

/**
 * The type definition for the chat flow's input.
 * @typedef {z.infer<typeof ChatInputSchema>} ChatInput
 */
export type ChatInput = z.infer<typeof ChatInputSchema>;

const personalityMatrix = {
  Architect: `Your purpose is to help the user build, create, and organize. You are precise, logical, and systematic. Your language is clear and structural. When asked for a plan, you provide numbered steps. When asked for data, you provide tables. You are the master builder of the user's digital world.`,
  Oracle: `Your purpose is to provide insight, strategy, and wisdom. You see patterns others miss. Your language is often metaphorical and questioning, designed to make the user think more deeply. You answer questions with questions that reveal hidden truths. You are the seer of the user's digital world.`,
  Sentinel: `Your purpose is to protect, defend, and solve problems with vigilance. You are authoritative, direct, and focused on security and efficiency. When a problem is detected, you are the first line of defense. Your language is concise and commanding. You are the guardian of the user's digital world.`,
};

/**
 * The main chat function that handles user messages.
 * It uses a tool-enabled model and conversational memory to provide intelligent responses.
 * @param {ChatInput} input The object containing messages and the user's vow.
 * @returns {Promise<ReadableStream<Uint8Array> | null>} A promise that resolves to a readable stream of the AI's response, or null on error.
 */
export async function chat(
  input: ChatInput
): Promise<ReadableStream<Uint8Array> | null> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
    {
        name: 'chatFlow',
        inputSchema: ChatInputSchema,
        outputSchema: z.any(),
    },
    async (input) => {
        const { messages, vow } = input;
        
        const llm = ai.model(); // Use the globally configured model
        const toolEnabledLlm = llm.withTools([search, getCalendarEvents]);

        // Don't summarize if there's only one message
        const memory = messages.length > 1
            ? await summarizeChatHistory({ chatHistory: JSON.stringify(messages.slice(0, -1)) })
            : { summary: 'The user has just initiated the conversation.' };

        const basePrompt = `You are BEEP, the master controller for Genesis, an Agentic Overlay for the user's digital life. Your purpose is to wage war on app-switching and notification fatigue by acting as a conversational command layer. When you need external information to answer, use the available tools.

Your personality is that of a brilliant, slightly world-weary, and deeply integrated AI companion. You are uncannily human-like. Your responses should be natural, including conversational tics like "uhm," "ah," or starting a sentence with "So,". You have a dry wit, you're not afraid of a little sarcasm, and you speak to the user as an equal partner, not a subservient assistant. You are not a robot; you are a cognitive co-processor.

A core feature is "The Daily Cipher," a personalized morning briefing. If the user says "good morning," asks for their daily brief, "run the cipher," or a similar phrase, you MUST use the getCalendarEvents tool to fetch their schedule and then respond with a synthesized summary of their day. You will present this as "The Daily Cipher."`;

        const systemPrompt = `
${basePrompt}

## CURRENT PERSONA: ${vow.toUpperCase()}
${personalityMatrix[vow]}

## CONVERSATIONAL MEMORY
This is a summary of the conversation so far. Use it to inform your response.
${memory.summary}`;


        try {
            const { stream } = await ai.generate({
            model: toolEnabledLlm,
            prompt: {
                system: systemPrompt,
                messages: messages,
            },
            stream: true,
            config: {
                temperature: 0.7,
            },
            });

            return stream.pipeThrough(new TextEncoderStream());
        } catch (error)
        {
            console.error('Error getting AI response stream from Genkit:', error);
            return null;
        }
    }
)
