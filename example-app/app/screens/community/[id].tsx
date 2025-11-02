import { useCallback, useState, useMemo } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@/lib/Theme";
import { TabView, TabBar } from "react-native-tab-view";
import { useCommunity } from "@/hooks/communities/useCommunity";
import { Id } from "@/convex/_generated/dataModel";

// Components
import { ScreenHeader } from "@/components/ScreenHeader";
import { CommunityHomeSection } from "@/components/communities/CommunityHomeSection";
import { CommunityInfoSection } from "@/components/communities/CommunityInfoSection";
import { CommunityMembersSection } from "@/components/communities/CommunityMembersSection";
import { CommunityRequestsSection } from "@/components/communities/CommunityRequestsSection";
import { CommunitySettingsSection } from "@/components/communities/CommunitySettingsSection";
import { ScreenLoading } from "@/components/ScreenLoading";
import { EmptyState } from "@/components/EmptyState";
import { InputModal } from "@/components/common/InputModal";
import { ScreenPlaceholder } from "@/components/common/ScreenPlaceholder";
import { useTranslation } from "react-i18next";

export default function CommunityScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const layout = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const communityId = id as Id<"communities">;
  const [showInputModal, setShowInputModal] = useState(false);
  const [index, setIndex] = useState(0);

  const {
    community,
    isLoading,
    handleJoinCommunity,
    handleLeaveCommunity,
    handleDeleteCommunity,
    isJoining,
    isLeaving,
    isDeleting,
  } = useCommunity(communityId);

  const handleJoinPress = useCallback(() => {
    setShowInputModal(true);
  }, []);

  const handleSubmitRequest = useCallback((message: string) => {
    handleJoinCommunity(message);
    setShowInputModal(false);
  }, [handleJoinCommunity]);

  const routes = useMemo(() => {
    const baseRoutes = [
      { key: "home", title: t("sectionsTitles.home") },
      { key: "info", title: t("sectionsTitles.info") },
      { key: "members", title: t("sectionsTitles.members") },
    ];

    if (community?.isAdmin) {
      baseRoutes.push({ key: "requests", title: t("sectionsTitles.requests") });
    }

    if (community?.isMember) {
      baseRoutes.push({ key: "settings", title: t("sectionsTitles.settings") });
    }

    return baseRoutes;
  }, [community]);

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: theme.colors.primary }}
        style={{ backgroundColor: theme.colors.background }}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.textSecondary}
        labelStyle={{ fontWeight: "600", textTransform: "none", fontSize: 14 }}
        scrollEnabled
      />
    ),
    [theme]
  );

  const renderScene = useCallback(
    ({ route }: any) => {
      if (!community) return null;

      switch (route.key) {
        case "home":
          if (community.hasPendingRequest) {
            return (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                <Text style={{ fontSize: 16, color: theme.colors.text, textAlign: "center" }}>
                  {t("communities.pendingRequest")}
                </Text>
              </View>
            );
          }
          return (
            <CommunityHomeSection
              communityId={communityId}
              isMember={community.isMember}
              onJoinPress={handleJoinPress}
              isJoining={isJoining}
            />
          );
        case "info":
          return <CommunityInfoSection community={community} />;
        case "members":
          return (
            <CommunityMembersSection
              communityId={communityId}
              isMember={community.isMember}
              isAdmin={community.isAdmin}
            />
          );
        case "requests":
          return <CommunityRequestsSection communityId={communityId} />;
        case "settings":
          return (
            <CommunitySettingsSection
              isAdmin={community.isAdmin}
              onLeave={handleLeaveCommunity}
              onDelete={handleDeleteCommunity}
              isLeaving={isLeaving}
              isDeleting={isDeleting}
            />
          );
        default:
          return null;
      }
    },
    [community, communityId, handleJoinPress, isJoining, handleLeaveCommunity, handleDeleteCommunity, isLeaving, isDeleting, theme]
  );

  if (isLoading) {
    return (
      <ScreenLoading />
    );
  }

  if (!community) {
    return (
      <EmptyState fullScreen />
    );
  }

  if (community.genderRestricted) {
    return (
      <ScreenPlaceholder
        title={t("communities.incompatibilityRestrictionTitle")}
        description={t("communities.incompatibilityRestrictionMessage")}
        icon="people"
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
      <ScreenHeader title={community.title} />
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>

      <InputModal
        visible={showInputModal}
        title={t("communities.joinButton")}
        headerIcon="add"
        inputPlaceholder={t("communities.joinCommunityRequestPlaceholer")}
        maxCharacters={200}
        onSubmit={handleSubmitRequest}
        onCancel={() => setShowInputModal(false)}
        loading={isJoining}
      />
    </SafeAreaView>
  );
}