import { Id } from "@/convex/_generated/dataModel";


// Types for friend card
export interface Friend {
  userId: Id<"users">;
  profileId: Id<"profiles">;
  profilePicture: string;
  name: string;
  gender: "male" | "female" | "other";
  age: number;
  country: string;
  isPremiumUser: boolean;
}

// Types for Friend Request
export interface Request {
  requestId: Id<"friendRequests">;
  senderId: Id<"users">;
  requestMessage: string;
  name: string;
  profilePicture: string;
  gender: "male" | "female" | "other";
  age: number;
  country: string;
  isPremiumUser: boolean;
}
