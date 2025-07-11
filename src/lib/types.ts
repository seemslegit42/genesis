/**
 * Represents a single message in a chat conversation.
 * This is the fundamental unit of communication between the user and the AI.
 * @interface Message
 */
export interface Message {
  /** 
   * A unique identifier for the message, typically a timestamp or a UUID.
   * @type {string}
   */
  id: string;
  /** 
   * The role of the entity that sent the message.
   * 'user' represents the human user.
   * 'assistant' represents the AI, BEEP.
   * @type {'user' | 'assistant'}
   */
  role: 'user' | 'assistant';
  /** 
   * The text content of the message.
   * @type {string}
   */
  content: string;
}

/**
 * Represents a full chat session or conversation history.
 * While not actively used in the current implementation, it defines the structure for potentially storing and retrieving past conversations.
 * @interface Chat
 */
export interface Chat {
  /** 
   * A unique identifier for the chat session.
   * @type {string}
   */
  id: string;
  /** 
   * The title of the chat session, which could be user-defined or auto-generated.
   * @type {string}
   */
  title: string;
  /** 
   * An array of Message objects that make up the conversation.
   * @type {Message[]}
   */
  messages: Message[];
}
