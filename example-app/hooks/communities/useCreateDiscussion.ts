import { useState, useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { uploadDiscussionImageToR2 } from "@/utils/uploadImages";
import { ImagePickerRef } from "@/components/common/ImagePicker";

type LoadingModalState = "hidden" | "loading" | "success" | "error";

export const useCreateDiscussion = () => {
  const { communityId } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loadingModalState, setLoadingModalState] = useState<LoadingModalState>("hidden");

  const imagePickerRef = useRef<ImagePickerRef>(null);

  const createMutation = useMutation(api.discussions.mutations.createDiscussion);
  const updateImageMutation = useMutation(api.discussions.mutations.updateDiscussionImage);
  const generateDiscussionUploadUrl = useMutation(api.storage.generateDiscussionUploadUrl);
  const syncMetadata = useMutation(api.storage.syncMetadata);

  const canCreate = title.trim().length > 0 && content.trim().length > 0;
  const hasContent = title.trim().length > 0 || content.trim().length > 0 || image !== null;

  const handleBack = useCallback(() => {
    if (hasContent) {
      setShowDiscardModal(true);
    } else {
      router.back();
    }
  }, [hasContent]);

  const handleCreate = useCallback(() => {
    if (canCreate) {
      setShowCreateModal(true);
    }
  }, [canCreate]);

  const confirmCreate = useCallback(async () => {
    setShowCreateModal(false);
    setLoadingModalState("loading");

    try {
      const result = await createMutation({
        communityId: communityId as Id<"communities">,
        title: title.trim(),
        content: content.trim(),
      });

      if (image && result.discussionId) {
        const uploadResult = await uploadDiscussionImageToR2(
          image,
          communityId as Id<"communities">,
          result.discussionId,
          generateDiscussionUploadUrl,
          syncMetadata
        );

        if (uploadResult?.key) {
          await updateImageMutation({
            discussionId: result.discussionId,
            imageKey: uploadResult.key,
          });
        }
      }

      setLoadingModalState("success");
    } catch (error) {
      console.error("Failed to create discussion:", error);
      setLoadingModalState("error");
      Toast.show({
        type: "error",
        text1: "Failed to create discussion. Please try again."
      });
    }
  }, [communityId, title, content, image, createMutation, updateImageMutation]);

  const confirmDiscard = useCallback(() => {
    setShowDiscardModal(false);
    router.back();
  }, []);

  const closeDiscardModal = useCallback(() => {
    setShowDiscardModal(false);
  }, []);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleLoadingModalComplete = useCallback(() => {
    setLoadingModalState("hidden");
    router.back();
  }, []);

  // Image handling
  const handleAddImage = useCallback(() => {
    imagePickerRef.current?.present();
  }, []);

  const handleImageSelected = useCallback((uri: string) => {
    setImage(uri);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setImage(null);
  }, []);

  return {
    title,
    content,
    image,
    canCreate,
    showDiscardModal,
    showCreateModal,
    loadingModalState,
    imagePickerRef,
    setTitle,
    setContent,
    handleBack,
    handleCreate,
    confirmCreate,
    confirmDiscard,
    closeDiscardModal,
    closeCreateModal,
    handleLoadingModalComplete,
    handleAddImage,
    handleImageSelected,
    handleRemoveImage,
  };
};
