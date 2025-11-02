import { useCallback, useMemo } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/lib/Theme";
import { useDiscussion } from "@/hooks/communities/useDiscussion";
import { useDiscussionThreads } from "@/hooks/communities/useDiscussionThreads";
import { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import { FlashList } from "@shopify/flash-list";

import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLoading } from "@/components/ScreenLoading";
import { KeyboardHandler } from "@/components/KeyboardHandler";
import { ActionModal } from "@/components/common/ActionModal";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { ImageViewer } from "@/components/common/ImageViewer";
import { DiscussionHeader } from "@/components/discussions/DiscussionHeader";
import { ThreadInput } from "@/components/ui/ThreadInput";
import { ThreadItem } from "@/components/ui/ThreadItem";
import { EmptyState } from "@/components/EmptyState";
import { Thread } from "@/types/discussions";
import Divider from "@/components/ui/Divider";

export default function DiscussionScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();

  const discussionId = id as Id<"discussions">;

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
    threadsContainer: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
  }), [theme]);

  const {
    discussion,
    loading,
    handleImagePress,
    handleOptionsPress,
    renderActionSheet,
    renderImageViewer,
    renderDeleteConfirmationModal,
  } = useDiscussion(discussionId);

  const {
    threads,
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
  } = useDiscussionThreads(discussionId);

  const renderThreadItem = useCallback(
    ({ item }: { item: Thread }) => (
      <ThreadItem
        id={item.threadId}
        content={item.content}
        author={{
          name: item.threadAuthor.name,
          profilePicture: item.threadAuthor.profilePicture,
          isPremiumUser: item.threadAuthor.isPremiumUser,
        }}
        createdAt={item.createdAt}
        isOwner={item.isOwner}
        hasReply={item.hasReply}
        reply={item.reply ? {
          id: item.reply.threadId,
          content: item.reply.content,
          author: {
            name: item.reply.threadAuthor.name,
            profilePicture: item.reply.threadAuthor.profilePicture,
            isPremiumUser: item.reply.threadAuthor.isPremiumUser
          },
          createdAt: item.reply.createdAt,
          isOwner: item.reply.isOwner,
        } : undefined}
        onDelete={(id) => handleDeleteThread(id as Id<"discussionThreads">)}
        onReply={() => handleReplyToThread(item)}
      />
    ),
    [handleDeleteThread, handleReplyToThread]
  );

  const renderLoader = useCallback(() => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  ), [styles, theme]);

  const renderEmptyState = useCallback(() => <EmptyState halfScreen />, []);

  const renderListHeader = useCallback(() => (
    discussion ? (
      <View>
        <DiscussionHeader
          discussion={discussion}
          onImagePress={handleImagePress}
        />
        <Divider text={discussion.repliesCount} />
      </View>
    ) : null
  ), [discussion, handleImagePress]);

  const actionSheetProps = renderActionSheet();
  const imageViewerProps = renderImageViewer();
  const deleteConfirmationProps = renderDeleteConfirmationModal();

  if (loading || (isLoadingThreads && !discussion)) {
    return <ScreenLoading />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScreenHeader
        title={t("screenTitles.discussion")}
        rightComponent={discussion ? "ellipsis" : null}
        onRightPress={discussion ? handleOptionsPress : undefined}
      />
      <KeyboardHandler enabled={true} style={styles.content}>
        <View style={styles.threadsContainer}>
          {isLoadingThreads ? renderLoader() :
            <FlashList
              data={threads}
              keyExtractor={(item) => item.threadId}
              renderItem={renderThreadItem}
              onEndReached={handleLoadMoreThreads}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={renderListHeader}
              ListEmptyComponent={renderEmptyState}
            />
          }
        </View>
        <ThreadInput
          onSubmit={handleSubmitThread}
          replyPreview={replyToThread ? {
            authorName: replyToThread.threadAuthor.name,
            content: replyToThread.content,
          } : null}
          onCancelReply={handleCancelReply}
        />
      </KeyboardHandler>

      {actionSheetProps && <ActionModal ref={actionSheetProps.ref} options={actionSheetProps.options} />}
      <ImageViewer {...imageViewerProps} />
      <ConfirmationModal {...deleteConfirmationProps} />

      <ConfirmationModal
        visible={showDeleteModal}
        icon="trash-outline"
        description={t("confirmation.deleteThread")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteModal}
      />
    </SafeAreaView>
  );
}
