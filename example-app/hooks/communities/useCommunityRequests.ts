import { useCallback } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Toast from "react-native-toast-message";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

export const useCommunityRequests = (communityId: Id<"communities">) => {
  const { t } = useTranslation();

  const { results, status, loadMore } = usePaginatedQuery(
    api.communities.queries.getCommunityRequests,
    { communityId },
    { initialNumItems: 10 }
  );

  const acceptMutation = useMutation(api.communities.mutations.acceptCommunityRequest);
  const rejectMutation = useMutation(api.communities.mutations.rejectCommunityRequest);

  const requests = results ?? [];
  const loading = status === "LoadingFirstPage";

  const handleLoadMore = () => {
    if (status === "CanLoadMore") {
      loadMore(20);
    }
  };

  const handleAccept = useCallback(async (requestId: Id<"communityMembers">) => {
    try {
      await acceptMutation({ requestId });
      Toast.show({
        type: "success",
        text1: t("successToasts.communityJoinRequestAccepted")
      });
    } catch (error) {
      console.error("Failed to accept request:", error);
      Toast.show({
        type: "error",
        text1: t("errorToasts.genericError")
      });
    }
  }, [acceptMutation]);

  const handleReject = useCallback(async (requestId: Id<"communityMembers">) => {
    try {
      await rejectMutation({ requestId });
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  }, [rejectMutation]);

  return {
    requests,
    loading,
    handleLoadMore,
    handleAccept,
    handleReject,
  };
};
