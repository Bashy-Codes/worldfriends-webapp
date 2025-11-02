import React, { useMemo } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/lib/Theme";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import NameContainer from "@/components/ui/NameContainer";
import { Id } from "@/convex/_generated/dataModel";
import { router } from "expo-router";

interface ConversationHeaderProps {
  otherUser: {
    userId: Id<"users">;
    name: string;
    profilePicture: string;
    isPremiumUser: boolean;
  };
  onBackPress: () => void;
}

export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  otherUser,
  onBackPress,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const hanldeUserPress = () => {
    router.push(`/screens/user-profile/${otherUser.userId}`)
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: theme.colors.surface,
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomLeftRadius: theme.borderRadius.xl,
          borderBottomRightRadius: theme.borderRadius.xl,
        },
        leftSection: {
          flexDirection: "row",
          alignItems: "center",
          flex: 1,
        },
        backButton: {
          padding: 8,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.background,
          marginRight: 12,
        },
        profileSection: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        },
        profilePicture: {
          marginRight: 12,
          borderWidth: 1.5,
          borderColor: theme.colors.border,
          borderRadius: theme.borderRadius.full,
          overflow: "hidden",
        },
        userInfo: {
          flex: 1,
        }
      }),
    [theme, insets.top],
  );

  return (
    <View style={styles.container}>
      {/* Left Section - Back Button and Profile */}
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={theme.colors.text}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.profileSection} onPress={hanldeUserPress} activeOpacity={0.9}>
          <View style={styles.profilePicture}>
            <ProfilePhoto
              profilePicture={otherUser.profilePicture}
              size={46}
            />
          </View>

          <View style={styles.userInfo}>
            <NameContainer
              name={otherUser.name}
              isPremiumUser={otherUser.isPremiumUser}
              size={20}
              style={{ margin: 0, justifyContent: "flex-start" }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};