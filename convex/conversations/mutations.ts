import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { createNotification } from "../notifications";
import { areFriends } from "../helpers";


// Helper function to generate conversation group ID
function generateConversationGroupId(
    userId1: Id<"users">,
    userId2: Id<"users">
): string {
    return [userId1, userId2].sort().join("-");
}

export const createConversation = mutation({
    args: {
        otherUserId: v.id("users"),
    },
    handler: async (ctx, { otherUserId }) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) {
            throw new Error("Not authenticated");
        }

        if (currentUserId === otherUserId) {
            throw new Error("Cannot create conversation with yourself");
        }

        // Check if conversation already exists
        const conversationGroupId = generateConversationGroupId(currentUserId, otherUserId);
        const existingConversation = await ctx.db
            .query("conversations")
            .withIndex("by_both", (q) =>
                q.eq("userId", currentUserId).eq("otherUserId", otherUserId)
            )
            .first();

        if (existingConversation) {
            return existingConversation.conversationGroupId;
        }

        const areUserFriends = await areFriends(ctx, currentUserId, otherUserId);

        if (!areUserFriends) {
            throw new Error("You can only create conversations with friends");
        }

        // Create dual conversation records
        await ctx.db.insert("conversations", {
            userId: currentUserId,
            otherUserId: otherUserId,
            conversationGroupId,
            lastMessageTime: Date.now(),
            hasUnreadMessages: false,
        });

        await ctx.db.insert("conversations", {
            userId: otherUserId,
            otherUserId: currentUserId,
            conversationGroupId,
            lastMessageTime: Date.now(),
            hasUnreadMessages: false,
        });

        return conversationGroupId;
    },
});

export const sendMessage = mutation({
    args: {
        conversationGroupId: v.string(),
        content: v.optional(v.string()),
        type: v.union(v.literal("text"), v.literal("image")),
        imageId: v.optional(v.id("_storage")),
        replyParentId: v.optional(v.id("messages")),
    },
    handler: async (ctx, { conversationGroupId, content, type, imageId, replyParentId }) => {
        const senderId = await getAuthUserId(ctx);
        if (!senderId) {
            throw new Error("Not authenticated");
        }

        // Verify user is participant in conversation
        const senderConversation = await ctx.db
            .query("conversations")
            .withIndex("by_conversationGroupId", (q) =>
                q.eq("conversationGroupId", conversationGroupId)
            )
            .filter((q) => q.eq(q.field("userId"), senderId))
            .first();

        if (!senderConversation) {
            throw new Error("Not authorized to send messages in this conversation");
        }

        // Validate message content based on type
        if (type === "text" && !content?.trim()) {
            throw new Error("Text messages must have content");
        }
        if (type === "image" && !imageId) {
            throw new Error("Image messages must have an imageId");
        }

        // If replying, verify the parent message exists and belongs to this conversation
        if (replyParentId) {
            const parentMessage = await ctx.db.get(replyParentId);
            if (!parentMessage) {
                throw new Error("Parent message not found");
            }
            if (parentMessage.conversationGroupId !== conversationGroupId) {
                throw new Error("Parent message does not belong to this conversation");
            }
        }

        // Create message
        const messageData: any = {
            conversationGroupId,
            senderId,
            type,
        };

        if (content?.trim()) {
            messageData.content = content.trim();
        }
        if (imageId) {
            messageData.imageId = imageId;
        }
        if (replyParentId) {
            messageData.replyParentId = replyParentId;
        }

        const messageId = await ctx.db.insert("messages", messageData);

        // Update both conversation records
        const otherUserId = senderConversation.otherUserId;
        const currentTime = Date.now();

        // Update sender's conversation record (mark as read for sender)
        await ctx.db.patch(senderConversation._id, {
            lastMessageId: messageId,
            lastMessageTime: currentTime,
            hasUnreadMessages: false,
        });

        // Update receiver's conversation record (mark as unread for receiver)
        const receiverConversation = await ctx.db
            .query("conversations")
            .withIndex("by_conversationGroupId", (q) =>
                q.eq("conversationGroupId", conversationGroupId)
            )
            .filter((q) => q.eq(q.field("userId"), otherUserId))
            .first();

        if (receiverConversation) {
            await ctx.db.patch(receiverConversation._id, {
                lastMessageId: messageId,
                lastMessageTime: currentTime,
                hasUnreadMessages: true,
            });
        }
        return messageId;
    },
});

