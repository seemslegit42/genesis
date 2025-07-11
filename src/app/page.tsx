'use client';

import { ChatSession } from '@/components/chat-session';

/**
 * The main entry point for the BEEP: Genesis application.
 * Its primary responsibility is to render the core `ChatSession`, which
 * orchestrates the entire user experience. This modular approach ensures
 * the main page remains clean and is prepared for future logic, such as
 * gating access for different user tiers.
 * @returns {JSX.Element} The rendered chat page, the user's cognitive sanctuary.
 */
export default function ChatPage() {
  return <ChatSession />;
}
