/**
 * Represents a single message in a chat conversation.
 * @interface
 */
export interface Message {
  /** A unique identifier for the message. */
  id: string;
  /** The role of the entity that sent the message. */
  role: 'user' | 'assistant';
  /** The text content of the message. */
  content: string;
}

/**
 * Represents a full chat session.
 * @interface
 */
export interface Chat {
  /** A unique identifier for the chat session. */
  id: string;
  /** The title of the chat session. */
  title: string;
  /** An array of messages that make up the conversation. */
  messages: Message[];
}
