import { useMemo } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


export const useFriends = () => {

  const {
    results: friendsData,
    status: friendsStatus,
    loadMore: loadMoreFriends,
  } = usePaginatedQuery(
    api.friendships.queries.getUserFriends,
    {},
    { initialNumItems: 10 }
  );

  const sortedFriendsData = useMemo(() => {
    return (friendsData || []).sort((a, b) => a.name.localeCompare(b.name));
  }, [friendsData]);

  const loadMore = () => {
    if (friendsStatus === "CanLoadMore") {
      loadMoreFriends(10);
    }
  };

  return {
    friendsData: sortedFriendsData,
    friendsLoading: friendsStatus === "LoadingFirstPage",
    loadMoreFriends: loadMore
  };
};
