import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const purchaseProduct = mutation({
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

export const sendGift = mutation({
    args: {
        receiverId: v.id("users"),
        productId: v.string(),
    },
    handler: async (ctx, { receiverId, productId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const userProduct = await ctx.db
            .query("userProducts")
            .withIndex("by_userId_productId", (q) =>
                q.eq("userId", userId).eq("productId", productId)
            )
            .first();

        if (!userProduct) {
            throw new Error("Product not found in user's inventory");
        }

        if (userProduct.quantity < 1) {
            throw new Error("Insufficient quantity");
        }

        if (userProduct.quantity === 1) {
            await ctx.db.delete(userProduct._id);
        } else {
            await ctx.db.patch(userProduct._id, {
                quantity: userProduct.quantity - 1,
            });
        }

        await ctx.db.insert("userGifts", {
            senderId: userId,
            receiverId,
            productId,
        });

        const { createNotification } = await import("../notifications");
        const senderUser = await ctx.db.get(userId);
        if (senderUser) {
            await createNotification(ctx, receiverId, userId, "gift_received");
        }

        return { success: true };
    },
});