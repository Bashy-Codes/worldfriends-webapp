import { Id } from "@/convex/_generated/dataModel";

/*
  Community Home Screen Discussions Types
*/

export interface DiscussionsTypes {
  discussionId: Id<"discussions">;
  title: string;
  repliesCount: number;
  createdAt: number;
  discussionAuthor: {
    userId: Id<"users">;
    name: string;
    profilePicture: string;
    isPremiumUser: boolean;
  };
  isOwner: boolean;
}

export interface ThreadReply {
  threadId: Id<"discussionThreads">;
  content: string;
  createdAt: number;
  threadAuthor: {
    name: string;
    profilePicture: string;
    isPremiumUser: boolean;
  };
  isOwner: boolean;
}

export interface Thread {
  threadId: Id<"discussionThreads">;
  content: string;
  createdAt: number;
  threadAuthor: {
    name: string;
    profilePicture: string;
    isPremiumUser: boolean;
  };
  isOwner: boolean;
  hasReply: boolean;
  reply: ThreadReply | null;
}

/*
  Discussion Detail Screen Types
*/

export interface DiscussionTypes {
  discussionId: Id<"discussions">;
  title: string;
  content: string;
  imageUrl: string | null;
  repliesCount: number;
  createdAt: number;
  discussionAuthor: {
    name: string;
    profilePicture: string;
    isPremiumUser: boolean;
  };
  isOwner: boolean;
}