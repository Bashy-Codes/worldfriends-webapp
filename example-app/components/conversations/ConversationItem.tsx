import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import NameContainer from "@/components/ui/NameContainer";
import { formatTimeAgo } from "@/utils/formatTime";
import { ConversationData } from "@/types/conversations";
import { useTranslation } from "react-i18next";

interface ConversationItemProps {
  conversation: ConversationData;
  onPress: (conversationGroupId: string) => void;
  onLongPress?: (conversation: ConversationData) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
  onLongPress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  // Get message preview with type prefix
  const getMessagePreview = () => {
    if (!conversation.lastMessage) return "...";

    const { lastMessage } = conversation;
    const prefix = lastMessage.isOwner ? "You: " : `${conversation.otherUser.name}: `;

    if (lastMessage.type === "image") {
      return (
        <>
          <Text style={{ color: theme.colors.primary }}>{prefix}</Text>
          <Ionicons name="image" size={14} color={theme.colors.textSecondary} />
        </>
      );
    }

    if (lastMessage.replyParentId) {
      return (
        <>
          <Text style={{ color: theme.colors.primary }}>{prefix}</Text>
          <Text>↩️ {lastMessage.content || ""}</Text>
        </>
      );
    }

    return (
      <>
        <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: "600" }}>{prefix}</Text>
        <Text>{lastMessage.content || ""}</Text>
      </>
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: 8,
      marginBottom: 4,
      borderRadius: theme.borderRadius.lg,
    },
    pressable: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    profileSection: {
      position: "relative",
      marginRight: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
      borderRadius: 100
    },
    contentSection: {
      flex: 1,
      justifyContent: "center"
    },

    messagePreview: {
      fontSize: 14,
      color: conversation.hasUnreadMessages
        ? theme.colors.text
        : theme.colors.textSecondary,
      fontWeight: conversation.hasUnreadMessages ? "500" : "400",
      flex: 1,
      marginRight: 8,
    },
    timestamp: {
      fontSize: 12,
      color: theme.colors.textMuted,
      fontWeight: "500",
    },
    rightSection: {
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 52,
      paddingVertical: 4,
    },
    unreadIndicator: {
      marginBottom: 4,
      width: 10,
      height: 10,
      borderRadius: 6,
      backgroundColor: theme.colors.notification,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pressable}
        onPress={() => onPress(conversation.conversationGroupId)}
        onLongPress={() => onLongPress?.(conversation)}
        activeOpacity={0.7}
        delayLongPress={500}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <ProfilePhoto
            profilePicture={conversation.otherUser.profilePicture}
            size={52}
          />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <NameContainer
            name={conversation.otherUser.name}
            isPremiumUser={conversation.otherUser.isPremiumUser}
            size={18}
            style={{ margin: 0, paddingTop: 3, justifyContent: "flex-start" }}
          />
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <Text
              style={styles.messagePreview}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {getMessagePreview()}
            </Text>
          </View>
        </View>

        {/* Right Section - Vertical Stack */}
        <View style={styles.rightSection}>
          <Text style={styles.timestamp}>
            {formatTimeAgo(conversation.lastMessageTime, t)}
          </Text>
          {conversation.hasUnreadMessages && (
            <View style={styles.unreadIndicator} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
