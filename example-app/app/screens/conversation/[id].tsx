import { useCallback, useMemo, memo } from "react"
import { StyleSheet } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { useLocalSearchParams } from "expo-router"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/lib/Theme"
import { useConversation } from "@/hooks/conversations/useConversation"
import { useMessages } from "@/hooks/conversations/useMessages"
import type { MessageData } from "@/types/conversations"
import { shouldShowTimeSeparator, formatTimeSeparator } from "@/utils/chatTimeFormat"

// components
import { KeyboardHandler } from "@/components/KeyboardHandler"
import { ConfirmationModal } from "@/components/common/ConfirmationModal"
import { EmptyState } from "@/components/EmptyState"
import { ConversationHeader } from "@/components/conversations/ConversationHeader"
import { MessageBubble } from "@/components/conversations/MessageBubble"
import { MessageInput } from "@/components/conversations/MessageInput"
import { TimeSeparator } from "@/components/conversations/TimeSeparator"
import { ActionModal } from "@/components/conversations/ActionModal"
import { ScreenLoading } from "@/components/ScreenLoading"

type ListItem = {
  type: "message" | "timeSeparator"
  id: string
  data: MessageData | string
}

const MessageItemMemo = memo(
  ({
    item,
    onLongPress,
  }: {
    item: MessageData
    onLongPress: (message: MessageData) => void
  }) => <MessageBubble message={item} onLongPress={onLongPress} />,
)

const TimeSeparatorMemo = memo(({ text }: { text: string }) => <TimeSeparator text={text} />)

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const theme = useTheme()
  const { t } = useTranslation()

  const conversationGroupId = (id as string) || ""

  const { messages, isLoading, loadOlderMessages, hasOlderMessages } = useMessages(conversationGroupId)

  const {
    conversationInfo,
    selectedMessage,
    replyingTo,
    isLoadingConversation,
    isSending,
    error,
    actionModalVisible,
    deleteMessageModalVisible,
    flashListRef,
    handleBackPress,
    handleMessageLongPress,
    handleReply,
    handleDeleteMessage,
    handleSendMessage,
    handleSendImage,
    setActionModalVisible,
    setDeleteMessageModalVisible,
    confirmDeleteMessage,
    cancelReply,
  } = useConversation(conversationGroupId)

  // This creates a flat list with both messages and time separators
  const listData = useMemo(() => {
    const reversedMessages = [...messages].reverse()
    const items: ListItem[] = []

    reversedMessages.forEach((message, index) => {
      const previousMessage = index > 0 ? reversedMessages[index - 1] : undefined
      const showTimeSeparator = shouldShowTimeSeparator(message, previousMessage)

      // Add time separator if needed
      if (showTimeSeparator) {
        items.push({
          type: "timeSeparator",
          id: `separator-${message.messageId}`,
          data: formatTimeSeparator(message.createdAt, t),
        })
      }

      // Add message
      items.push({
        type: "message",
        id: message.messageId,
        data: message,
      })
    })

    return items
  }, [messages])

  // Important for preventing glitches when scrolling upwards
  const keyExtractor = useCallback((item: ListItem) => item.id, [])

  // This helps FlashList optimize rendering for different item types
  const getItemType = useCallback((item: ListItem) => item.type, [])

  const handleStartReached = useCallback(() => {
    if (hasOlderMessages && !isLoading) {
      console.log("[v0] Loading older messages from top...")
      loadOlderMessages()
    }
  }, [hasOlderMessages, isLoading, loadOlderMessages])

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "timeSeparator") {
        return <TimeSeparatorMemo text={item.data as string} />
      }

      return <MessageItemMemo item={item.data as MessageData} onLongPress={handleMessageLongPress} />
    },
    [handleMessageLongPress],
  );

  const contentContainerStyle = useMemo(
    () => ({
      paddingVertical: 16,
    }),
    [],
  )

  const maintainVisibleConfig = useMemo(
    () => ({
      autoscrollToBottomThreshold: 0.3,
      startRenderingFromBottom: true,
      animateAutoScrollToBottom: true,
    }),
    [],
  )

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  })

  if (!id) {
    return <EmptyState style={{ flex: 1 }} />
  }

  // Show loading state when either conversation info or initial messages are loading
  if (isLoadingConversation || (isLoading && messages.length === 0)) {
    return <ScreenLoading />
  }

  if (error || !conversationInfo) {
    return <EmptyState style={{ flex: 1 }} />
  }

  return (
    <KeyboardHandler enabled={true} style={styles.container}>
      {/* Header */}
      <ConversationHeader
        otherUser={conversationInfo.otherUser}
        onBackPress={handleBackPress}
      />

      {/* Messages List */}
      <FlashList
        ref={flashListRef}
        contentContainerStyle={contentContainerStyle}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        onStartReached={handleStartReached}
        onStartReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        maintainVisibleContentPosition={maintainVisibleConfig}
        drawDistance={500}
      />

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        replyingTo={replyingTo}
        onCancelReply={cancelReply}
        isSending={isSending}
        messagePlaceholder={t("common.typeMessage")}
      />

      {/* Action Modal for message actions */}
      <ActionModal
        visible={actionModalVisible}
        message={selectedMessage}
        onReply={handleReply}
        onDelete={handleDeleteMessage}
        onClose={() => setActionModalVisible(false)}
      />

      {/* Delete Message Confirmation Modal */}
      <ConfirmationModal
        visible={deleteMessageModalVisible}
        icon="trash-outline"
        iconColor={theme.colors.error}
        description={t("confirmation.deleteMessage")}
        confirmButtonColor={theme.colors.error}
        onConfirm={confirmDeleteMessage}
        onCancel={() => setDeleteMessageModalVisible(false)}
      />
    </KeyboardHandler>
  )
}