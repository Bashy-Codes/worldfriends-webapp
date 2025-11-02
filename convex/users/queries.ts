import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const getCurrentProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return profile;
  },
});

export const getFullProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const [user, profile, userInfo] = await Promise.all([
      ctx.db.get(userId),
      ctx.db
        .query("profiles")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique(),
      ctx.db
        .query("userInformation")
        .withIndex("by_userId", (q) => q.eq("userId", userId))
        .unique(),
    ]);

    if (!user || !profile || !userInfo) return null;

    return {
      user,
      profile,
      userInfo,
    };
  },
});

export const checkUsernameAvailability = query({
  args: { userName: v.string() },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userName", (q) => q.eq("userName", args.userName))
      .unique();

    return { available: !existingUser };
  },
});