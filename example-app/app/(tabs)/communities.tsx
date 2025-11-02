import { useState, useCallback } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { TabView, TabBar } from "react-native-tab-view";

import { TabHeader } from "@/components/TabHeader";
import { JoinedCommunitiesSection } from "@/components/communities/JoinedCommunitiesSection";
import { MyCommunitiesSection } from "@/components/communities/MyCommunitiesSection";
import { DiscoverCommunitiesSection } from "@/components/communities/DiscoverCommunitiesSection";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";

export default function CommunitiesTab() {
  const theme = useTheme();
  const { t } = useTranslation();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "joined", title: t("sectionsTitles.joined") },
    { key: "myCommunities", title: t("sectionsTitles.myCommunities") },
    { key: "discover", title: t("sectionsTitles.discover") },
  ]);

  const handeCreateCommunity = useCallback(() => {
    router.push("/screens/create-community");
  }, []);

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: theme.colors.primary }}
        style={{ backgroundColor: theme.colors.background }}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.textSecondary}
        labelStyle={{ fontWeight: "600", textTransform: "none" }}
        scrollEnabled
      />
    ),
    [theme]
  );

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "joined":
          return <JoinedCommunitiesSection />;
        case "myCommunities":
          return <MyCommunitiesSection />;
        case "discover":
          return <DiscoverCommunitiesSection />;
        default:
          return null;
      }
    },
    []
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <TabHeader title={t("screenTitles.communities")} />
      <View style={styles.content}>
        <Button title={t("communities.createCommunity")} onPress={handeCreateCommunity} style={{ margin: 12 }} />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
}
