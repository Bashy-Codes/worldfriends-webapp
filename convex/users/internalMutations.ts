import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

export const updatePremiumStatusInternal = internalMutation({
  args: {
    userId: v.id("users"),
    isPremium: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      isPremium: args.isPremium,
    });
  },
});
