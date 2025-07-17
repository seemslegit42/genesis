
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

interface SaveHistoryPayload {
    messages: Message[];
}

export const saveChatHistory = onCall(async (request) => {
  logger.info("saveChatHistory called", {uid: request.auth?.uid});
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const uid = request.auth.uid;
  const data = request.data as SaveHistoryPayload;
  const {messages} = data;

  if (!Array.isArray(messages)) {
    throw new HttpsError("invalid-argument", "The function must be called with an array of messages.");
  }

  try {
    const chatDocRef = db.collection("chats").doc(uid);
    await chatDocRef.set({
      messages: messages,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, {merge: true});

    logger.info("Successfully saved chat history for user:", uid);
    return {success: true};
  } catch (error) {
    logger.error("Error saving chat history:", error);
    throw new HttpsError("internal", "Failed to save chat history.", error);
  }
});

export const getChatHistory = onCall(async (request) => {
  logger.info("getChatHistory called", {uid: request.auth?.uid});
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }

  const uid = request.auth.uid;

  try {
    const chatDocRef = db.collection("chats").doc(uid);
    const docSnap = await chatDocRef.get();

    if (docSnap.exists) {
      logger.info("Successfully fetched chat history for user:", uid);
      const data = docSnap.data();
      return {messages: data?.messages || []};
    } else {
      logger.info("No chat history found for user:", uid);
      return {messages: []};
    }
  } catch (error) {
    logger.error("Error getting chat history:", error);
    throw new HttpsError("internal", "Failed to get chat history.", error);
  }
});
