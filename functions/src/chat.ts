
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

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


/**
 * Fetches all users from Firebase Authentication.
 * This is a privileged operation and should be protected by security rules
 * or an admin check in a real application.
 */
export const listUsers = onCall(async (request) => {
    logger.info("listUsers called", {uid: request.auth?.uid});

    // IMPORTANT: In a production app, you MUST add a check here to ensure
    // that the caller is an administrator.
    // Example:
    // const uid = request.auth?.uid;
    // if (!uid) {
    //   throw new HttpsError("unauthenticated", "Authentication required.");
    // }
    // const userRecord = await auth.getUser(uid);
    // if (userRecord.customClaims?.['admin'] !== true) {
    //   throw new HttpsError("permission-denied", "You must be an admin to perform this action.");
    // }

    try {
        const userRecords = await auth.listUsers();
        const users = userRecords.users.map((user) => ({
            uid: user.uid,
            email: user.email,
            disabled: user.disabled,
            creationTime: user.metadata.creationTime,
        }));
        return {users};
    } catch (error) {
        logger.error("Error listing users:", error);
        throw new HttpsError("internal", "Failed to list users.", error);
    }
});
