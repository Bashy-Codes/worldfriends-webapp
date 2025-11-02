import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { r2 } from "../storage";

export const getCommunityInfo = query({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, { communityId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const community = await ctx.db.get(communityId);
    if (!community) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    // Check gender restriction
    if (community.gender !== "all" && community.gender !== user.gender) {
      return { ok: false, error: "GENDER_RESTRICTION" };
    }

    // Check if user is a member
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    const isMember = membership && membership.status === "approved";
    const hasPendingRequest = membership && membership.status === "pending";

    // Get admin info
    const admin = await ctx.db.get(community.adminId);
    if (!admin) throw new Error("Community admin not found");

    // Get banner URL if exists
    let bannerUrl = null;
    if (community.banner) {
      bannerUrl = await ctx.storage.getUrl(community.banner);
    }

    return {
      ok: true,
      community: {
        communityId: community._id,
        title: community.title,
        description: community.description,
        rules: community.rules,
        ageGroup: community.ageGroup,
        gender: community.gender,
        language: community.language,
        communityAdmin: {
          adminId: admin._id,
          name: admin.name,
          profilePicture: admin.profilePicture ? await r2.getPublicUrl(admin.profilePicture) : null,
        },
        isAdmin: community.adminId === userId,
        isMember,
        hasPendingRequest,
        bannerUrl,
        createdAt: community._creationTime,
      },
    };
  },
});

export const createCommunity = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    rules: v.array(v.string()),
    genderOption: v.union(v.literal("all"), v.literal("my_gender")),
    language: v.string(),
    banner: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { title, description, rules, genderOption, language, banner }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const userInfo = await ctx.db
      .query("userInformation")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!userInfo) {
      throw new Error("User information not found");
    }

    const gender = genderOption === "all" ? "all" : user.gender;

    const communityId = await ctx.db.insert("communities", {
      adminId: userId,
      title,
      description,
      rules,
      ageGroup: userInfo.ageGroup,
      gender,
      language,
      banner,
    });

    // Auto-join the admin as approved member
    await ctx.db.insert("communityMembers", {
      communityId,
      userId,
      status: "approved",
    });

    return communityId;
  },
});

export const getUserOwnedCommunities = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const result = await ctx.db
      .query("communities")
      .withIndex("by_adminId", (q) => q.eq("adminId", userId))
      .order("desc")
      .paginate(paginationOpts);

    const communities = await Promise.all(
      result.page.map(async (community) => {
        let bannerUrl = null;
        if (community.banner) {
          bannerUrl = await ctx.storage.getUrl(community.banner);
        }

        return {
          communityId: community._id,
          title: community.title,
          description: community.description,
          rules: community.rules,
          ageGroup: community.ageGroup,
          gender: community.gender,
          language: community.language,
          bannerUrl,
          createdAt: community._creationTime,
        };
      })
    );

    return {
      ...result,
      page: communities,
    };
  },
});

export const getJoinedCommunities = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const result = await ctx.db
      .query("communityMembers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .order("desc")
      .paginate(paginationOpts);

    const communities = await Promise.all(
      result.page.map(async (membership) => {
        const community = await ctx.db.get(membership.communityId);
        if (!community) return null;

        let bannerUrl = null;
        if (community.banner) {
          bannerUrl = await ctx.storage.getUrl(community.banner);
        }

        return {
          communityId: community._id,
          title: community.title,
          description: community.description,
          rules: community.rules,
          ageGroup: community.ageGroup,
          gender: community.gender,
          language: community.language,
          bannerUrl,
          createdAt: community._creationTime,
        };
      })
    );

    return {
      ...result,
      page: communities.filter((c) => c !== null),
    };
  },
});

export const getDiscoverCommunities = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const userInfo = await ctx.db
      .query("userInformation")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!userInfo) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const memberships = await ctx.db
      .query("communityMembers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const joinedCommunityIds = new Set(memberships.map((m) => m.communityId));

    const result = await ctx.db
      .query("communities")
      .withIndex("by_ageGroup", (q) => q.eq("ageGroup", userInfo.ageGroup))
      .order("desc")
      .paginate(paginationOpts);

    const communities = await Promise.all(
      result.page
        .filter((community) => !joinedCommunityIds.has(community._id))
        .map(async (community) => {
          let bannerUrl = null;
          if (community.banner) {
            bannerUrl = await ctx.storage.getUrl(community.banner);
          }

          return {
            communityId: community._id,
            title: community.title,
            description: community.description,
            rules: community.rules,
            ageGroup: community.ageGroup,
            gender: community.gender,
            language: community.language,
            bannerUrl,
            createdAt: community._creationTime,
          };
        })
    );

    return {
      ...result,
      page: communities,
    };
  },
});

