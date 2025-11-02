import { useState, useCallback } from "react";
import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { type Thread } from "@/types/discussions";

export const useDiscussionThreads = (discussionId: Id<"discussions">) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<Id<"discussionThreads"> | null>(null);
  const [replyToThread, setReplyToThread] = useState<Thread | null>(null);

  const createThreadMutation = useMutation(api.discussions.mutations.createThread);
  const deleteThreadMutation = useMutation(api.discussions.mutations.deleteThread);

  const {
    results: threads,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.discussions.queries.getDiscussionThreads,
    { discussionId },
    { initialNumItems: 10 }
  );

  const isLoadingThreads = status === "LoadingFirstPage";

  const handleLoadMoreThreads = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  }, [status, loadMore]);

  const handleDeleteThread = useCallback((threadId: Id<"discussionThreads">) => {
    setThreadToDelete(threadId);
    setShowDeleteModal(true);
  }, []);

  const handleReplyToThread = useCallback((thread: Thread) => {
    setReplyToThread(thread);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyToThread(null);
  }, []);

  const handleSubmitThread = useCallback(async (text: string) => {
    try {
      await createThreadMutation({
        discussionId,
        content: text,
        parentId: replyToThread?.threadId,
      });
      setReplyToThread(null);
    } catch (error) {
      console.error("Failed to submit thread:", error);
    }
  }, [createThreadMutation, discussionId, replyToThread]);

  const handleConfirmDelete = useCallback(async () => {
    if (threadToDelete) {
      try {
        await deleteThreadMutation({ threadId: threadToDelete });
        setThreadToDelete(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Failed to delete thread:", error);
      }
    }
  }, [threadToDelete, deleteThreadMutation]);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setThreadToDelete(null);
  }, []);

  return {
    threads: threads || [],
    isLoadingThreads,
    replyToThread,
    showDeleteModal,
    handleLoadMoreThreads,
    handleDeleteThread,
    handleReplyToThread,
    handleCancelReply,
    handleSubmitThread,
    handleConfirmDelete,
    handleCloseDeleteModal,
  };
};
