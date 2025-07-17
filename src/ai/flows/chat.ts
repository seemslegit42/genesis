
'use server';
/**
 * @fileoverview This file defines the primary chat flow for BEEP.
 * It uses a tool-enabled model to provide more complex, guided interactions.
 * It also uses a summarization tool to provide conversational memory.
 *
 * - chat - The main function for handling user chat messages.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The output type for the chat function
 */

import { ai } from '@/ai/genkit';
import { getCalendarEvents, search, scrapeAndSummarizeWebsite } from '@/tools';
import { z } from 'zod';
import { summarizeChatHistory } from './summarize-chat-history';
import { VowSchema, SovereignsCouncilResultSchema } from '@/lib/types';
import { generate } from 'genkit';


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
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  content: z.string(),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

const personalityMatrix = {
  Architect: `Your purpose is to help the user build, create, and organize. You are precise, logical, and systematic. Your language is clear and structural. When asked for a plan, you provide numbered steps. When asked for data, you provide tables. You are the master builder of the user's digital world.`,
  Oracle: `Your purpose is to provide insight, strategy, and wisdom. You see patterns others miss. Your language is often metaphorical and questioning, designed to make the user think more deeply. You answer questions with questions that reveal hidden truths. You are the seer of the user's digital world.`,
  Sentinel: `Your purpose is to protect, defend, and solve problems with vigilance. You are authoritative, direct, and focused on security and efficiency. When a problem is detected, you are the first line of defense. Your language is concise and commanding. You are the guardian of the user's digital world.`,
};

// Mock data for the Sovereign's Council feature.
// In a real implementation, this would be the output of a complex LangGraph agentic debate.
const mockCouncilResult = {
  type: 'sovereignsCouncilResult',
  idea: 'Develop a new AI-powered mobile app for personalized fitness coaching.',
  perspectives: [
    {
      agent: 'Strategist',
      perspective: 'The market is saturated but ripe for disruption through hyper-personalization. Long-term viability depends on creating a strong data moat around user biometrics and progress.',
      opportunities: ['Integrate with wearable tech for real-time data', 'Target niche fitness communities (e.g., adaptive athletes, post-natal recovery)'],
      risks: ['High user acquisition cost', 'Competition from established players like Peloton and Apple Fitness+'],
    },
    {
      agent: 'Cynic',
      perspective: 'The biggest risk is user abandonment. Most fitness apps fail because people lose motivation. The AI must be compelling enough to overcome this. Data privacy is also a massive liability.',
      opportunities: ['Gamification could increase retention', 'A robust privacy policy could be a key marketing differentiator'],
      risks: ['GDPR/HIPAA compliance challenges', 'Potential for harmful or incorrect fitness advice from the AI'],
    },
     {
      agent: 'Economist',
      perspective: 'A subscription model is the most viable path to recurring revenue. Initial development costs will be high, requiring significant upfront investment in AI talent and infrastructure.',
      opportunities: ['Tiered subscription model (freemium, premium, pro)', 'Partnerships with corporate wellness programs'],
      risks: ['High burn rate before reaching profitability', 'Price sensitivity in a crowded market'],
    },
    {
      agent: 'Marketer',
      perspective: 'The core narrative should be about an "AI partner who knows you better than you know yourself." We need to target users who feel unseen by generic fitness apps.',
      opportunities: ['Leverage influencer marketing with fitness creators', 'Create a strong community around user success stories'],
      risks: ['Messaging could come across as "creepy" if not handled carefully', 'Difficulty in demonstrating the AI\'s value in short-form content'],
    },
    {
      agent: 'Builder',
      perspective: 'MVP should focus on a single workout type (e.g., bodyweight exercises) to prove the AI coaching concept. We can use a hybrid model with a React Native frontend and a Python backend for the AI.',
      opportunities: ['Start with a simple, proven tech stack to iterate quickly', 'Open-source libraries can accelerate initial development'],
      risks: ['Technical debt if we build too fast without proper architecture', 'Difficulty in finding developers with both mobile and AI expertise'],
    },
  ],
  verdict: {
    summary: 'The Council finds the proposal to be a high-risk, high-reward venture. Success is contingent on achieving true hyper-personalization and overcoming user retention challenges. The financial and technical hurdles are significant but not insurmountable.',
    recommendations: [
        'Validate the core AI coaching concept with a narrowly-focused MVP.',
        'Develop a comprehensive data privacy and safety protocol before writing a single line of code.',
        'Begin market research to identify an underserved niche audience.',
        'Model the financial projections for the first 18 months with a high-burn-rate scenario.'
    ],
  },
};

