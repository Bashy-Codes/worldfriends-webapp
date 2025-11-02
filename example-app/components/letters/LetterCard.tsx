import { FC, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { ActionModal, ActionModalRef } from "@/components/common/ActionModal";
import { useTranslation } from "react-i18next";
import AgeGenderChip from "../ui/AgeGenderChip";
import ProfilePhoto from "../ui/ProfilePhoto";
import NameContainer from "../ui/NameContainer";
import { Id } from "@/convex/_generated/dataModel";

interface LetterCardProps {
  letter: {
    letterId: Id<"letters">;
    title: string;
    createdAt: number;
    status: "pending" | "delivered";
    sender?: {
      userId: string;
      name: string;
      profilePicture: string;
      gender: "male" | "female" | "other";
      age: number;
      country: string;
      isPremiumUser: boolean;
    };
    recipient?: {
      userId: string;
      name: string;
      profilePicture: string;
      gender: "male" | "female" | "other";
      age: number;
      country: string;
      isPremiumUser: boolean;
    };
  };
  onDelete: (letterId: Id<"letters">) => void;
  onOpen: (letterId: Id<"letters">) => void;
}

export const LetterCard: FC<LetterCardProps> = ({
  letter,
  onDelete,
  onOpen,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  // refs
  const actionModalRef = useRef<ActionModalRef>(null);

  // Determine if this is a received or sent letter
  const isReceived = !!letter.sender;
  const displayUser = isReceived ? letter.sender! : letter.recipient!;

  const getStatusIcon = () => {
    if (isReceived) {
      return "truck-delivery";
    } else {
      return letter.status === "delivered" ? "truck-check" : "truck-fast";
    }
  };

  const getStatusColor = () => {
    if (isReceived) {
      return theme.colors.success;
    } else {
      return letter.status === "delivered" ? theme.colors.success : theme.colors.textMuted;
    }
  };

  const handleOptionsPress = () => {
    actionModalRef.current?.present();
  };

  const handleDeletePress = () => {
    onDelete(letter.letterId);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    userInfo: {
      flex: 1,
    },
    userDetails: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
      lineHeight: 30,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    statusContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    statusIcon: {
      marginRight: 6,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      padding: 8,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surfaceSecondary,
      marginLeft: 8,
    },
    deleteButton: {
      backgroundColor: theme.colors.surfaceSecondary,
    },
    optionsButton: {
      padding: 8,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surfaceSecondary,
    },
  });

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onOpen(letter.letterId)}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <ProfilePhoto profilePicture={displayUser.profilePicture} size={70} />
          <View style={styles.userInfo}>
            <NameContainer
              name={displayUser.name}
              size={20}
              isPremiumUser={displayUser.isPremiumUser}
              style={{ margin: 10, justifyContent: "flex-start" }}
            />
            <AgeGenderChip
              size="small"
              gender={displayUser.gender}
              age={displayUser.age}
              style={{ justifyContent: "flex-start", marginLeft: 10 }}
            />
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {letter.title}
        </Text>

        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons
              name={getStatusIcon()}
              size={26}
              color={getStatusColor()}
              style={styles.statusIcon}
            />
          </View>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={handleOptionsPress}
            activeOpacity={0.9}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <ActionModal
        ref={actionModalRef}
        options={[
          {
            id: "delete",
            title: t("actions.deleteLetter"),
            icon: "trash-outline",
            color: theme.colors.error,
            onPress: handleDeletePress,
          },
        ]}
      />
    </>
  );
};
