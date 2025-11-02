import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Helper function to check if two users are friends
 */
export async function areFriends(
  ctx: QueryCtx | MutationCtx,
  userId1: Id<"users">,
  userId2: Id<"users">
): Promise<boolean> {
  if (userId1 === userId2) return false;

  // Check if there's a friendship record where userId1 is the user and userId2 is the friend
  const friendship = await ctx.db
    .query("friendships")
    .withIndex("by_both", (q) =>
      q.eq("userId", userId1).eq("friendId", userId2)
    )
    .first();

  return !!friendship;
}

/**
 * Helper function to check pending requests
 */

export async function hasPendingRequest(
  ctx: QueryCtx | MutationCtx,
  senderId: Id<"users">,
  receiverId: Id<"users">
): Promise<boolean> {
  const [request, reverseRequest] = await Promise.all([
    ctx.db
      .query("friendRequests")
      .withIndex("by_both", (q) =>
        q.eq("senderId", senderId).eq("receiverId", receiverId)
      )
      .first(),
    ctx.db
      .query("friendRequests")
      .withIndex("by_both", (q) =>
        q.eq("senderId", receiverId).eq("receiverId", senderId)
      )
      .first(),
  ]);

  return !!(request || reverseRequest);
}


/**
 * Helper function to get user's friends list
 */
export async function getUserFriends(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<Id<"users">[]> {
  const friendships = await ctx.db
    .query("friendships")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();

  return friendships.map((f) => f.friendId);
}

/**
 * Helper function to calculate age from birth date
 */
export function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Helper function to Increment posts count for a collection
 */
export const incrementCollectionPostsCount = async (
  ctx: any,
  collectionId: Id<"collections">
) => {
  const collection = await ctx.db.get(collectionId);
  if (collection) {
    await ctx.db.patch(collectionId, {
      postsCount: collection.postsCount + 1,
    });
  }
};

/**
 * Helper function to Decrement posts count for a collection
 */
export const decrementCollectionPostsCount = async (
  ctx: any,
  collectionId: Id<"collections">
) => {
  const collection = await ctx.db.get(collectionId);
  if (collection && collection.postsCount > 0) {
    await ctx.db.patch(collectionId, {
      postsCount: collection.postsCount - 1,
    });
  }
};



/**
 * Helper function to check age group and gender preference compatibility between two users
 */
export async function checkUsersPrivacy(
  ctx: QueryCtx | MutationCtx,
  userId1: Id<"users">,
  userId2: Id<"users">
): Promise<boolean> {
  const [user1, user2, userInfo1, userInfo2] = await Promise.all([
    ctx.db.get(userId1),
    ctx.db.get(userId2),
    ctx.db
      .query("userInformation")
      .withIndex("by_userId", (q) => q.eq("userId", userId1))
      .unique(),
    ctx.db
      .query("userInformation")
      .withIndex("by_userId", (q) => q.eq("userId", userId2))
      .unique(),
  ]);

  if (!user1 || !user2 || !userInfo1 || !userInfo2) {
    return false;
  }

  if (userInfo1.ageGroup !== userInfo2.ageGroup) {
    return false;
  }

  if (userInfo1.genderPreference && user1.gender !== user2.gender) {
    return false;
  }

  if (userInfo2.genderPreference && user2.gender !== user1.gender) {
    return false;
  }

  return true;
}

/**
 * Helper function to get the user age group
 */
export function getAgeGroup(birthDate: string): "13-17" | "18-100" {
  const age = calculateAge(birthDate);
  return age < 18 ? "13-17" : "18-100";
}
