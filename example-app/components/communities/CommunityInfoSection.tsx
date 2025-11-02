import { FC } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/lib/Theme";
import { CommunityInfo } from "@/types/communities";
import ProfilePhoto from "@/components/ui/ProfilePhoto";
import { getLanguageByCode } from "@/constants/geographics";
import { useTranslation } from "react-i18next";

interface CommunityInfoSectionProps {
  community: CommunityInfo;
}

export const CommunityInfoSection: FC<CommunityInfoSectionProps> = ({
  community,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 3,
    },
    bannerContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginBottom: 16,
      overflow: "hidden",
    },
    banner: {
      width: "100%",
      height: 150,
    },
    titleContainer: {
      backgroundColor: theme.colors.surfaceSecondary,
      padding: 16,
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    adminContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    adminInfo: {
      marginLeft: 12,
    },
    adminName: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    adminLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
      paddingBottom: 12,
      borderBottomWidth: 2,
      borderBottomColor: theme.colors.border,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    ruleItem: {
      flexDirection: "row",
      marginBottom: 8,
      marginLeft: 12,
    },
    bullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.primary,
      marginRight: 8,
      marginTop: 7,
    },
    ruleText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 6 }}>
      <View style={styles.content}>
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: community.bannerUrl || "https://storage.worldfriends.app/community.png" }}
            style={styles.banner}
            contentFit="cover"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{community.title}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("communities.infoSection.description")}</Text>
          <Text style={styles.description}>{community.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("communities.infoSection.info.title")}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("communities.infoSection.info.language")}</Text>
            <Text style={styles.infoValue}>{getLanguageByCode(community.language)?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("communities.infoSection.info.ageGroup")}</Text>
            <Text style={styles.infoValue}>{community.ageGroup}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("communities.infoSection.info.gender")}</Text>
            <Text style={styles.infoValue}>
              {community.gender === "all" ? "All Genders" : community.gender}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("communities.infoSection.rules")}</Text>
          {community.rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <View style={styles.bullet} />
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("communities.infoSection.admin")}</Text>
          <View style={styles.adminContainer}>
            <ProfilePhoto
              profilePicture={community.communityAdmin.profilePicture || undefined}
              size={48}
            />
            <View style={styles.adminInfo}>
              <Text style={styles.adminName}>{community.communityAdmin.name}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};