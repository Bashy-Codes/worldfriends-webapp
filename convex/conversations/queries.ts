import { v } from "convex/values";
import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { r2 } from "../storage";

export const getUserConversations = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, { paginationOpts }) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) {
            return {
                page: [],
                isDone: true,
                continueCursor: "",
            };
        }

        const results = await ctx.db
            .query("conversations")
            .withIndex("by_user_lastMessageTime", (q) =>
                q.eq("userId", currentUserId)
            )
            .order("desc")
            .paginate(paginationOpts);

        const pageConversations = results.page;

        // Enrich conversations with user and last message data
        const enrichedConversations = await Promise.all(
            pageConversations.map(async (conversation) => {
                // Get the other user data
                const otherUserId = conversation.otherUserId;
                const otherUser = await ctx.db.get(otherUserId);
                if (!otherUser) {
                    return null;
                }

                // Get profile picture URL
                const profilePictureUrl = await r2.getPublicUrl(otherUser.profilePicture);

                // Get last message if exists
                let lastMessage = undefined;
                if (conversation.lastMessageId) {
                    const message = await ctx.db.get(conversation.lastMessageId);
                    if (message) {
                        lastMessage = {
                            messageId: message._id,
                            content: message.content,
                            type: message.type,
                            senderId: message.senderId,
                            createdAt: message._creationTime,
                            conversationGroupId: conversation.conversationGroupId,
                            imageId: undefined,
                            replyParentId: undefined,
                            sender: {
                                userId: otherUser._id,
                                name: otherUser.name,
                                profilePicture: profilePictureUrl,
                            },
                            isOwner: message.senderId === currentUserId,
                        };
                    }
                }

                return {
                    conversationGroupId: conversation.conversationGroupId,
                    createdAt: conversation._creationTime,
                    lastMessageId: conversation.lastMessageId,
                    lastMessageTime: conversation.lastMessageTime,
                    hasUnreadMessages: conversation.hasUnreadMessages,
                    lastMessage,
                    otherUser: {
                        userId: otherUser._id,
                        name: otherUser.name,
                        profilePicture: profilePictureUrl,
                        isPremiumUser: otherUser.isPremium
                    },
                };
            })
        );

        // Filter out null results (where other user profile wasn't found)
        const validConversations = enrichedConversations.filter(
            (conv) => conv !== null
        );

        return {
            page: validConversations,
            isDone: results.isDone,
            continueCursor: results.continueCursor,
        };
    },
});

export const getConversationMessages = query({
    args: {
        conversationGroupId: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, { conversationGroupId, paginationOpts }) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId) {
            throw new Error("Not authenticated");
        }

        // Verify user is participant in conversation
        const userConversation = await ctx.db
            .query("conversations")
            .withIndex("by_conversationGroupId", (q) =>
                q.eq("conversationGroupId", conversationGroupId)
            )
            .filter((q) => q.eq(q.field("userId"), currentUserId))
            .first();

        if (!userConversation) {
            throw new Error("Not authorized to view this conversation");
        }

        // Get messages with pagination (desc order for most recent first)
        const results = await ctx.db
            .query("messages")
            .withIndex("by_conversationGroup", (q) =>
                q.eq("conversationGroupId", conversationGroupId)
            )
            .order("desc")
            .paginate(paginationOpts);

        // Enrich messages with sender data and image URLs
        const enrichedMessages = await Promise.all(
            results.page.map(async (message) => {
                // Get sender user data
                const senderUser = await ctx.db.get(message.senderId);
                if (!senderUser) {
                    return null;
                }

                // Get sender profile picture URL
                const senderProfilePictureUrl = await r2.getPublicUrl(senderUser.profilePicture);

                // Get image URL if message has image
                let imageUrl: string | null = null;
                if (message.type === "image" && message.imageId) {
                    imageUrl = await ctx.storage.getUrl(message.imageId);
                }

                // Get reply parent data if this is a reply
                let replyParent = null;
                if (message.replyParentId) {
                    const parentMessage = await ctx.db.get(message.replyParentId);
                    if (parentMessage) {
                        // Get parent message sender user data
                        const parentSenderUser = await ctx.db.get(parentMessage.senderId);

                        if (parentSenderUser) {
                            replyParent = {
                                messageId: parentMessage._id,
                                content: parentMessage.content,
                                type: parentMessage.type,
                                sender: {
                                    name: parentSenderUser.name,
                                },
                            };
                        }
                    }
                }

                return {
                    messageId: message._id,
                    createdAt: message._creationTime,
                    conversationGroupId: message.conversationGroupId,
                    senderId: message.senderId,
                    content: message.content,
                    type: message.type,
                    imageId: message.imageId,
                    replyParentId: message.replyParentId,
                    replyParent,
                    isOwner: message.senderId === currentUserId,
                    imageUrl,
                    sender: {
                        userId: senderUser._id,
                        name: senderUser.name,
                        profilePicture: senderProfilePictureUrl,
                    },
                };
            })
        );

        // Filter out null results (where sender profile wasn't found)
        const validMessages = enrichedMessages.filter((msg) => msg !== null);

        return {
            ...results,
            page: validMessages,
        };
    },
});

export const getConversationInfo = query({
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
            throw new Error("Not authorized to view this conversation");
        }

        // Get the other user data
        const otherUserId = userConversation.otherUserId;
        const otherUser = await ctx.db.get(otherUserId);

        if (!otherUser) {
            throw new Error("Other user not found");
        }

        // Get profile picture URL
        const profilePictureUrl = await r2.getPublicUrl(otherUser.profilePicture);

        return {
            otherUser: {
                userId: otherUser._id,
                name: otherUser.name,
                profilePicture: profilePictureUrl,
                isPremiumUser: otherUser.isPremium
            },
        };
    },
});
