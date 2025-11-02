import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { router } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import { ActionModalRef } from "@/components/common/ActionModal";
import { useTranslation } from "react-i18next";

export const useDiscussion = (discussionId: Id<"discussions">) => {
  const { t } = useTranslation();
  const actionModalRef = useRef<ActionModalRef>(null);

  const discussion = useQuery(api.discussions.queries.getDiscussion, { discussionId });
  const deleteDiscussionMutation = useMutation(api.discussions.mutations.deleteDiscussion);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loading = discussion === undefined;

  const handleImagePress = useCallback(() => {
    if (discussion?.imageUrl) {
      setSelectedImages([discussion.imageUrl]);
      setSelectedImageIndex(0);
      setShowImageViewer(true);
    }
  }, [discussion]);

  const closeImageViewer = useCallback(() => {
    setShowImageViewer(false);
    setSelectedImages([]);
    setSelectedImageIndex(0);
  }, []);

  const handleOptionsPress = useCallback(() => {
    actionModalRef.current?.present();
  }, []);

  const handleDeletePress = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteDiscussionMutation({ discussionId });
      setShowDeleteModal(false);
      router.back();
    } catch (error) {
      console.error("Failed to delete discussion:", error);
    }
  }, [deleteDiscussionMutation, discussionId]);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const renderActionSheet = useCallback(() => {
    if (!discussion) return { ref: actionModalRef, options: [] };

    const options = discussion.isOwner
      ? [
        {
          id: "delete",
          title: t("actions.deleteDiscussion"),
          icon: "trash-outline",
          color: "#EF4444",
          onPress: handleDeletePress,
        },
      ]
      : [
        {
          id: "report",
          title: t("actions.reportDiscussion"),
          icon: "flag-outline",
          color: "#EF4444",
          onPress: () => { },
        },
      ];

    return { ref: actionModalRef, options };
  }, [discussion, t, handleDeletePress]);

  const renderImageViewer = useCallback(() => {
    return {
      images: selectedImages.map((uri) => ({ uri })),
      imageIndex: selectedImageIndex,
      visible: showImageViewer,
      onRequestClose: closeImageViewer,
    };
  }, [selectedImages, selectedImageIndex, showImageViewer, closeImageViewer]);

  const renderDeleteConfirmationModal = useCallback(() => {
    return {
      visible: showDeleteModal,
      icon: "trash-outline",
      description: t("confirmation.deleteDiscussion"),
      onConfirm: handleConfirmDelete,
      onCancel: handleCloseDeleteModal,
    };
  }, [showDeleteModal, t, handleConfirmDelete, handleCloseDeleteModal]);

  return {
    discussion,
    loading,
    handleImagePress,
    handleOptionsPress,
    renderActionSheet,
    renderImageViewer,
    renderDeleteConfirmationModal,
  };
};
