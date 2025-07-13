
'use client';

import { useState } from 'react';
import type { User } from 'firebase/auth';
import { Login } from './login';
import { Signup } from './signup';

interface AuthGateProps {
  user: User | null;
  children: React.ReactNode;
}

export function AuthGate({ user, children }: AuthGateProps) {
  const [showLogin, setShowLogin] = useState(true);

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
        {showLogin ? (
            <Login onSwitchToSignup={() => setShowLogin(false)} />
        ) : (
            <Signup onSwitchToLogin={() => setShowLogin(true)} />
        )}
    </div>
  );
}
