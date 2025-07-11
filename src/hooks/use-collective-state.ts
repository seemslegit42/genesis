'use client';

import { useState, useEffect } from 'react';

/**
 * The data shape representing the collective state of the application.
 * @interface CollectiveState
 */
interface CollectiveState {
  totalUsers: number;
  totalEngagement: number;
}

/**
 * A custom hook to simulate a real-time connection to a collective state service.
 * In a real-world application, this would be replaced with a WebSocket or a
 * real-time database listener (like Firestore) to get live updates on user
 * activity across the entire platform.
 *
 * For now, it provides a believable illusion of a living, breathing user base
 * by incrementally increasing user and engagement counts over time. This is
 * crucial for fueling the "Obelisk of Genesis" legacy engine.
 *
 * @returns {CollectiveState} An object containing the current simulated collective state.
 */
export function useCollectiveState(): CollectiveState {
  const [state, setState] = useState<CollectiveState>({
    totalUsers: 1,
    totalEngagement: 0,
  });

  useEffect(() => {
    // Start with a believable base number of users.
    const initialUsers = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
    const initialEngagement = initialUsers * (Math.floor(Math.random() * (20-5+1)) + 5);
    setState({ totalUsers: initialUsers, totalEngagement: initialEngagement });


    // Simulate new users joining over time.
    const userInterval = setInterval(() => {
      setState(prevState => ({
        ...prevState,
        totalUsers: prevState.totalUsers + 1,
      }));
    }, 15000); // New user every 15 seconds

    // Simulate ongoing engagement from the entire user base.
    const engagementInterval = setInterval(() => {
        setState(prevState => ({
            ...prevState,
            // Engagement increases proportionally to the number of users
            totalEngagement: prevState.totalEngagement + (prevState.totalUsers * (Math.floor(Math.random() * 3)))
        }));
    }, 2000); // Engagement pulse every 2 seconds

    // Clean up intervals on component unmount to prevent memory leaks.
    return () => {
      clearInterval(userInterval);
      clearInterval(engagementInterval);
    };
  }, []);

  return state;
}
