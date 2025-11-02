import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const getUserProducts = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, { paginationOpts }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return { page: [], isDone: true, continueCursor: "" };
        }

        const results = await ctx.db
            .query("userProducts")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .order("desc")
            .paginate(paginationOpts);

        return results;
    },
});

export const getUserReceivedGifts = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, { paginationOpts }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return { page: [], isDone: true, continueCursor: "" };
        }

        const results = await ctx.db
            .query("userGifts")
            .withIndex("by_receiver", (q) => q.eq("receiverId", userId))
            .order("desc")
            .paginate(paginationOpts);

        const giftsWithSender = await Promise.all(
            results.page.map(async (gift) => {
                const sender = await ctx.db.get(gift.senderId);
                if (!sender) {
                    return null;
                }

                return {
                    giftId: gift._id,
                    createdAt: gift._creationTime,
                    productId: gift.productId,
                    senderInfo: {
                        name: sender.name,
                        country: sender.country,
                    },
                };
            })
        );

        return {
            ...results,
            page: giftsWithSender.filter((gift) => gift !== null),
        };
    },
});

export const getUserSentGifts = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, { paginationOpts }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return { page: [], isDone: true, continueCursor: "" };
        }

        const results = await ctx.db
            .query("userGifts")
            .withIndex("by_sender", (q) => q.eq("senderId", userId))
            .order("desc")
            .paginate(paginationOpts);

        const giftsWithReceiver = await Promise.all(
            results.page.map(async (gift) => {
                const receiver = await ctx.db.get(gift.receiverId);
                if (!receiver) {
                    return null;
                }

                return {
                    giftId: gift._id,
                    createdAt: gift._creationTime,
                    productId: gift.productId,
                    receiverInfo: {
                        name: receiver.name,
                        country: receiver.country,
                    },
                };
            })
        );

        return {
            ...results,
            page: giftsWithReceiver.filter((gift) => gift !== null),
        };
    },
});

export const getUserProfileGifts = query({
    args: {
        userId: v.id("users"),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, { userId, paginationOpts }) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) {
            return { page: [], isDone: true, continueCursor: "" };
        }

        const friendship = await ctx.db
            .query("friendships")
            .withIndex("by_both", (q) =>
                q.eq("userId", currentUserId).eq("friendId", userId)
            )
            .first();

        if (!friendship && currentUserId !== userId) {
            return { page: [], isDone: true, continueCursor: "" };
        }

        const results = await ctx.db
            .query("userGifts")
            .withIndex("by_receiver", (q) => q.eq("receiverId", userId))
            .order("desc")
            .paginate(paginationOpts);

        const giftsWithSender = await Promise.all(
            results.page.map(async (gift) => {
                const sender = await ctx.db.get(gift.senderId);
                if (!sender) {
                    return null;
                }

                return {
                    giftId: gift._id,
                    createdAt: gift._creationTime,
                    productId: gift.productId,
                    senderInfo: {
                        name: sender.name,
                        country: sender.country,
                    },
                };
            })
        );

        return {
            ...results,
            page: giftsWithSender.filter((gift) => gift !== null),
        };
    },
});
