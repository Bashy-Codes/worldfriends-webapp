import { Id } from "@/convex/_generated/dataModel";

/*
* Feed-related TypeScript types
*/

export interface PostTypes {
  postId: Id<"posts">;
  userId: Id<"users">;
  content: string;
  postImages?: string[],
  reactionsCount: number;
  commentsCount: number;
  hasReacted: boolean;
  userReaction?: string;
  isOwner: boolean;
  createdAt: number;
  postAuthor: {
    userId: Id<"users">;
    name: string;
    profilePicture: string;
    isPremiumUser: boolean;
  };
}

export interface CommentTypes {
  commentId: Id<"comments">;
  createdAt: number;
  userId: Id<"users">;
  postId: Id<"posts">;
  content: string;
  replyParentId?: Id<"comments">;
  reply?: CommentTypes | null;
  hasReply: boolean;
  isOwner: boolean;
  commentAuthor: {
    userId: Id<"users">;
    name: string;
    profilePicture: string;
    isPremiumUser: boolean;
  };
}

export interface ReactionTypes {
  reactionId: Id<"reactions">;
  createdAt: number;
  userId: Id<"users">;
  postId: Id<"posts">;
  emoji: string;
  reactionAuthor: {
    userId: Id<"users">;
    name: string;
    profilePicture: string;
    isPremiumUser: boolean;
  };
}


/**
 * Collection-related TypeScript types
 */

export interface CollectionTypes {
  collectionId: Id<"collections">;
  createdAt: number;
  userId: Id<"users">;
  title: string;
  postCount: number;
  isOwner: boolean;
}

export interface CollectionPostTypes {
  collectionPostId: Id<"posts">;
  createdAt: number;
  collectionId: Id<"collections">;
  post: PostTypes;
}
