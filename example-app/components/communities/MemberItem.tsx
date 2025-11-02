import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import { Id } from "@/convex/_generated/dataModel";
import { getCountryByCode } from "@/constants/geographics";
import NameContainer from "../ui/NameContainer";

interface MemberItemProps {
  userId: Id<"users">;
  profilePicture: string;
  name: string;
  gender: "male" | "female" | "other";
  age: number;
  country: string;
  isPremiumUser: boolean;
  onPress: (userId: Id<"users">) => void;
  isAdmin?: boolean;
  onRemove?: (userId: Id<"users">) => void;
}

export const MemberItem: React.FC<MemberItemProps> = ({
  userId,
  profilePicture,
  name,
  gender,
  age,
  country,
  isPremiumUser = false,
  onPress,
  isAdmin = false,
  onRemove,
}) => {
  const theme = useTheme();

  const getGenderIcon = () => {
    switch (gender) {
      case "male":
        return "male";
      case "female":
        return "female";
      default:
        return "male-female";
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      marginBottom: 4,
      borderRadius: theme.borderRadius.lg,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      overflow: "hidden",
    },
    pressable: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    profileSection: {
      marginRight: 12,
    },
    contentSection: {
      flex: 1,
      justifyContent: "center",
    },
    nameSection: {
      margin: 0,
      marginBottom: 4,
      justifyContent: "flex-start",
    },
    infoContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    infoText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    removeButton: {
      padding: 8,
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pressable}
        onPress={() => onPress(userId)}
        activeOpacity={0.7}
      >
        <View style={styles.profileSection}>
          <ProfilePhoto profilePicture={profilePicture} size={56} style={{ borderWidth: 1.5, borderColor: theme.colors.primary }} />
        </View>

        <View style={styles.contentSection}>
          <NameContainer
            name={name}
            isPremiumUser={isPremiumUser}
            size={20}
            style={styles.nameSection}
          />
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>{age}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons
                name={getGenderIcon()}
                size={14}
                color={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>{getCountryByCode(country)?.flag}</Text>
            </View>
          </View>
        </View>

        {isAdmin && onRemove && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(userId)}
            activeOpacity={0.7}
          >
            <Ionicons
              name="close-circle"
              size={24}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};