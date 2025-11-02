import { mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { createNotification } from "../notifications";
import { areFriends, hasPendingRequest, checkUsersPrivacy } from "../helpers";


export const sendFriendRequest = mutation({
    args: {
        receiverId: v.id("users"),
        requestMessage: v.string(),
    },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        if (!args.requestMessage.trim()) {
            throw new Error("Request message cannot be empty");
        }

        if (args.requestMessage.length > 300) {
            throw new Error("Request message is too long");
        }

        if (currentUserId === args.receiverId) {
            throw new Error("Cannot send friend request to yourself");
        }

        const alreadyFriends = await areFriends(
            ctx,
            currentUserId,
            args.receiverId,
        );
        if (alreadyFriends) {
            throw new Error("You are already friends with this user");
        }

        const pendingRequest = await hasPendingRequest(
            ctx,
            currentUserId,
            args.receiverId,
        );
        if (pendingRequest) {
            throw new Error("A friend request already exists");
        }

        const receiver = await ctx.db.get(args.receiverId);
        if (!receiver) {
            throw new Error("User not found");
        }

        const canInteract = await checkUsersPrivacy(ctx, currentUserId, args.receiverId);
        if (!canInteract) {
            throw new Error("Cannot send friend request due to privacy restrictions");
        }

        await ctx.db.insert("friendRequests", {
            senderId: currentUserId,
            receiverId: args.receiverId,
            requestMessage: args.requestMessage.trim(),
        });

        // Get sender's user data for notification
        const senderUser = await ctx.db.get(currentUserId);

        if (senderUser) {
            // Send notification to receiver
            await createNotification(
                ctx,
                args.receiverId,
                currentUserId,
                "friend_request_sent",
            );
        }

        return { success: true };
    },
});


export const acceptFriendRequest = mutation({
    args: {
        requestId: v.id("friendRequests"),
    },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        const request = await ctx.db.get(args.requestId);
        if (!request) {
            throw new Error("Friend request not found");
        }

        if (request.receiverId !== currentUserId) {
            throw new Error("You can only accept requests sent to you");
        }

        const alreadyFriends = await areFriends(
            ctx,
            request.senderId,
            request.receiverId,
        );
        if (alreadyFriends) {
            await ctx.db.delete(args.requestId);
            return { success: true };
        }

        const canInteract = await checkUsersPrivacy(ctx, currentUserId, request.senderId);
        if (!canInteract) {
            throw new Error("Cannot accept friend request due to privacy restrictions");
        }

        // Create dual friendship records for efficient one-direction queries
        await ctx.db.insert("friendships", {
            userId: request.senderId,
            friendId: request.receiverId,
        });

        await ctx.db.insert("friendships", {
            userId: request.receiverId,
            friendId: request.senderId,
        });

        await ctx.db.delete(args.requestId);

        // Get accepter's user data for notification
        const accepterUser = await ctx.db.get(currentUserId);

        if (accepterUser) {
            // Send notification to original sender
            await createNotification(
                ctx,
                request.senderId,
                currentUserId,
                "friend_request_accepted",
            );
        }

        return { success: true };
    },
});

export const rejectFriendRequest = mutation({
    args: {
        requestId: v.id("friendRequests"),
    },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        const request = await ctx.db.get(args.requestId);
        if (!request) {
            throw new Error("Friend request not found");
        }

        if (request.receiverId !== currentUserId) {
            throw new Error("You can only reject requests sent to you");
        }

        await ctx.db.delete(args.requestId);

        // Get rejecter's user data for notification
        const rejecterUser = await ctx.db.get(currentUserId);

        if (rejecterUser) {
            // Send notification to original sender
            await createNotification(
                ctx,
                request.senderId,
                currentUserId,
                "friend_request_rejected",
            );
        }

        return { success: true };
    },
});

export const removeFriend = mutation({
    args: {
        friendUserId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        if (currentUserId === args.friendUserId) {
            throw new Error("Cannot remove yourself as friend");
        }

        // Find and delete both friendship records
        const friendship1 = await ctx.db
            .query("friendships")
            .withIndex("by_both", (q) =>
                q.eq("userId", currentUserId).eq("friendId", args.friendUserId),
            )
            .first();

        const friendship2 = await ctx.db
            .query("friendships")
            .withIndex("by_both", (q) =>
                q.eq("userId", args.friendUserId).eq("friendId", currentUserId),
            )
            .first();

        if (!friendship1 || !friendship2) {
            throw new Error("You are not friends with this user");
        }

        // Delete both friendship records
        await ctx.db.delete(friendship1._id);
        await ctx.db.delete(friendship2._id);

        // Delete all conversations between the users
        const conversation1 = await ctx.db
            .query("conversations")
            .withIndex("by_both", (q) =>
                q.eq("userId", currentUserId).eq("otherUserId", args.friendUserId)
            )
            .first();

        const conversation2 = await ctx.db
            .query("conversations")
            .withIndex("by_both", (q) =>
                q.eq("userId", args.friendUserId).eq("otherUserId", currentUserId)
            )
            .first();

        if (conversation1 || conversation2) {
            const conversationGroupId = conversation1?.conversationGroupId || conversation2?.conversationGroupId;

            if (conversationGroupId) {
                const messages = await ctx.db
                    .query("messages")
                    .withIndex("by_conversationGroup", (q) =>
                        q.eq("conversationGroupId", conversationGroupId)
                    )
                    .collect();

                for (const message of messages) {
                    if (message.type === "image" && message.imageId) {
                        await ctx.storage.delete(message.imageId);
                    }
                    await ctx.db.delete(message._id);
                }

                if (conversation1) await ctx.db.delete(conversation1._id);
                if (conversation2) await ctx.db.delete(conversation2._id);
            }
        }

        // Delete all letters between the users (both directions)
        const lettersFromCurrentUser = await ctx.db
            .query("letters")
            .withIndex("by_sender", (q) => q.eq("senderId", currentUserId))
            .filter((q) => q.eq(q.field("recipientId"), args.friendUserId))
            .collect();

        for (const letter of lettersFromCurrentUser) {
            await ctx.db.delete(letter._id);
        }

        const lettersToCurrentUser = await ctx.db
            .query("letters")
            .withIndex("by_sender", (q) => q.eq("senderId", args.friendUserId))
            .filter((q) => q.eq(q.field("recipientId"), currentUserId))
            .collect();

        for (const letter of lettersToCurrentUser) {
            await ctx.db.delete(letter._id);
        }

        // Delete all gifts between the users (both directions)
        const giftsFromCurrentUser = await ctx.db
            .query("userGifts")
            .withIndex("by_sender", (q) => q.eq("senderId", currentUserId))
            .filter((q) => q.eq(q.field("receiverId"), args.friendUserId))
            .collect();

        for (const gift of giftsFromCurrentUser) {
            await ctx.db.delete(gift._id);
        }

        const giftsToCurrentUser = await ctx.db
            .query("userGifts")
            .withIndex("by_sender", (q) => q.eq("senderId", args.friendUserId))
            .filter((q) => q.eq(q.field("receiverId"), currentUserId))
            .collect();

        for (const gift of giftsToCurrentUser) {
            await ctx.db.delete(gift._id);
        }

        // Get current user's data for notification
        const currentUser = await ctx.db.get(currentUserId);

        if (currentUser) {
            // Send notification to the removed friend
            await createNotification(
                ctx,
                args.friendUserId,
                currentUserId,
                "friend_removed",
            );
        }

        return { success: true };
    },
});
