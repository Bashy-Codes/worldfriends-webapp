import { useState, memo, FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { formatTimeAgo } from "@/utils/formatTime";
import NameContainer from "@/components/ui/NameContainer";
import { useTranslation } from "react-i18next";

interface Author {
  name: string;
  profilePicture: string;
  isPremiumUser: boolean;
}

interface Reply {
  id: string;
  content: string;
  author: Author;
  createdAt: number;
  isOwner: boolean;
}

export interface ThreadItemProps {
  id: string;
  content: string;
  author: Author;
  createdAt: number;
  isOwner: boolean;
  hasReply: boolean;
  reply?: Reply;
  onDelete: (id: string) => void;
  onReply: () => void;
}

export const ThreadItem: FC<ThreadItemProps> = memo(({
  id,
  content,
  author,
  createdAt,
  isOwner,
  hasReply,
  reply,
  onDelete,
  onReply
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [isReplyExpanded, setIsReplyExpanded] = useState(false);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      marginVertical: 6,
      borderRadius: 16,
      padding: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    profileImage: {
      width: 46,
      height: 46,
      borderRadius: theme.borderRadius.full,
      marginRight: 12,
      borderWidth: 1.6,
      borderColor: theme.colors.primary + "40",
    },
    userInfo: {
      flex: 1,
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    timeText: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    contentText: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text,
    },
    deleteButton: {
      padding: 8,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.background,
    },
    actionsContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 10,
      gap: 16,
    },
    actionButton: {
      backgroundColor: theme.colors.surfaceSecondary,
      padding: 10,
      borderRadius: theme.borderRadius.lg,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    actionText: {
      fontSize: 14,
      color: theme.colors.textMuted,
      fontWeight: "500",
    },
    replyContainer: {
      marginTop: 12,
      marginLeft: 20,
      position: "relative",
    },
    replyLinkLine: {
      position: "absolute",
      left: -15,
      top: -8,
      width: 15,
      height: 20,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderColor: theme.colors.primary + "60",
      borderBottomLeftRadius: 8,
    },
    replyItem: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary + "40",
    },
    replyHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    replyProfileImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: 8,
    },
    replyUserInfo: {
      flex: 1,
    },
    replyTimeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    replyTimeText: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    replyText: {
      fontSize: 14,
      lineHeight: 18,
      color: theme.colors.text,
    },
    replyDeleteButton: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: theme.borderRadius.full,
      padding: 6,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: author.profilePicture }}
          style={styles.profileImage}
          contentFit="cover"
          priority="normal"
          cachePolicy="memory"
          placeholder="@/assets/images/user.png"
          placeholderContentFit="scale-down"
        />
        <View style={styles.userInfo}>
          <NameContainer
            name={author.name}
            isPremiumUser={author.isPremiumUser}
            size={16}
            style={{ margin: 0, justifyContent: "flex-start" }}
          />
          <View style={styles.timeContainer}>
            <Ionicons name="time" size={12} color={theme.colors.success} />
            <Text style={styles.timeText}>{formatTimeAgo(createdAt, t)}</Text>
          </View>
        </View>
        {isOwner && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(id)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.contentText} selectable={true}>
        {content}
      </Text>

      <View style={styles.actionsContainer}>
        {hasReply ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsReplyExpanded(!isReplyExpanded)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isReplyExpanded ? "remove" : "add"}
              size={14}
              color={theme.colors.textMuted}
            />
            <Text style={styles.actionText}>
              {isReplyExpanded ? t("threads.hideReply") : t("threads.showReply")}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onReply}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-undo" size={14} color={theme.colors.textMuted} />
            <Text style={styles.actionText}>{t("threads.reply")}</Text>
          </TouchableOpacity>
        )}
      </View>

      {hasReply && reply && isReplyExpanded && (
        <View style={styles.replyContainer}>
          <View style={styles.replyLinkLine} />
          <View style={styles.replyItem}>
            <View style={styles.replyHeader}>
              <Image
                source={{ uri: reply.author.profilePicture }}
                style={styles.replyProfileImage}
              />
              <View style={styles.replyUserInfo}>
                <NameContainer
                  name={reply.author.name}
                  isPremiumUser={reply.author.isPremiumUser}
                  size={13}
                  style={{ margin: 0, justifyContent: "flex-start" }}
                />
                <View style={styles.replyTimeContainer}>
                  <Ionicons name="time" size={10} color={theme.colors.success} />
                  <Text style={styles.replyTimeText}>
                    {formatTimeAgo(reply.createdAt, t)}
                  </Text>
                </View>
              </View>
              {reply.isOwner && (
                <TouchableOpacity
                  style={styles.replyDeleteButton}
                  onPress={() => onDelete(reply.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={14} color={theme.colors.error} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.replyText}>{reply.content}</Text>
          </View>
        </View>
      )}
    </View>
  );
});