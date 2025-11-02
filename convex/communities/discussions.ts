import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { r2 } from "../storage";

export const getCommunityDiscussions = query({
  args: {
    communityId: v.id("communities"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { communityId, paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    // Check if user is a member
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    if (!membership || membership.status !== "approved") {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const results = await ctx.db
      .query("discussions")
      .withIndex("by_communityId", (q) => q.eq("communityId", communityId))
      .order("desc")
      .paginate(paginationOpts);

    const enrichedDiscussions = await Promise.all(
      results.page.map(async (discussion) => {
        const author = await ctx.db.get(discussion.userId);
        if (!author) throw new Error("Discussion author not found");

        const authorProfilePicture = await r2.getUrl(author.profilePicture);

        return {
          discussionId: discussion._id,
          title: discussion.title,
          repliesCount: discussion.repliesCount,
          createdAt: discussion._creationTime,
          discussionAuthor: {
            userId: author._id,
            name: author.name,
            profilePicture: authorProfilePicture,
            isPremiumUser: author.isPremium
          },
          isOwner: discussion.userId === userId,
        };
      })
    );

    return {
      ...results,
      page: enrichedDiscussions,
    };
  },
});

export const createDiscussion = mutation({
  args: {
    communityId: v.id("communities"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { communityId, title, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate inputs
    if (!title.trim()) throw new Error("Discussion title cannot be empty");
    if (!content.trim()) throw new Error("Discussion content cannot be empty");
    if (title.length > 100) throw new Error("Title too long (max 100 characters)");
    if (content.length > 3000) throw new Error("Content too long (max 3000 characters)");

    // Check if user is a member
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    if (!membership || membership.status !== "approved") {
      throw new Error("Only community members can create discussions");
    }

    const discussionId = await ctx.db.insert("discussions", {
      communityId,
      userId,
      title: title.trim(),
      content: content.trim(),
      repliesCount: 0,
    });

    return { discussionId, success: true };
  },
});

export const updateDiscussionImage = mutation({
  args: {
    discussionId: v.id("discussions"),
    imageKey: v.string(),
  },
  handler: async (ctx, { discussionId, imageKey }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const discussion = await ctx.db.get(discussionId);
    if (!discussion) throw new Error("Discussion not found");

    if (discussion.userId !== userId) {
      throw new Error("You can only update your own discussions");
    }

    await ctx.db.patch(discussionId, {
      imageUrl: imageKey,
    });

    return { success: true };
  },
});

export const leaveCommunity = mutation({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, { communityId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const community = await ctx.db.get(communityId);
    if (!community) {
      throw new Error("Community not found");
    }

    if (community.adminId === userId) {
      throw new Error("Admin cannot leave community");
    }

    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    if (membership) {
      await ctx.db.delete(membership._id);
    }

    return { success: true };
  },
});

export const getDiscussion = query({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, { discussionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const discussion = await ctx.db.get(discussionId);
    if (!discussion) return null;

    // Check if user is a member of the community
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", discussion.communityId).eq("userId", userId)
      )
      .first();

    if (!membership || membership.status !== "approved") return null;

    const author = await ctx.db.get(discussion.userId);
    const community = await ctx.db.get(discussion.communityId);
    if (!author || !community) throw new Error("Discussion data not found");

    const authorProfilePicture = await r2.getUrl(author.profilePicture);
    const discussionImageUrl = discussion.imageUrl ? await r2.getUrl(discussion.imageUrl) : null;

    return {
      discussionId: discussion._id,
      title: discussion.title,
      content: discussion.content,
      imageUrl: discussionImageUrl,
      repliesCount: discussion.repliesCount,
      createdAt: discussion._creationTime,
      discussionAuthor: {
        name: author.name,
        profilePicture: authorProfilePicture,
        isPremiumUser: author.isPremium
      },
      isOwner: discussion.userId === userId,
    };
  },
});

export const getDiscussionThreads = query({
  args: {
    discussionId: v.id("discussions"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { discussionId, paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    const discussion = await ctx.db.get(discussionId);
    if (!discussion) return { page: [], isDone: true, continueCursor: "" };

    // Check if user is a member
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", discussion.communityId).eq("userId", userId)
      )
      .first();

    if (!membership || membership.status !== "approved") {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const results = await ctx.db
      .query("discussionThreads")
      .withIndex("by_discussionId", (q) => q.eq("discussionId", discussionId))
      .filter((q) => q.eq(q.field("parentId"), undefined))
      .order("desc")
      .paginate(paginationOpts);

    const enrichedThreads = await Promise.all(
      results.page.map(async (thread) => {
        const author = await ctx.db.get(thread.userId);
        if (!author) throw new Error("Thread author not found");

        // Get reply if exists
        const reply = await ctx.db
          .query("discussionThreads")
          .withIndex("by_parentId", (q) => q.eq("parentId", thread._id))
          .first();

        let replyData = null;
        if (reply) {
          const replyAuthor = await ctx.db.get(reply.userId);
          if (!replyAuthor) throw new Error("Reply author not found");

          const replyAuthorProfilePicture = await r2.getUrl(replyAuthor.profilePicture);

          replyData = {
            threadId: reply._id,
            content: reply.content,
            createdAt: reply._creationTime,
            threadAuthor: {
              name: replyAuthor.name,
              profilePicture: replyAuthorProfilePicture,
              isPremiumUser: author.isPremium
            },
            isOwner: reply.userId === userId,
          };
        }

        const authorProfilePicture = await r2.getUrl(author.profilePicture);

        return {
          threadId: thread._id,
          content: thread.content,
          createdAt: thread._creationTime,
          threadAuthor: {
            name: author.name,
            profilePicture: authorProfilePicture,
            isPremiumUser: author.isPremium
          },
          isOwner: thread.userId === userId,
          hasReply: !!reply,
          reply: replyData,
        };
      })
    );

    return {
      ...results,
      page: enrichedThreads,
    };
  },
});

export const createThread = mutation({
  args: {
    discussionId: v.id("discussions"),
    content: v.string(),
    parentId: v.optional(v.id("discussionThreads")),
  },
  handler: async (ctx, { discussionId, content, parentId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate content
    if (!content.trim()) throw new Error("Thread content cannot be empty");
    if (content.length > 1000) throw new Error("Thread too long (max 1000 characters)");

    const discussion = await ctx.db.get(discussionId);
    if (!discussion) throw new Error("Discussion not found");

    // Check if user is a member
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", discussion.communityId).eq("userId", userId)
      )
      .first();

    if (!membership || membership.status !== "approved") {
      throw new Error("Only community members can create threads");
    }

    const threadId = await ctx.db.insert("discussionThreads", {
      userId,
      discussionId,
      parentId,
      content: content.trim(),
    });

    // Update replies count
    await ctx.db.patch(discussionId, {
      repliesCount: discussion.repliesCount + 1,
    });

    // Send notification if replying to a thread
    if (parentId) {
      const parentThread = await ctx.db.get(parentId);
      if (parentThread && parentThread.userId !== userId) {
        const { createNotification } = await import("../notifications");
        const replierUser = await ctx.db.get(userId);
        if (replierUser) {
          await createNotification(ctx, parentThread.userId, userId, "discussion_thread_replied");
        }
      }
    }

    return { threadId, success: true };
  },
});

export const deleteThread = mutation({
  args: {
    threadId: v.id("discussionThreads"),
  },
  handler: async (ctx, { threadId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const thread = await ctx.db.get(threadId);
    if (!thread) throw new Error("Thread not found");

    if (thread.userId !== userId) {
      throw new Error("You can only delete your own threads");
    }

    const discussion = await ctx.db.get(thread.discussionId);
    if (!discussion) throw new Error("Discussion not found");

    // Delete replies first
    const replies = await ctx.db
      .query("discussionThreads")
      .withIndex("by_parentId", (q) => q.eq("parentId", threadId))
      .collect();

    for (const reply of replies) {
      await ctx.db.delete(reply._id);
    }

    // Delete the thread
    await ctx.db.delete(threadId);

    // Update replies count
    const newCount = Math.max(0, discussion.repliesCount - (1 + replies.length));
    await ctx.db.patch(thread.discussionId, {
      repliesCount: newCount,
    });

    return { success: true };
  },
});

export const deleteDiscussion = mutation({
  args: {
    discussionId: v.id("discussions"),
  },
  handler: async (ctx, { discussionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const discussion = await ctx.db.get(discussionId);
    if (!discussion) throw new Error("Discussion not found");

    const community = await ctx.db.get(discussion.communityId);
    if (!community) throw new Error("Community not found");

    // Check if user is owner or community admin
    if (discussion.userId !== userId && community.adminId !== userId) {
      throw new Error("Only discussion owner or community admin can delete");
    }

    // Delete all threads
    const threads = await ctx.db
      .query("discussionThreads")
      .withIndex("by_discussionId", (q) => q.eq("discussionId", discussionId))
      .collect();

    for (const thread of threads) {
      await ctx.db.delete(thread._id);
    }

    // Delete discussion image if exists
    if (discussion.imageUrl) {
      await r2.deleteObject(ctx, discussion.imageUrl);
    }

    // Delete the discussion
    await ctx.db.delete(discussionId);

    return { success: true };
  },
});