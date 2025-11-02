import { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/Theme";
import { TabView, TabBar } from "react-native-tab-view";

// components
import { TabHeader } from "@/components/TabHeader";
import { Greetings } from "@/components/feed/Greetings";
import { ReceivedLettersSection } from "@/components/letters/ReceivedLettersSection";
import { SentLettersSection } from "@/components/letters/SentLettersSection";
import { Button } from "@/components/ui/Button";

export default function LettersScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "received", title: t("sectionsTitles.received") },
    { key: "sent", title: t("sectionsTitles.sent") },
  ]);

  const handleComposeLetter = () => {
    router.push("/screens/compose-letter");
  };

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: theme.colors.primary }}
        style={{ backgroundColor: theme.colors.background }}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.textSecondary}
        labelStyle={{ fontWeight: "600", textTransform: "none" }}
      />
    ),
    [theme]
  );

  const headerComponent = useMemo(
    () => <Greetings onCreatePost={handleComposeLetter} actionText={t("actions.composeLetter")} />,
    [handleComposeLetter, t]
  );

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "received":
          return <ReceivedLettersSection />;
        case "sent":
          return <SentLettersSection />;
        default:
          return null;
      }
    },
    [headerComponent]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <TabHeader title="Letters" />
      <View style={styles.content}>
        <Button title="Compose Letter" onPress={handleComposeLetter} style={{ marginHorizontal: 16, marginTop: 12 }} />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
          swipeEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
}