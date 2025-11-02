import type React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/lib/Theme";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export const LetterCardSkeleton: React.FC = () => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 6,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    profileImage: {
      width: 48,
      height: 48,
      borderRadius: 24,
    },
    userInfo: {
      flex: 1,
      marginLeft: 12,
    },
    flag: {
      width: 80,
      height: 80,
      borderRadius: 16,
    },
    userName: {
      width: "60%",
      height: 16,
      borderRadius: 8,
      marginBottom: 4,
    },
    userDetails: {
      width: "40%",
      height: 12,
      borderRadius: 8,
    },
    title: {
      width: "85%",
      height: 14,
      borderRadius: 8,
      marginBottom: 6,
    },
    titleSecondLine: {
      width: "65%",
      height: 14,
      borderRadius: 8,
      marginBottom: 12,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    statusText: {
      width: 36,
      height: 32,
      borderRadius: 8,
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
    },
    actionButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginLeft: 8,
    },
  });

  const shimmerColors = [
    theme.colors.surfaceSecondary,
    theme.colors.border,
    theme.colors.surfaceSecondary,
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ShimmerPlaceholder
          shimmerColors={shimmerColors}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <ShimmerPlaceholder
            shimmerColors={shimmerColors}
            style={styles.userName}
          />
          <ShimmerPlaceholder
            shimmerColors={shimmerColors}
            style={styles.userDetails}
          />
        </View>
        <ShimmerPlaceholder
          shimmerColors={shimmerColors}
          style={styles.flag}
        />
      </View>

      <ShimmerPlaceholder shimmerColors={shimmerColors} style={styles.title} />
      <ShimmerPlaceholder
        shimmerColors={shimmerColors}
        style={styles.titleSecondLine}
      />

      <View style={styles.footer}>
        <ShimmerPlaceholder
          shimmerColors={shimmerColors}
          style={styles.statusText}
        />
        <View style={styles.actions}>
          <ShimmerPlaceholder
            shimmerColors={shimmerColors}
            style={styles.actionButton}
          />
        </View>
      </View>
    </View>
  );
};