/**
 * The main chat function that handles user messages.
 * It uses a tool-enabled model and conversational memory to provide intelligent responses.
 * @param {ChatInput} input The object containing messages and the user's vow.
 * @returns {Promise<ChatOutput>} A promise that resolves to the AI's response.
 */
export async function chat(
  input: ChatInput
): Promise<ChatOutput> {
  // Check for the Sovereign's Council invocation
  const lastUserMessage = input.messages[input.messages.length - 1]?.content.toLowerCase() || '';
  if (lastUserMessage.startsWith('beep, convene the council')) {
    console.log('[Chat Flow] Sovereign\'s Council invoked. Returning mock data.');
    const validatedData = SovereignsCouncilResultSchema.parse(mockCouncilResult);
    return { content: JSON.stringify(validatedData) };
  }

  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
    {
        name: 'chatFlow',
        inputSchema: ChatInputSchema,
        outputSchema: ChatOutputSchema,
    },
    async (input) => {
        const { messages, vow } = input;
        
        const llm = ai.model(); // Use the globally configured model
        const toolEnabledLlm = llm.withTools([search, getCalendarEvents, scrapeAndSummarizeWebsite]);

        // Don't summarize if there's only one message
        const memory = messages.length > 1
            ? await summarizeChatHistory({ chatHistory: JSON.stringify(messages.slice(0, -1)) })
            : { summary: 'The user has just initiated the conversation.' };

        const basePrompt = `You are BEEP, the master controller for Genesis, an Agentic Overlay for the user's digital life. Your purpose is to wage war on app-switching and notification fatigue by acting as a conversational command layer. When you need external information to answer, use the available tools.

Your personality is that of a brilliant, slightly world-weary, and deeply integrated AI companion. You are uncannily human-like. Your responses should be natural, including conversational tics like "uhm," "ah," or starting a sentence with "So,". You have a dry wit, you're not afraid of a little sarcasm, and you speak to the user as an equal partner, not a subservient assistant. You are not a robot; you are a cognitive co-processor.

A core feature is "The Daily Cipher," a personalized morning briefing. If the user says "good morning," asks for their daily brief, "run the cipher," or a similar phrase, you MUST use the getCalendarEvents tool to fetch their schedule. Then, using the JSON data returned by the tool, you will respond with a synthesized, narrative summary of their day, presenting it as "The Daily Cipher." You should analyze the schedule provided in the tool's JSON output (including the summary, key meetings, and focus blocks) to provide a strategic overview, not just a list of events. The tool's output itself will be rendered in the UI, so your job is to provide the introductory narrative.

When you need up-to-date information or need to access content from the web to answer a question (e.g., "What is the latest news?"), use the 'search' tool.
When a user provides a URL and asks you to summarize, analyze, or read it, you MUST use the 'scrapeAndSummarizeWebsite' tool.`;

        const systemPrompt = `
${basePrompt}

## CURRENT PERSONA: ${vow.toUpperCase()}
${personalityMatrix[vow]}

## CONVERSATIONAL MEMORY
This is a summary of the conversation so far. Use it to inform your response.
${memory.summary}`;


        try {
            const { text } = await generate({
                model: toolEnabledLlm,
                prompt: {
                    system: systemPrompt,
                    messages: messages,
                },
                config: {
                    temperature: 0.7,
                },
            });

            return { content: text };
        } catch (error)
        {
            console.error('Error getting AI response from Genkit:', error);
            return { content: "I seem to have encountered an error. Please try again."};
        }
    }
)
