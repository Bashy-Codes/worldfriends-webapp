import { FC, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { type ReactionTypes } from "@/types/feed";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { formatTimeAgo } from "@/utils/formatTime";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import { FlashList } from "@shopify/flash-list";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "../ui/Button";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface ReactionsModalProps {
  visible: boolean;
  postId: Id<"posts">;
  onClose: () => void;
}

const UserItem: FC<{ reaction: ReactionTypes }> = ({ reaction }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: theme.borderRadius.lg
    },
    profileImage: {
      marginRight: 12,
    },
    userInfo: {
      flex: 1,
    },
    userNameContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 2,
    },
    userName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginRight: 6,
    },
    timeText: {
      fontSize: 12,
      color: theme.colors.textMuted,
      fontWeight: "500",
    },
    reactionContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
    },
    emojiText: {
      fontSize: 18,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <ProfilePhoto
        profilePicture={reaction.reactionAuthor.profilePicture || undefined}
        size={50}
        style={styles.profileImage}
      />
      <View style={styles.userInfo}>
        <View style={styles.userNameContainer}>
          <Text style={styles.userName} numberOfLines={1}>
            {reaction.reactionAuthor.name}
          </Text>
        </View>
        <Text style={styles.timeText}>{formatTimeAgo(reaction.createdAt, t)}</Text>
      </View>
      <View style={styles.reactionContainer}>
        <Text style={styles.emojiText}>{reaction.emoji}</Text>
      </View>
    </View>
  );
};

export const ReactionsModal: React.FC<ReactionsModalProps> = ({
  visible,
  postId,
  onClose,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    results: reactions,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.feed.interactions.getPostReactions,
    visible ? { postId } : "skip",
    { initialNumItems: 10 },
  );

  const areReactionsLoading = status === "LoadingFirstPage";

  const handleLoadMore = useCallback(() => {
    if (status === "CanLoadMore") {
      loadMore(10);
    }
  }, [status, loadMore]);

  const renderUserItem = useCallback(
    ({ item }: { item: ReactionTypes }) => <UserItem reaction={item} />,
    [],
  );

  const renderLoader = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  const renderEmptyState = () => (
    <EmptyState style={{ flex: 1, minHeight: 300 }} />
  );

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      backgroundColor: theme.colors.surface,
      width: screenWidth * 0.9,
      height: screenHeight * 0.8,
      maxWidth: 500,
      maxHeight: 700,
      borderRadius: theme.borderRadius.xl,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 20,
      overflow: "hidden",
    },
    actionsContainer: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
    },
    content: {
      flex: 1,
      paddingTop: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.content}>
            {areReactionsLoading ? (
              renderLoader()
            ) : (
              <FlashList
                data={reactions}
                keyExtractor={(item) => item.reactionId}
                renderItem={renderUserItem}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={{
                  paddingVertical: 8,
                }}
              />
            )}
          </View>
          <View style={styles.actionsContainer}>
            <Button iconName="close" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};
