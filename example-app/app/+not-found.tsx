import { View, Text, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";
import { useTheme } from "@/lib/Theme";

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>This screen doesn't exist.</Text>
        <Link href="/" style={[styles.link, { color: theme.colors.primary }]}>
          Go to home screen
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
