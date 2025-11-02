import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/lib/Theme";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export const CommunityCardSkeleton: React.FC = () => {
  const theme = useTheme();

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
    },
    content: {
      padding: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    title: {
      width: "60%",
      height: 20,
      borderRadius: 4,
    },
    chipsContainer: {
      flexDirection: "row",
      gap: 6,
    },
    chip: {
      width: 32,
      height: 24,
      borderRadius: theme.borderRadius.sm,
    },
    chipLarge: {
      width: 60,
      height: 24,
      borderRadius: theme.borderRadius.sm,
    },
  });

  return (
    <View style={styles.container}>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={styles.banner}
        shimmerColors={[
          theme.colors.surfaceSecondary,
          theme.colors.surface,
          theme.colors.surfaceSecondary,
        ]}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={styles.title}
            shimmerColors={[
              theme.colors.surfaceSecondary,
              theme.colors.surface,
              theme.colors.surfaceSecondary,
            ]}
          />
          <View style={styles.chipsContainer}>
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={styles.chip}
              shimmerColors={[
                theme.colors.surfaceSecondary,
                theme.colors.surface,
                theme.colors.surfaceSecondary,
              ]}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={styles.chipLarge}
              shimmerColors={[
                theme.colors.surfaceSecondary,
                theme.colors.surface,
                theme.colors.surfaceSecondary,
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
