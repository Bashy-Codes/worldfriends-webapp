import { useState, useMemo, useCallback } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { api } from "@/convex/_generated/api";


/**
 * Custom hook for managing conversations with pagination
 *
 * This hook provides:
 * - Paginated conversation loading
 * - Loading states based on actual query status
 * - Error handling
 * - Load more functionality
 * - Client-side search filtering
 * - Navigation handler
 * - Delete conversation mutation
 */
export const useConversations = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    results: conversations,
    status,
    loadMore,
    isLoading,
  } = usePaginatedQuery(
    api.conversations.queries.getUserConversations,
    {},
    { initialNumItems: 10 }
  );

  // Initial Loading state
  const loading = status === "LoadingFirstPage";

  // Client-side search filtering
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) =>
      conv.otherUser.name.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  // Delete conversation mutation
  const deleteConversationMutation = useMutation(api.conversations.mutations.deleteConversation);

  // Navigation handler
  const handleConversationPress = useCallback(
    (conversationGroupId: string) => {
      router.push(`/screens/conversation/${conversationGroupId}` as any);
    },
    [router]
  );

  // Delete conversation handler
  const handleDeleteConversation = useCallback(
    async (conversationGroupId: string) => {
      try {
        await deleteConversationMutation({ conversationGroupId });
        Toast.show({
          type: "success",
          text1: t("toasts.conversationDeleted")
        });
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        Toast.show({
          type: "error",
          text1: t("errorToasts.genericError")
        });
      }
    },
    [deleteConversationMutation, t]
  );

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore" && !isLoading) {
      loadMore(10);
    }
  }, [status, isLoading, loadMore]);

  return {
    conversations: filteredConversations,
    isLoading,
    loading,
    status,
    loadMore,
    hasMore: status === "CanLoadMore",
    // search 
    searchQuery,
    setSearchQuery,

    // hanlders
    handleConversationPress,
    handleDeleteConversation,
    loadMoreConversations: handleLoadMore,
  };
};