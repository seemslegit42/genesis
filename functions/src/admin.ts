
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import express from "express";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const auth = admin.auth();
export const adminRouter = express.Router();

/**
 * Middleware to authenticate requests using a Firebase ID token.
 * It also checks if the authenticated user is an administrator.
 */
const authenticateAndAuthorizeAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.info("Authenticating admin request...");
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized: No token provided.');
    }

    const idToken = authorization.split('Bearer ')[1];
    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // In a production app, you would have a more robust way to check for admin privileges,
        // e.g., using custom claims or checking a user roles collection in Firestore.
        // For this implementation, we will designate a specific email as the admin.
        const userRecord = await auth.getUser(uid);
        if (userRecord.email !== 'initiate@example.com') {
             logger.warn("Permission denied for user:", {uid: uid, email: userRecord.email});
             return res.status(403).send('Forbidden: User is not an administrator.');
        }

        logger.info("Admin user authenticated successfully:", {uid: uid});
        // You can attach the user to the request object if needed
        // (req as any).user = decodedToken;
        next();
    } catch (error) {
        logger.error("Error verifying auth token:", error);
        return res.status(401).send('Unauthorized: Invalid token.');
    }
};

// Apply the authentication middleware to all routes in this router
adminRouter.use(authenticateAndAuthorizeAdmin);


/**
 * Fetches all users from Firebase Authentication.
 * This is a privileged operation protected by the middleware.
 */
adminRouter.get('/users', async (req, res) => {
    logger.info("listUsers endpoint called");
    try {
        const userRecords = await auth.listUsers();
        const users = userRecords.users.map((user) => ({
            uid: user.uid,
            email: user.email,
            disabled: user.disabled,
            creationTime: user.metadata.creationTime,
        }));
        res.status(200).json({ success: true, users });
    } catch (error) {
        logger.error("Error listing users:", error);
        res.status(500).json({ success: false, error: 'Failed to list users.' });
    }
});
