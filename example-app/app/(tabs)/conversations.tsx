import { useMemo, useCallback, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { useConversations } from "@/hooks/conversations/useConversations";
import { ConversationData } from "@/types/conversations";

// components
import { TabHeader } from "@/components/TabHeader";
import { ConversationItem } from "@/components/conversations/ConversationItem";
import { ConversationItemSkeleton } from "@/components/skeletons/ConversationItemSkeleton";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import {
  ActionModal,
  ActionModalOption,
  ActionModalRef,
} from "@/components/common/ActionModal";

import { useTranslation } from "react-i18next";
import { EmptyState } from "@/components/EmptyState";

export default function ConversationsTab() {
  const theme = useTheme();
  const { t } = useTranslation();

  // Refs
  const actionSheetRef = useRef<ActionModalRef>(null);

  // State for delete functionality
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const [deleteConversationModalVisible, setDeleteConversationModalVisible] = useState(false);

  const {
    conversations,
    loading,
    hasMore,
    searchQuery,
    setSearchQuery,
    handleConversationPress,
    handleDeleteConversation,
    loadMoreConversations
  } = useConversations();


  // Long press handler for conversation item
  const handleConversationLongPress = useCallback(
    (conversation: ConversationData) => {
      setSelectedConversation(conversation);
      actionSheetRef.current?.present();
    },
    []
  );

  // Handle delete conversation action
  const handleDeleteAction = useCallback(() => {
    setDeleteConversationModalVisible(true);
  }, []);

  // Confirm delete conversation
  const confirmDeleteConversation = useCallback(async () => {
    if (!selectedConversation) return;

    await handleDeleteConversation(selectedConversation.conversationGroupId);
    setDeleteConversationModalVisible(false);
    setSelectedConversation(null);
  }, [selectedConversation, handleDeleteConversation]);

  // Cancel delete conversation
  const cancelDeleteConversation = useCallback(() => {
    setDeleteConversationModalVisible(false);
    setSelectedConversation(null);
  }, []);


  // Action Modal options
  const actionModalOptions: ActionModalOption[] = useMemo(
    () => [
      {
        id: "delete",
        title: t("actions.deleteConversation"),
        icon: "trash",
        color: theme.colors.error,
        onPress: handleDeleteAction,
      },
    ],
    [theme.colors.error, handleDeleteAction, t]
  );

  // Render conversation item
  const renderConversationItem = useCallback(
    ({ item }: { item: ConversationData }) => (
      <ConversationItem
        conversation={item}
        onPress={handleConversationPress}
        onLongPress={handleConversationLongPress}
      />
    ),
    [handleConversationPress, handleConversationLongPress]
  );

  const renderSkeleton = useCallback(() => <ConversationItemSkeleton />, []);

  const skeletonData = useMemo(() => Array(10).fill(null), []);

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }, [hasMore, theme.colors.primary]);

  // Render empty state
  const renderEmptyState = useCallback(() => {
    if (loading) return null;

    return <EmptyState fullScreen />;
  }, [loading]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.background,
    },
    searchInputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: 12,
      height: 44,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    contentContainer: {
      flex: 1,
    },
    listContent: {
      paddingTop: 12,
    },
    footerLoader: {
      paddingVertical: 20,
      alignItems: "center",
    },
  });

  return (
    <View style={styles.container}>
      <TabHeader title={t("screenTitles.conversations")} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t("common.searchPlaceholder")}
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <FlashList
          data={loading ? skeletonData : conversations}
          renderItem={loading ? renderSkeleton : renderConversationItem}
          keyExtractor={(item, index) =>
            loading ? `skeleton-${index}` : item.conversationGroupId
          }
          onEndReached={loadMoreConversations}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Action Modal for conversation options */}
      <ActionModal ref={actionSheetRef} options={actionModalOptions} />

      {/* Delete Conversation Confirmation Modal */}
      <ConfirmationModal
        visible={deleteConversationModalVisible}
        icon="trash-outline"
        iconColor={theme.colors.error}
        description={t("confirmation.deleteConversation")}
        confirmButtonColor={theme.colors.error}
        onConfirm={confirmDeleteConversation}
        onCancel={cancelDeleteConversation}
      />
    </View>
  );
}