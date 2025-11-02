import { Id } from "@/convex/_generated/dataModel";

export interface UserCard {
  userId: Id<"users">;
  profilePicture: string;
  name: string;
  gender: "male" | "female" | "other";
  age: number;
  country: string;
  spokenLanguages: string[];
  learningLanguages: string[];
}

export interface DiscoveryFilters {
  country?: string;
  spokenLanguage?: string;
  learningLanguage?: string;
}