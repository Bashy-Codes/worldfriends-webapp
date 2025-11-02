import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { calculateAge } from "../helpers";
import { r2 } from "../storage";
/**
 * Get received letters for the current user (only delivered letters)
 */
export const getUserReceivedLetters = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        const result = await ctx.db
            .query("letters")
            .withIndex("by_recipient_status", (q) =>
                q.eq("recipientId", currentUserId).eq("status", "delivered")
            )
            .order("desc")
            .paginate(args.paginationOpts);

        const enrichedLetters = await Promise.all(
            result.page.map(async (letter) => {
                const sender = await ctx.db.get(letter.senderId);
                if (!sender) throw new Error("Sender not found");

                const senderProfilePictureUrl = await r2.getUrl(sender.profilePicture);

                return {
                    letterId: letter._id,
                    senderId: letter.senderId,
                    recipientId: letter.recipientId,
                    title: letter.title,
                    content: letter.content,
                    createdAt: letter._creationTime,
                    status: letter.status,
                    sender: {
                        userId: sender._id,
                        name: sender.name,
                        profilePicture: senderProfilePictureUrl,
                        gender: sender.gender,
                        age: calculateAge(sender.birthDate),
                        country: sender.country,
                        isPremiumUser: sender.isPremium
                    },
                };
            })
        );

        return {
            ...result,
            page: enrichedLetters,
        };
    },
});

/**
 * Get sent letters for the current user (all letters)
 */
export const getUserSentLetters = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        const result = await ctx.db
            .query("letters")
            .withIndex("by_sender", (q) => q.eq("senderId", currentUserId))
            .order("desc")
            .paginate(args.paginationOpts);

        const enrichedLetters = await Promise.all(
            result.page.map(async (letter) => {
                const recipient = await ctx.db.get(letter.recipientId);
                if (!recipient) throw new Error("Recipient not found");

                const recipientProfilePictureUrl = await r2.getUrl(recipient.profilePicture);

                return {
                    letterId: letter._id,
                    senderId: letter.senderId,
                    recipientId: letter.recipientId,
                    title: letter.title,
                    content: letter.content,
                    createdAt: letter._creationTime,
                    status: letter.status,
                    recipient: {
                        userId: recipient._id,
                        name: recipient.name,
                        profilePicture: recipientProfilePictureUrl,
                        gender: recipient.gender,
                        age: calculateAge(recipient.birthDate),
                        country: recipient.country,
                        isPremiumUser: recipient.isPremium
                    },
                };
            })
        );

        return {
            ...result,
            page: enrichedLetters,
        };
    },
});

/**
 * Get a specific letter by ID
 */
export const getLetter = query({
    args: { letterId: v.id("letters") },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        const letter = await ctx.db.get(args.letterId);
        if (!letter) throw new Error("Letter not found");

        if (letter.senderId !== currentUserId && letter.recipientId !== currentUserId) {
            throw new Error("Not authorized to view this letter");
        }

        if (letter.recipientId === currentUserId && letter.status === "pending") {
            throw new Error("Letter not yet delivered");
        }

        const isSender = letter.senderId === currentUserId;
        const relevantUserId = isSender ? letter.recipientId : letter.senderId;
        const relevantUser = await ctx.db.get(relevantUserId);

        if (!relevantUser) throw new Error("User data not found");

        return {
            letterId: letter._id,
            title: letter.title,
            content: letter.content,
            createdAt: letter._creationTime,
            isSender,
            status: letter.status,
            otherUser: {
                name: relevantUser.name,
                country: relevantUser.country,
            },
        };
    },
});