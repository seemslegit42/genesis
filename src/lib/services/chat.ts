import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Message } from '@/lib/types';

const functions = getFunctions();

// Note: In a production app, you might want to connect to the emulator
// during development.
// import { connectFunctionsEmulator } from 'firebase/functions';
// connectFunctionsEmulator(functions, "localhost", 5001);

const saveHistoryCallable = httpsCallable<{ messages: Message[] }, { success: boolean }>(functions, 'saveChatHistory');
const getHistoryCallable = httpsCallable<void, { messages: Message[] }>(functions, 'getChatHistory');

/**
 * Saves the chat history for the currently authenticated user by calling a Cloud Function.
 * @param {string} userId The ID of the user (Note: this is for API consistency, the function uses the authenticated user's context).
 * @param {Message[]} messages The array of messages to save.
 */
export async function saveChatHistory(userId: string, messages: Message[]): Promise<void> {
  if (!userId) {
    console.error("User ID is required to save chat history.");
    return;
  }
  try {
    const result = await saveHistoryCallable({ messages });
    if (!result.data.success) {
        throw new Error("Failed to save chat history on the server.");
    }
  } catch (error) {
    console.error("Error calling saveChatHistory Cloud Function:", error);
  }
}

/**
 * Retrieves the chat history for the currently authenticated user by calling a Cloud Function.
 * @param {string} userId The ID of the user (Note: this is for API consistency, the function uses the authenticated user's context).
 * @returns {Promise<Message[]>} A promise that resolves to the user's message history.
 */
export async function getChatHistory(userId: string): Promise<Message[]> {
  if (!userId) {
    console.error("User ID is required to get chat history.");
    return [];
  }
  try {
    const result = await getHistoryCallable();
    return result.data.messages || [];
  } catch (error) {
    console.error("Error calling getChatHistory Cloud Function:", error);
    return [];
  }
}
