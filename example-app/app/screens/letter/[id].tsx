import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { useLetter } from "@/hooks/letters/useLetter";
import { Id } from "@/convex/_generated/dataModel";
import { getCountryByCode } from "@/constants/geographics";
import { useTranslation } from "react-i18next";

// components
import { ScreenHeader } from "@/components/ScreenHeader";
import { ScreenLoading } from "@/components/ScreenLoading";
import { EmptyState } from "@/components/EmptyState";
import { formatTimeAgo } from "@/utils/formatTime";


export default function LetterDetailScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const letterId = id as Id<"letters">;

  const {
    letter,
    isLoading,
    hasError,
  } = useLetter(letterId);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    deliverySection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 20,
      marginBottom: 16,
    },
    deliveryIconContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    infoGrid: {
      flexDirection: "column",
      gap: 12,
      marginBottom: 16,
    },
    infoCard: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    infoIcon: {
      marginRight: 16,
    },
    infoValueRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    infoValue: {
      fontSize: 15,
      color: theme.colors.text,
      fontWeight: "600",
      lineHeight: 20,
    },
    letterSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 20,
      marginBottom: 16,
    },
    readerIcon: {
      alignSelf: "center",
      marginBottom: 16,
    },
    letterTitle: {
      textAlign: "center",
      fontSize: 24,
      fontWeight: "700",
      textTransform: "capitalize",
      color: theme.colors.text,
      lineHeight: 32,
      marginBottom: 32
    },
    letterContent: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 24,
    },
  });

  if (isLoading) {
    return <ScreenLoading />;
  }

  if (hasError || !letter) {
    return (
      <EmptyState style={{ flex: 1 }} />
    );
  }

  const country = getCountryByCode(letter.otherUser.country);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title={t("screenTitles.letter")} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Delivery Details */}
        <View style={styles.deliverySection}>
          <View style={styles.deliveryIconContainer}>
            <MaterialCommunityIcons
              name={letter.status === "delivered" ? "truck-check" : "truck-fast"}
              size={76}
              color={letter.status === "delivered" ? theme.colors.success : theme.colors.primary}
            />
          </View>

          {/* Info Cards - Column Layout */}
          <View style={styles.infoGrid}>
            {/* User Card */}
            <View style={styles.infoCard}>
              <Ionicons
                name={letter.isSender ? "paper-plane" : "arrow-forward-outline"}
                size={24}
                color={theme.colors.primary}
                style={styles.infoIcon}
              />
              <View style={styles.infoValueRow}>
                <Text style={styles.infoValue}>
                  {letter.otherUser.name}
                </Text>
              </View>
            </View>

            {/* Time Card */}
            <View style={styles.infoCard}>
              <Ionicons
                name="time"
                size={24}
                color={theme.colors.info}
                style={styles.infoIcon}
              />
              <View style={styles.infoValueRow}>
                <Text style={styles.infoValue}>
                  {formatTimeAgo(letter.createdAt, t)}
                </Text>
              </View>
            </View>

            {/* Country Card */}
            <View style={styles.infoCard}>
              <Ionicons
                name="location"
                size={24}
                color={theme.colors.error}
                style={styles.infoIcon}
              />
              <View style={styles.infoValueRow}>
                <Text style={styles.infoValue}>{`${country?.name}  ${country?.flag}`}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Letter Content */}
        <View style={styles.letterSection}>
          <Ionicons name="mail-open" size={76} color={theme.colors.primary} style={styles.readerIcon} />
          <Text style={styles.letterTitle}>{letter.title}</Text>
          <Text style={styles.letterContent}>{letter.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}