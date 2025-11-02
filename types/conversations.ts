import { Id } from "@/convex/_generated/dataModel";

/**
 * Conversation-related TypeScript interfaces and types
 */

export interface ConversationData {
  conversationGroupId: string;
  createdAt: number;
  lastMessageId?: Id<"messages">;
  lastMessageTime: number;
  hasUnreadMessages: boolean;
  lastMessage?: MessageData;
  otherUser: {
    userId: Id<"users">;
    name: string;
    profilePicture: string;
    isPremiumUser: boolean;
  };
}


/**
 * Conversation Message types
 */
export interface MessageData {
  sender: {
    userId: Id<"users">;
    name: string;
    profilePicture: string | null;
  };
  messageId: Id<"messages">;
  createdAt: number;
  conversationGroupId: string;
  senderId: Id<"users">;
  content?: string;
  type: "text" | "image";
  imageId?: Id<"_storage">;
  replyParentId?: Id<"messages">;
  replyParent?: {
    messageId: Id<"messages">;
    content?: string;
    type: "text" | "image";
    sender: {
      userId: Id<"users">;
      name: string;
    };
  };
  isOwner: boolean;
  imageUrl?: string;
}

/**
 * Conversation Info types
 */
export interface ConversationInfo {
  otherUser: {
    userId: Id<"users">;
    name: string;
    profilePicture: string;
    isPremiumUser: boolean;
  };
}
