
import { auth } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

// This URL will be specific to your Firebase project and the region of your function.
// Ensure your 'api' function is deployed to 'us-central1'.
const API_BASE_URL = `https://us-central1-${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.cloudfunctions.net/api`;

interface User {
    uid: string;
    email?: string;
    disabled: boolean;
    creationTime: string;
}

interface ListUsersResponse {
    success: boolean;
    users?: User[];
    error?: string;
}

/**
 * Fetches the list of all users from the secure admin endpoint.
 * Requires the current user to be an administrator.
 */
export async function listUsers(): Promise<ListUsersResponse> {
  const currentUser: FirebaseUser | null = auth.currentUser;

  if (!currentUser) {
    return { success: false, error: 'Authentication required.' };
  }

  try {
    const idToken = await currentUser.getIdToken();
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching users from admin service:', error);
    return { success: false, error: error.message };
  }
}
