import React, { memo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/lib/Theme";

interface GiftCardProps {
  title: string;
  onPress: () => void;
}

const GiftCardComponent: React.FC<GiftCardProps> = ({ title, onPress }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 16,
      marginBottom: 16,
    },
    image: {
      width: "100%",
      height: 120,
      borderRadius: theme.borderRadius.md,
      marginBottom: 24,
    },
    title: {
      padding: 12,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      textAlign: "center",
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: "https://storage.worldfriends.app/gift-icon" }}
        style={styles.image}
        contentFit="contain"
        transition={{ duration: 300, effect: "cross-dissolve" }}
      />
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const GiftCard = memo(GiftCardComponent);