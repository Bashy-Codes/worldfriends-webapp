import React, { useCallback, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useTheme } from "@/lib/Theme";
import { useCommunityMembers } from "@/hooks/communities/useCommunityMembers";
import { Id } from "@/convex/_generated/dataModel";
import { MemberItem } from "./MemberItem";
import { EmptyState } from "@/components/EmptyState";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { useTranslation } from "react-i18next";

interface CommunityMembersSectionProps {
  communityId: Id<"communities">;
  isMember: boolean;
  isAdmin?: boolean;
}

export const CommunityMembersSection: React.FC<CommunityMembersSectionProps> = ({
  communityId,
  isMember,
  isAdmin = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: Id<"users">; name: string } | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const { members, loading, handleLoadMore, removeCommunityMember } = useCommunityMembers(communityId);

  const handleMemberPress = useCallback((userId: Id<"users">) => {
    router.push(`/screens/user-profile/${userId}`);
  }, []);

  const handleRemoveMember = useCallback((userId: Id<"users">) => {
    const member = members.find(m => m.userId === userId);
    if (member) {
      setMemberToRemove({ id: userId, name: member.name });
      setShowConfirmModal(true);
    }
  }, [members]);

  const confirmRemoveMember = useCallback(async () => {
    if (!memberToRemove) return;

    setIsRemoving(true);
    try {
      await removeCommunityMember(memberToRemove.id);
      setShowConfirmModal(false);
      setMemberToRemove(null);
    } catch (error) {
      console.error("Failed to remove member:", error);
    } finally {
      setIsRemoving(false);
    }
  }, [memberToRemove, removeCommunityMember]);

  const cancelRemoveMember = useCallback(() => {
    setShowConfirmModal(false);
    setMemberToRemove(null);
  }, []);

  const renderMember = useCallback(
    ({ item }: { item: any }) => (
      <MemberItem
        userId={item.userId}
        profilePicture={item.profilePicture}
        name={item.name}
        gender={item.gender}
        age={item.age}
        country={item.country}
        isPremiumUser={item.isPremiumUser}
        onPress={handleMemberPress}
        isAdmin={isAdmin}
        onRemove={isAdmin ? handleRemoveMember : undefined}
      />
    ),
    [handleMemberPress, isAdmin, handleRemoveMember]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
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
          {t("communities.pendingRequest")}
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <FlashList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.userId}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 12,
          }}
          ListEmptyComponent={() => <EmptyState fullScreen />}
        />
      </View>

      <ConfirmationModal
        visible={showConfirmModal}
        icon="person-remove"
        message={t("confirmation.removeCommunityMember")}
        loading={isRemoving}
        onConfirm={confirmRemoveMember}
        onCancel={cancelRemoveMember}
      />
    </>
  );
};