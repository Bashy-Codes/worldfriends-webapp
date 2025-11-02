import { useState, useCallback } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Request } from "@/types/friendships";

export const useFriendRequests = () => {


  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [isAccepting, setIsAccecpting] = useState(false)


  const {
    results: requestsData,
    status: requestsStatus,
    loadMore: loadMoreRequests,
  } = usePaginatedQuery(
    api.friendships.queries.getFriendRequests,
    {},
    { initialNumItems: 10 }
  );

  const acceptRequestMutation = useMutation(api.friendships.mutations.acceptFriendRequest);
  const rejectRequestMutation = useMutation(api.friendships.mutations.rejectFriendRequest);

  const handleRequestPress = useCallback((request: Request) => {
    setSelectedRequest(request);
  }, []);
  const handleAcceptRequest = useCallback(async () => {
    if (!selectedRequest) return;
    try {
      setIsAccecpting(true);
      await acceptRequestMutation({ requestId: selectedRequest.requestId });
      setSelectedRequest(null);
    } catch (error) {
      setIsAccecpting(false);
      console.error("Failed to accept request:", error);
    }
  }, [selectedRequest, acceptRequestMutation]);

  const handleRejectRequest = useCallback(async () => {
    if (!selectedRequest) return;
    try {
      await rejectRequestMutation({ requestId: selectedRequest.requestId });
      setSelectedRequest(null);
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  }, [selectedRequest, rejectRequestMutation]);

  const handleLoadMore = useCallback(() => {
    if (requestsStatus === "CanLoadMore") {
      loadMoreRequests(10);
    }
  }, [requestsStatus, loadMoreRequests]);

  return {
    requestsData: requestsData || [],
    requestsLoading: requestsStatus === "LoadingFirstPage",
    selectedRequest,
    isAccepting,
    handleRequestPress,
    handleAcceptRequest,
    handleRejectRequest,
    handleLoadMore,
  };
};