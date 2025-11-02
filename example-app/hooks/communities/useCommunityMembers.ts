import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCallback } from "react";

export const useCommunityMembers = (communityId: Id<"communities">) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.communities.queries.getCommunityMembers,
    { communityId },
    { initialNumItems: 10 }
  );

  const removeMemberMutation = useMutation(api.communities.mutations.removeCommunityMember);

  const members = results ?? [];
  const loading = status === "LoadingFirstPage";

  const handleLoadMore = () => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  };

  const removeCommunityMember = useCallback(async (targetUserId: Id<"users">) => {
    try {
      await removeMemberMutation({ communityId, targetUserId });
    } catch (error) {
      console.error("Failed to remove member:", error);
      throw error;
    }
  }, [removeMemberMutation, communityId]);

  return {
    members,
    loading,
    handleLoadMore,
    removeCommunityMember,
  };
};