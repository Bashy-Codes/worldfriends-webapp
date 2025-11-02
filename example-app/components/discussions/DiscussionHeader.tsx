import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import NameContainer from "@/components/ui/NameContainer";
import { formatTimeAgo } from "@/utils/formatTime";
import { DiscussionTypes } from "@/types/discussions";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface DiscussionHeaderProps {
  discussion: DiscussionTypes;
  onImagePress: () => void;
}

export const DiscussionHeader: FC<DiscussionHeaderProps> = ({ discussion, onImagePress }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
    },
    authorInfo: {
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
    content: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 12,
      letterSpacing: 0.3,
    },
    description: {
      fontSize: 15,
      color: theme.colors.textMuted,
      lineHeight: 22,
    },
    image: {
      width: "100%",
      height: 300,
      backgroundColor: theme.colors.border,
    },
  });

  return (
    <View>
      <View style={styles.header}>
        <ProfilePhoto
          profilePicture={discussion.discussionAuthor.profilePicture}
          size={52}
          style={{ borderWidth: 1.5, borderColor: theme.colors.primary }}
        />
        <View style={styles.authorInfo}>
          <NameContainer
            name={discussion.discussionAuthor.name}
            isPremiumUser={discussion.discussionAuthor.isPremiumUser}
            size={18}
            style={{ margin: 0, justifyContent: "flex-start" }}
          />
          <View style={styles.timeContainer}>
            <Ionicons
              name="time"
              size={12}
              color={theme.colors.success}
            />
            <Text style={styles.timeText}>
              {formatTimeAgo(discussion.createdAt, t)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{discussion.title}</Text>
        <Text style={styles.description}>{discussion.content}</Text>
      </View>

      {discussion.imageUrl && (
        <TouchableOpacity activeOpacity={0.9} onPress={onImagePress}>
          <Image source={{ uri: discussion.imageUrl }} style={styles.image} contentFit="cover" placeholder={"@/assets/images/photo.png"} />
        </TouchableOpacity>
      )}
    </View>
  );
};
