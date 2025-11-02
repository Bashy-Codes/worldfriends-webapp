import React, { useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/lib/Theme";
import { Id } from "@/convex/_generated/dataModel";
import { useCommunityHome } from "@/hooks/communities/useCommunityHome";
import { DiscussionsTypes } from "@/types/discussions";

import { Button } from "@/components/ui/Button";
import { DiscussionCard } from "@/components/discussions/DiscussionCard";
import { EmptyState } from "@/components/EmptyState";
import { ActionModal } from "@/components/common/ActionModal";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import Divider from "../ui/Divider";
import { useTranslation } from "react-i18next";

interface CommunityHomeSectionProps {
  communityId: Id<"communities">;
  isMember: boolean;
  isJoining: boolean;
  onJoinPress: () => void;
}

export const CommunityHomeSection: React.FC<CommunityHomeSectionProps> = ({
  communityId,
  isMember,
  onJoinPress,
  isJoining,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();


  const {
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
  } = useCommunityHome(communityId, isMember);

  const renderDiscussion = useCallback(
    ({ item }: { item: DiscussionsTypes }) => (
      <DiscussionCard
        discussion={item}
        onPress={handleDiscussionPress}
        onOptionsPress={handleOptionsPress}
      />
    ),
    [handleDiscussionPress, handleOptionsPress]
  );

  const ListHeader = useCallback(() => (
    <View style={{ padding: 16 }}>
      <Button
        title={t("communities.homeSection.createDiscussionButton")}
        iconName="add"
        onPress={handleCreateDiscussion}
      />
      <Divider text={t("communities.homeSection.communityDiscussionsTitle")} />
    </View>
  ), [handleCreateDiscussion]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    restrictedContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
      paddingVertical: 40,
    },
    restrictedText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: 12,
      marginBottom: 24,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    listContainer: {
      flex: 1,
      minHeight: 400,
    },
  });

  if (!isMember) {
    return (
      <View style={styles.restrictedContainer}>
        <Ionicons
          name="lock-closed"
          size={48}
          color={theme.colors.textMuted}
        />
        <Text style={styles.restrictedText}>
          {t("communities.homeSection.joinRestrictionMessage")}
        </Text>
        <Button
          title={t("communities.joinButton")}
          onPress={onJoinPress}
          loading={isJoining}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlashList
        data={discussions}
        keyExtractor={(item) => item.discussionId}
        renderItem={renderDiscussion}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={() => <EmptyState fullScreen />}
      />
      <ActionModal ref={actionModalRef} options={actionModalOptions} />
      <ConfirmationModal
        visible={showDeleteModal}
        icon="trash-outline"
        description={t("confirmation.deleteDiscussion")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
};