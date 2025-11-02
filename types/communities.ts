import { Id } from "@/convex/_generated/dataModel";

export interface Community {
  communityId: Id<"communities">;
  title: string;
  description: string;
  rules: string[];
  ageGroup: "13-17" | "18-100";
  gender: "all" | "male" | "female" | "other";
  language: string;
  bannerUrl?: string | null;
  createdAt: number;
}

export interface CommunityInfo extends Community {
  communityAdmin: {
    adminId: Id<"users">;
    name: string;
    profilePicture: string | null;
    isPremiumUser: boolean;
  };
  isAdmin: boolean;
  isMember: boolean;
  hasPendingRequest: boolean;
}

export type CommunitiesSection = "joined" | "discover";