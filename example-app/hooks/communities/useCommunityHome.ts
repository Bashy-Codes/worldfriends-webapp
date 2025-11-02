import { useCallback, useRef, useState } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { router } from "expo-router";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DiscussionsTypes } from "@/types/discussions";
import { ActionModalRef, ActionModalOption } from "@/components/common/ActionModal";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

export const useCommunityHome = (communityId: Id<"communities">, isMember: boolean) => {
  const { t } = useTranslation();

  const actionModalRef = useRef<ActionModalRef>(null);
  const [selectedDiscussion, setSelectedDiscussion] = useState<DiscussionsTypes | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { results, status, loadMore } = usePaginatedQuery(
    api.discussions.queries.getCommunityDiscussions,
    isMember ? { communityId } : "skip",
    { initialNumItems: 10 }
  );

  const deleteDiscussionMutation = useMutation(api.discussions.mutations.deleteDiscussion);

  const discussions = results || [];
  const isLoading = status === "LoadingFirstPage";

  const handleDiscussionPress = useCallback((discussion: DiscussionsTypes) => {
    router.push(`/screens/discussion/${discussion.discussionId}`);
  }, []);

  const handleCreateDiscussion = useCallback(() => {
    router.push({ pathname: "/screens/create-discussion", params: { communityId } });
  }, [communityId]);

  const handleOptionsPress = useCallback((discussion: DiscussionsTypes) => {
    setSelectedDiscussion(discussion);
    actionModalRef.current?.present();
  }, []);

  const handleDeletePress = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleReportPress = useCallback(() => {
    if (selectedDiscussion) {
      router.push({
        pathname: "/screens/report",
        params: {
          targetType: "discussion",
          targetId: selectedDiscussion.discussionId,
        },
      });
    }
  }, [selectedDiscussion]);

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedDiscussion) return;

    try {
      await deleteDiscussionMutation({ discussionId: selectedDiscussion.discussionId as Id<"discussions"> });
      Toast.show({
        type: "success",
        text1: t("successToasts.dicsussionDeleted")
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: t("errorToasts.genericError")
      });
    } finally {
      setShowDeleteModal(false);
      setSelectedDiscussion(null);
    }
  }, [selectedDiscussion, deleteDiscussionMutation]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedDiscussion(null);
  }, []);

  const actionModalOptions: ActionModalOption[] = selectedDiscussion?.isOwner
    ? [
      {
        id: "delete",
        title: t("actions.deleteDiscussion"),
        icon: "trash-outline",
        color: "#ef4444",
        onPress: handleDeletePress,
      },
    ]
    : [
      {
        id: "report",
        title: t("actions.reportDiscussion"),
        icon: "flag-outline",
        color: "#ef4444",
        onPress: handleReportPress,
      },
    ];

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  }, [status, loadMore]);

  return {
    discussions,
    isLoading,
    handleDiscussionPress,
    handleCreateDiscussion,
    handleOptionsPress,
    handleLoadMore,
    actionModalRef,
    actionModalOptions,
    showDeleteModal,
    handleConfirmDelete,
    handleCancelDelete,
  };
};