export const deleteMessage = mutation({
    args: {
        messageId: v.id("messages"),
    },
    handler: async (ctx, { messageId }) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) {
            throw new Error("Not authenticated");
        }

        // Get message
        const message = await ctx.db.get(messageId);
        if (!message) {
            throw new Error("Message not found");
        }

        // Only sender can delete their own messages
        if (message.senderId !== currentUserId) {
            throw new Error("Not authorized to delete this message");
        }

        // If message has an image, delete the storage file first
        if (message.type === "image" && message.imageId) {
            await ctx.storage.delete(message.imageId);
        }

        // Hard delete the message
        await ctx.db.delete(messageId);

        // If this was the last message, we need to update both conversation records
        const conversations = await ctx.db
            .query("conversations")
            .withIndex("by_conversationGroupId", (q) =>
                q.eq("conversationGroupId", message.conversationGroupId)
            )
            .collect();

        for (const conversation of conversations) {
            if (conversation.lastMessageId === messageId) {
                // Find the new last message
                const lastMessage = await ctx.db
                    .query("messages")
                    .withIndex("by_conversationGroup", (q) =>
                        q.eq("conversationGroupId", message.conversationGroupId)
                    )
                    .order("desc")
                    .first();

                await ctx.db.patch(conversation._id, {
                    lastMessageId: lastMessage?._id,
                    lastMessageTime:
                        lastMessage?._creationTime || conversation.lastMessageTime,
                });
            }
        }
    },
});

export const deleteConversation = mutation({
    args: {
        conversationGroupId: v.string(),
    },
    handler: async (ctx, { conversationGroupId }) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) {
            throw new Error("Not authenticated");
        }

        // Get user's conversation record
        const userConversation = await ctx.db
            .query("conversations")
            .withIndex("by_conversationGroupId", (q) =>
                q.eq("conversationGroupId", conversationGroupId)
            )
            .filter((q) => q.eq(q.field("userId"), currentUserId))
            .first();

        if (!userConversation) {
            throw new Error("Not authorized to delete this conversation");
        }

        // Get all conversation records for this group
        const allConversations = await ctx.db
            .query("conversations")
            .withIndex("by_conversationGroupId", (q) =>
                q.eq("conversationGroupId", conversationGroupId)
            )
            .collect();

        // Delete all messages in the conversation (and their images)
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

        // Get current user for notification
        const currentUser = await ctx.db.get(currentUserId);

        // Send notification to other participant
        if (currentUser) {
            const otherParticipantId = userConversation.otherUserId;

            await createNotification(
                ctx,
                otherParticipantId,
                currentUserId,
                "conversation_deleted",
            );
        }

        // Delete all conversation records
        for (const conversation of allConversations) {
            await ctx.db.delete(conversation._id);
        }


    },
});

export const markAsRead = mutation({
    args: {
        conversationGroupId: v.string(),
    },
    handler: async (ctx, { conversationGroupId }) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) {
            throw new Error("Not authenticated");
        }

        // Get user's conversation record
        const userConversation = await ctx.db
            .query("conversations")
            .withIndex("by_conversationGroupId", (q) =>
                q.eq("conversationGroupId", conversationGroupId)
            )
            .filter((q) => q.eq(q.field("userId"), currentUserId))
            .first();

        if (!userConversation) {
            throw new Error("Not authorized");
        }

        // Mark as read for current user
        await ctx.db.patch(userConversation._id, {
            hasUnreadMessages: false,
        });
    },
});