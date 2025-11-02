import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/lib/Theme";

interface CommunitiesHeaderProps {
  text: string;
  bannerUrl?: string | null;
  contentFit?: "contain" | "cover";
}

export const CommunitiesHeader: React.FC<CommunitiesHeaderProps> = ({
  text,
  bannerUrl,
  contentFit = "contain",
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginVertical: 16,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: 150,
    },
    textContainer: {
      backgroundColor: theme.colors.surfaceSecondary,
      padding: 16,
      alignItems: "center",
    },
    text: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: bannerUrl || "https://storage.worldfriends.app/community.png" }}
        style={styles.image}
        contentFit={contentFit}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};