export const joinCommunity = mutation({
  args: {
    communityId: v.id("communities"),
    requestMessage: v.optional(v.string()),
  },
  handler: async (ctx, { communityId, requestMessage }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const community = await ctx.db.get(communityId);
    if (!community) {
      throw new Error("Community not found");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Validate gender restriction
    if (community.gender !== "all" && community.gender !== user.gender) {
      throw new Error("You don't meet the gender requirements for this community");
    }

    const existingMembership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    if (existingMembership) {
      throw new Error("Already a member or request pending");
    }

    await ctx.db.insert("communityMembers", {
      communityId,
      userId,
      status: "pending",
      requestMessage,
    });

    const { createNotification } = await import("../notifications")
    const requesterUser = await ctx.db.get(userId);
    if (requesterUser) {
      await createNotification(ctx, community.adminId, userId, "community_join_request");
    }

    return { success: true };
  },
});

export const updateCommunity = mutation({
  args: {
    communityId: v.id("communities"),
    title: v.string(),
    description: v.string(),
    rules: v.array(v.string()),
  },
  handler: async (ctx, { communityId, title, description, rules }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const community = await ctx.db.get(communityId);
    if (!community) {
      throw new Error("Community not found");
    }

    if (community.adminId !== userId) {
      throw new Error("Only admin can update community");
    }

    await ctx.db.patch(communityId, {
      title,
      description,
      rules,
    });

    return { success: true };
  },
});

export const deleteCommunity = mutation({
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

    if (community.adminId !== userId) {
      throw new Error("Only admin can delete community");
    }

    // Delete all related data
    const members = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId", (q) => q.eq("communityId", communityId))
      .collect();

    const discussions = await ctx.db
      .query("discussions")
      .withIndex("by_communityId", (q) => q.eq("communityId", communityId))
      .collect();

    // Delete discussion threads
    for (const discussion of discussions) {
      const threads = await ctx.db
        .query("discussionThreads")
        .withIndex("by_discussionId", (q) => q.eq("discussionId", discussion._id))
        .collect();

      for (const thread of threads) {
        await ctx.db.delete(thread._id);
      }
      await ctx.db.delete(discussion._id);
    }

    // Delete members
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Delete community
    await ctx.db.delete(communityId);

    return { success: true };
  },
});

export const getCommunityMembers = query({
  args: {
    communityId: v.id("communities"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { communityId, paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    if (!membership || membership.status !== "approved") {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const community = await ctx.db.get(communityId);
    const isAdmin = community?.adminId === userId;

    const result = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_status", (q) =>
        q.eq("communityId", communityId).eq("status", "approved")
      )
      .paginate(paginationOpts);

    const members = await Promise.all(
      result.page
        .filter(member => member.userId !== community?.adminId) // Filter out admin
        .map(async (member) => {
          const user = await ctx.db.get(member.userId);
          if (!user) return null;

          const profilePicture = await r2.getUrl(user.profilePicture);
          const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();

          return {
            userId: user._id,
            profilePicture,
            name: user.name,
            gender: user.gender,
            age
          };
        })
    );

    return {
      page: members.filter((m) => m !== null),
      isDone: result.isDone,
      continueCursor: result.continueCursor,
      isAdmin,
    };
  },
});

export const leaveCommunity = mutation({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, { communityId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const community = await ctx.db.get(communityId);
    if (!community) throw new Error("Community not found");

    // Prevent admin from leaving community
    if (community.adminId === userId) {
      throw new Error("Admin cannot leave community. Transfer ownership or delete community instead");
    }

    // Find and delete the membership
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    if (!membership) {
      throw new Error("User is not a member of this community");
    }

    await ctx.db.delete(membership._id);

    return { success: true };
  },
});

export const getCommunityRequests = query({
  args: {
    communityId: v.id("communities"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { communityId, paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    const community = await ctx.db.get(communityId);
    if (!community || community.adminId !== userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const result = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_status", (q) =>
        q.eq("communityId", communityId).eq("status", "pending")
      )
      .paginate(paginationOpts);

    const requests = await Promise.all(
      result.page.map(async (request) => {
        const user = await ctx.db.get(request.userId);
        if (!user) return null;

        const profilePicture = await r2.getUrl(user.profilePicture);
        const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();

        return {
          requestId: request._id,
          userId: user._id,
          profilePicture,
          name: user.name,
          gender: user.gender,
          age,
          country: user.country
        };
      })
    );

    return {
      ...result,
      page: requests.filter((r) => r !== null),
    };
  },
});

export const acceptCommunityRequest = mutation({
  args: {
    requestId: v.id("communityMembers"),
  },
  handler: async (ctx, { requestId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const request = await ctx.db.get(requestId);
    if (!request) throw new Error("Request not found");

    const community = await ctx.db.get(request.communityId);
    if (!community || community.adminId !== userId) {
      throw new Error("Only admin can accept requests");
    }

    await ctx.db.patch(requestId, {
      status: "approved",
      requestMessage: undefined,
    });

    return { success: true };
  },
});

export const rejectCommunityRequest = mutation({
  args: {
    requestId: v.id("communityMembers"),
  },
  handler: async (ctx, { requestId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const request = await ctx.db.get(requestId);
    if (!request) throw new Error("Request not found");

    const community = await ctx.db.get(request.communityId);
    if (!community || community.adminId !== userId) {
      throw new Error("Only admin can reject requests");
    }

    await ctx.db.delete(requestId);

    return { success: true };
  },
});

export const removeCommunityMember = mutation({
  args: {
    communityId: v.id("communities"),
    targetUserId: v.id("users"),
  },
  handler: async (ctx, { communityId, targetUserId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const community = await ctx.db.get(communityId);
    if (!community) throw new Error("Community not found");

    // Check if user is admin or removing themselves
    const isAdmin = community.adminId === userId;
    const isSelfRemoval = targetUserId === userId;

    if (!isAdmin && !isSelfRemoval) {
      throw new Error("Only admin can remove other members");
    }

    // Prevent admin from removing themselves
    if (isAdmin && isSelfRemoval) {
      throw new Error("Admin cannot leave community. Transfer ownership or delete community instead");
    }

    // Find and delete the membership
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", targetUserId)
      )
      .first();

    if (!membership) {
      throw new Error("User is not a member of this community");
    }

    await ctx.db.delete(membership._id);

    return { success: true };
  },
});
