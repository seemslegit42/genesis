
import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signIn, signUp, signOut, signInAsGuest } from '@/lib/firebase';
import type { SignUpPayload, SignInPayload } from '@/lib/types';


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = useCallback(async (payload: SignUpPayload) => {
    setLoading(true);
    try {
      const userCredential = await signUp(payload);
      setUser(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error("Sign up failed:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignIn = useCallback(async (payload: SignInPayload) => {
    setLoading(true);
    try {
      const userCredential = await signIn(payload);
      setUser(userCredential.user);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      console.error("Sign in failed:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);
  
  const handleSignOut = useCallback(async () => {
    setLoading(true);
    try {
      await signOut();
      setUser(null);
    } catch (error) {
       console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignInAsGuest = useCallback(async () => {
    setLoading(true);
    try {
        const userCredential = await signInAsGuest();
        setUser(userCredential.user);
        return { success: true, user: userCredential.user };
    } catch (error: any) {
        console.error("Guest sign in failed:", error);
        return { success: false, error: error.message };
    } finally {
        setLoading(false);
    }
  }, []);


  return { user, loading, signUp: handleSignUp, signIn: handleSignIn, signOut: handleSignOut, signInAsGuest: handleSignInAsGuest };
}
