import { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { Community } from "@/types/communities";
import { getLanguageByCode } from "@/constants/geographics";

interface CommunityCardProps {
  community: Community;
  onPress: (community: Community) => void;
}

export const CommunityCard: FC<CommunityCardProps> = ({
  community,
  onPress,
}) => {
  const theme = useTheme();

  const getGenderIcon = () => {
    switch (community.gender) {
      case "male":
        return "male";
      case "female":
        return "female";
      case "all":
        return "people";
      default:
        return "male-female";
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      margin: 10,
      overflow: "hidden",
    },
    banner: {
      width: "100%",
      height: 120,
      backgroundColor: theme.colors.surfaceSecondary,
    },
    content: {
      padding: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    chipsContainer: {
      flexDirection: "row",
      gap: 6,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      flex: 1,
      marginRight: 8,
    },
    chip: {
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.colors.primary + "30",
    },
    genderChip: {
      backgroundColor: theme.colors.primary + "15",
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.colors.primary + "30",
      alignItems: "center",
      justifyContent: "center",
    },
    chipText: {
      fontSize: 12,
      color: theme.colors.text,
      fontWeight: "500",
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(community)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: community.bannerUrl || "https://storage.worldfriends.app/community" }}
        style={styles.banner}
        contentFit="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {community.title}
          </Text>
          <View style={styles.chipsContainer}>
            <View style={styles.genderChip}>
              <Ionicons
                name={getGenderIcon()}
                size={14}
                color={theme.colors.text}
              />
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {getLanguageByCode(community.language)?.name || community.language}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};