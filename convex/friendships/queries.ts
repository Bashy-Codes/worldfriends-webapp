import { query, QueryCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
import { calculateAge } from "../helpers";
import { r2 } from "../storage";

async function batchEnrichProfiles(
    ctx: QueryCtx,
    userIds: Id<"users">[],
): Promise<
    Array<{
        userId: Id<"users">;
        profileId: Id<"profiles">;
        profilePicture: string;
        name: string;
        gender: "male" | "female" | "other";
        age: number;
        country: string;
        isAdmin?: boolean;
        activeBadge?: string;
    } | null>
> {
    if (userIds.length === 0) return [];

    const users = await Promise.all(userIds.map((userId) => ctx.db.get(userId)));

    const profiles = await Promise.all(
        userIds.map((userId) =>
            ctx.db
                .query("profiles")
                .withIndex("by_userId", (q) => q.eq("userId", userId))
                .first(),
        ),
    );

    const enrichedProfiles = await Promise.all(
        users.map(async (user, index) => {
            if (!user) return null;
            const profile = profiles[index];
            if (!profile) return null;

            const profilePictureUrl = await r2.getPublicUrl(user.profilePicture);

            return {
                userId: user._id,
                profileId: profile._id,
                profilePicture: profilePictureUrl,
                name: user.name,
                gender: user.gender,
                age: calculateAge(user.birthDate),
                country: user.country
            };
        }),
    );

    return enrichedProfiles;
}

export const getFriendRequests = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId)
            return {
                page: [],
                isDone: true,
                continueCursor: "",
            };

        const requests = await ctx.db
            .query("friendRequests")
            .withIndex("by_receiver", (q) => q.eq("receiverId", currentUserId))
            .order("desc")
            .paginate(args.paginationOpts);

        const senderIds = requests.page.map((request) => request.senderId);
        const enrichedProfiles = await batchEnrichProfiles(ctx, senderIds);

        const enrichedPage = requests.page
            .map((request, index) => {
                const profile = enrichedProfiles[index];
                if (!profile) return null;

                return {
                    requestId: request._id,
                    profilePicture: profile.profilePicture,
                    name: profile.name,
                    gender: profile.gender,
                    age: profile.age,
                    country: profile.country,
                    requestMessage: request.requestMessage,
                    senderId: request.senderId,
                };
            })
            .filter((request) => request !== null);

        return {
            ...requests,
            page: enrichedPage,
        };
    },
});

export const getUserFriends = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const currentUserId = await getAuthUserId(ctx);
        if (!currentUserId)
            return {
                page: [],
                isDone: true,
                continueCursor: "",
            };

        const friendships = await ctx.db
            .query("friendships")
            .withIndex("by_user", (q) => q.eq("userId", currentUserId))
            .order("desc")
            .paginate(args.paginationOpts);

        const friendUserIds = friendships.page.map(
            (friendship) => friendship.friendId,
        );
        const enrichedProfiles = await batchEnrichProfiles(ctx, friendUserIds);
        const validFriends = enrichedProfiles.filter((profile) => profile !== null);

        return {
            ...friendships,
            page: validFriends,
        };
    },
});
