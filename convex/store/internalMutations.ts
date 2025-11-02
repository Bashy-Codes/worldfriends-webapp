import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const purchaseProductInternal = internalMutation({
  args: {
    productId: v.string(),
  },
  handler: async (ctx, { productId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingProduct = await ctx.db
      .query("userProducts")
      .withIndex("by_userId_productId", (q) =>
        q.eq("userId", userId).eq("productId", productId)
      )
      .first();

    if (existingProduct) {
      await ctx.db.patch(existingProduct._id, {
        quantity: existingProduct.quantity + 1,
      });
    } else {
      await ctx.db.insert("userProducts", {
        userId,
        productId,
        quantity: 1,
      });
    }

    return { success: true };
  },
});
