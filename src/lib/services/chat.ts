import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Message } from '@/lib/types';

const chatsCollection = collection(db, 'chats');

/**
 * Saves the chat history for a specific user to Firestore.
 * @param {string} userId The ID of the user.
 * @param {Message[]} messages The array of messages to save.
 */
export async function saveChatHistory(userId: string, messages: Message[]): Promise<void> {
  if (!userId) {
    console.error("User ID is required to save chat history.");
    return;
  }
  try {
    const chatDocRef = doc(chatsCollection, userId);
    await setDoc(chatDocRef, {
      messages: messages,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving chat history:", error);
  }
}

/**
 * Retrieves the chat history for a specific user from Firestore.
 * @param {string} userId The ID of the user.
 * @returns {Promise<Message[]>} A promise that resolves to the user's message history.
 */
export async function getChatHistory(userId: string): Promise<Message[]> {
  if (!userId) {
    console.error("User ID is required to get chat history.");
    return [];
  }
  try {
    const chatDocRef = doc(chatsCollection, userId);
    const chatDocSnap = await getDoc(chatDocRef);

    if (chatDocSnap.exists()) {
      return chatDocSnap.data().messages || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error getting chat history:", error);
    return [];
  }
}
