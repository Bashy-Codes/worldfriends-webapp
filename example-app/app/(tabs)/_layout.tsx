import { Tabs } from "expo-router";
import { BottomTabBar } from "@/components/BottomTabBar";

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <BottomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="communities" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="friends" />
      <Tabs.Screen name="conversations" />
      <Tabs.Screen name="letters" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
