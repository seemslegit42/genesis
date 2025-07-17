/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import express from 'express';
import cors from 'cors';

import { adminRouter } from './admin';

// Export chat history functions
export * from "./chat";


const app = express();
app.use(cors({ origin: true }));

// All admin routes will be prefixed with /admin
app.use('/admin', adminRouter);

// Export the main express app as the 'api' function
export const api = onRequest(app);


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
