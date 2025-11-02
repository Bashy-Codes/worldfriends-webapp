import { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { DiscussionsTypes } from "@/types/discussions";
import { formatTimeAgo } from "@/utils/formatTime";
import NameContainer from "@/components/ui/NameContainer";
import { useTranslation } from "react-i18next";

interface DiscussionCardProps {
  discussion: DiscussionsTypes;
  onPress: (discussion: DiscussionsTypes) => void;
  onOptionsPress: (discussion: DiscussionsTypes) => void;
}

export const DiscussionCard: FC<DiscussionCardProps> = ({
  discussion,
  onPress,
  onOptionsPress,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 16,
      margin: 12,
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
    optionsButton: {
      padding: 8,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.full,
    },
    title: {
      fontSize: 26,
      fontWeight: "600",
      color: theme.colors.text
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    repliesContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    repliesText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginRight: 12,
    }
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(discussion)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Image
          source={{ uri: discussion.discussionAuthor.profilePicture }}
          style={styles.profileImage}
          contentFit="cover"
          priority="normal"
          cachePolicy="memory"
          placeholder="@/assets/images/user.png"
          placeholderContentFit="scale-down"
        />
        <View style={styles.userInfo}>
          <NameContainer
            name={discussion.discussionAuthor.name}
            isPremiumUser={discussion.discussionAuthor.isPremiumUser}
            size={16}
            style={{ margin: 0, justifyContent: "flex-start" }}
          />
          <View style={styles.timeContainer}>
            <Ionicons name="time" size={12} color={theme.colors.success} />
            <Text style={styles.timeText}>{formatTimeAgo(discussion.createdAt, t)}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => onOptionsPress(discussion)}
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {discussion.title}
      </Text>

      <View style={styles.footer}>
        <View style={styles.repliesContainer}>
          <Text style={styles.repliesText}>
            {discussion.repliesCount}
          </Text>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={theme.colors.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};