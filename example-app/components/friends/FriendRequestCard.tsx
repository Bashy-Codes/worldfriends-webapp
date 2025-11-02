import { memo, useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useMutation } from "convex/react";
import { useTheme } from "@/lib/Theme";
import { getCountryByCode } from "@/constants/geographics";
import type { Friend, Request } from "@/types/friendships";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/Button";
import AgeGenderChip from "../ui/AgeGenderChip";
import NameContainer from "../ui/NameContainer";
import ProfilePhoto from "../ui/ProfilePhoto";

interface FriendRequestCardProps {
  data: Friend | Request;
  type: "friend" | "request";
  onPress?: () => void;
}

const FriendRequestCardComponent: React.FC<FriendRequestCardProps> = ({
  data,
  type,
  onPress,
}) => {
  const theme = useTheme();
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);

  const createConversationMutation = useMutation(
    api.conversations.mutations.createConversation,
  );

  const country = getCountryByCode(data.country);

  const handleMessage = useCallback(async () => {
    if (isCreatingConversation || type !== "friend") return;

    try {
      setIsCreatingConversation(true);
      const friend = data as Friend;
      const conversationId = await createConversationMutation({
        otherUserId: friend.userId,
      });
      router.push(`/screens/conversation/${conversationId}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    } finally {
      setIsCreatingConversation(false);
    }
  }, [data, type, createConversationMutation, isCreatingConversation]);

  const handleCardPress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 20,
      marginHorizontal: 16,
      marginVertical: 8,
      alignItems: "center",
    },
    countryContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.full,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    flagEmoji: {
      fontSize: 14,
      marginRight: 8,
    },
    countryText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "600",
    },
    buttonsContainer: {
      flexDirection: "row",
      width: "100%",
      gap: 12,
    },
  });

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      activeOpacity={0.8}
      style={styles.card}
    >
      <ProfilePhoto
        profilePicture={data.profilePicture}
        size={100}
      />
      <NameContainer
        name={data.name}
        isPremiumUser={data.isPremiumUser}
        size={28}
      />
      <AgeGenderChip
        size="medium"
        gender={data.gender}
        age={data.age}
      />

      <View style={styles.countryContainer}>
        <Text style={styles.flagEmoji}>{country?.flag}</Text>
        <Text style={styles.countryText}>{country?.name}</Text>
      </View>

      {type === "friend" && (
        <View style={styles.buttonsContainer}>
          <Button
            iconName="chatbubble-ellipses"
            onPress={handleMessage}
            style={{ flex: 1 }}
            loading={isCreatingConversation}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const FriendRequestCard = memo(FriendRequestCardComponent);