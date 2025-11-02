import { Id } from "@/convex/_generated/dataModel";

// Re-export store types
export * from "./store";
export * from "./discussions";


export interface NotificationItem {
  notificationId: string;
  type:
  | "friend_request_sent"
  | "friend_request_accepted"
  | "friend_request_rejected"
  | "friend_removed"
  | "conversation_deleted"
  | "user_blocked"
  | "post_reaction"
  | "post_commented"
  | "comment_replied"
  | "letter_scheduled"
  | "gift_received"
  | "discussion_thread_replied"
  | "community_join_request"

  createdAt: number;
  data?: { letterDeliveryDays?: number };
  sender: {
    userId: string;
    name: string;
    country: string;
  };
}

export interface UserProfile {
  // general user data
  userId: Id<"users">;
  profilePicture: string;
  name: string;
  username: string;
  gender: "male" | "female" | "other";
  age: number;
  countryCode: string;
  isPremiumUser: boolean;
  // profile data
  aboutMe: string;
  spokenLanguageCodes: string[];
  learningLanguageCodes: string[];
  hobbies: string[];
}
