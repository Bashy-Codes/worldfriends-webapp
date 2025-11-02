import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

type CommunitySection = "home" | "info" | "members" | "requests" | "settings";

interface UseCommunityReturn {
  community: any;
  isLoading: boolean;
  restrictionError: boolean;
  activeSection: CommunitySection;
  handleSectionChange: (section: CommunitySection) => void;
  handleJoinCommunity: (requestMessage?: string) => Promise<void>;
  handleLeaveCommunity: () => Promise<void>;
  handleDeleteCommunity: () => Promise<void>;
  isJoining: boolean;
  isLeaving: boolean;
  isDeleting: boolean;
}

export const useCommunity = (communityId: Id<"communities">): UseCommunityReturn => {
  const { t } = useTranslation();

  const [activeSection, setActiveSection] = useState<CommunitySection>("home");
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const result = useQuery(api.communities.queries.getCommunityInfo, { communityId });
  const joinMutation = useMutation(api.communities.mutations.joinCommunity);
  const leaveMutation = useMutation(api.communities.mutations.leaveCommunity);
  const deleteMutation = useMutation(api.communities.mutations.deleteCommunity);

  const restrictionError = !!(result && 'ok' in result && !result.ok && result.error === "GENDER_RESTRICTION");
  const isLoading = result === undefined;
  const community = result && 'ok' in result && result.ok ? result.community : undefined;

  const handleSectionChange = useCallback((section: CommunitySection) => {
    setActiveSection(section);
  }, []);

  const handleJoinCommunity = useCallback(async (requestMessage?: string) => {
    setIsJoining(true);
    try {
      await joinMutation({ communityId, requestMessage });
      Toast.show({
        type: "success",
        text1: t("successToasts.communityJoinRequestSent")
      });
    } catch (error) {
      console.error("Failed to join community:", error);
      Toast.show({
        type: "error",
        text1: t("errorToasts.genericError")
      });
    } finally {
      setIsJoining(false);
    }
  }, [communityId, joinMutation]);

  const handleLeaveCommunity = useCallback(async () => {
    setIsLeaving(true);
    try {
      await leaveMutation({ communityId });
      router.back();
    } catch (error) {
      console.error("Failed to leave community:", error);
    } finally {
      setIsLeaving(false);
    }
  }, [communityId, leaveMutation]);

  const handleDeleteCommunity = useCallback(async () => {
    setIsDeleting(true);
    try {
      await deleteMutation({ communityId });
      Toast.show({
        type: "success",
        text1: t("successToasts.communityDeleted")
      });
      router.back();
    } catch (error) {
      console.error("Failed to delete community:", error);
      Toast.show({
        type: "error",
        text1: t("errorToasts.genericError")
      });
    } finally {
      setIsDeleting(false);
    }
  }, [communityId, deleteMutation]);

  return {
    community,
    isLoading,
    restrictionError,
    activeSection,
    handleSectionChange,
    handleJoinCommunity,
    handleLeaveCommunity,
    handleDeleteCommunity,
    isJoining,
    isLeaving,
    isDeleting,
  };
};