import { mutation, internalMutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { createNotification } from "../notifications";
import { areFriends } from "../helpers";


/**
 * Internal mutation to deliver a letter
 */
export const deliverLetter = internalMutation({
    args: { letterId: v.id("letters") },
    handler: async (ctx, args) => {
        const letter = await ctx.db.get(args.letterId);
        if (!letter) return;

        await ctx.db.patch(args.letterId, { status: "delivered" });
    },
});

/**
 * Schedule a new letter
 */
export const scheduleLetter = mutation({
    args: {
        recipientId: v.id("users"),
        title: v.string(),
        content: v.string(),
        daysUntilDelivery: v.number(),
    },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        if (args.title.trim().length === 0) {
            throw new Error("Title is required");
        }
        if (args.title.trim().length > 100) {
            throw new Error("Title must be 100 characters or less");
        }
        if (args.content.trim().length < 100) {
            throw new Error("Content must be at least 100 characters");
        }
        if (args.content.trim().length > 2000) {
            throw new Error("Content must be 2000 characters or less");
        }
        if (args.daysUntilDelivery < 1 || args.daysUntilDelivery > 30) {
            throw new Error("Delivery must be between 1 and 30 days from now");
        }

        const recipient = await ctx.db.get(args.recipientId);
        if (!recipient) throw new Error("Recipient not found");

        const friendship = await areFriends(ctx, currentUserId, args.recipientId);
        if (!friendship) {
            throw new Error("You can only send letters to friends");
        }

        const letterId = await ctx.db.insert("letters", {
            senderId: currentUserId,
            recipientId: args.recipientId,
            title: args.title.trim(),
            content: args.content.trim(),
            status: "pending",
        });

        const deliveryTime = Date.now() + (args.daysUntilDelivery * 24 * 60 * 60 * 1000);
        const scheduledFunctionId = await ctx.scheduler.runAt(
            deliveryTime,
            internal.letters.mutations.deliverLetter,
            { letterId }
        );

        await ctx.db.patch(letterId, { scheduledFunctionId });

        await createNotification(
            ctx,
            args.recipientId,
            currentUserId,
            "letter_scheduled"
        );
        return { success: true, letterId };
    },
});



/**
 * Delete a letter (sender can delete anytime, recipient can delete delivered letters)
 */
export const deleteLetter = mutation({
    args: { letterId: v.id("letters") },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        const letter = await ctx.db.get(args.letterId);
        if (!letter) throw new Error("Letter not found");

        const isSender = letter.senderId === currentUserId;
        const isRecipient = letter.recipientId === currentUserId;

        if (!isSender && !isRecipient) {
            throw new Error("Not authorized to delete this letter");
        }

        if (isRecipient && letter.status === "pending") {
            throw new Error("Cannot delete undelivered letters");
        }

        if (isSender && letter.status === "pending" && letter.scheduledFunctionId) {
            await ctx.scheduler.cancel(letter.scheduledFunctionId);
        }

        await ctx.db.delete(args.letterId);

        return { success: true };
    },
});
