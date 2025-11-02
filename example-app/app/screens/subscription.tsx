import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@/lib/Theme";
import { useRouter } from "expo-router";
import { useSubscription } from "@/hooks/useSubscription";
import { Ionicons } from "@expo/vector-icons";

export default function SubscriptionScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { subscribe, isLoading, isPremium } = useSubscription();

  const handleSubscribe = async () => {
    const result = await subscribe();
    if (result.success) {
      router.back();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 30,
    },
    backButton: {
      padding: 8,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginLeft: 10,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: 24,
      marginBottom: 20,
    },
    premiumTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 8,
    },
    price: {
      fontSize: 20,
      color: theme.colors.text,
      marginBottom: 20,
    },
    featuresTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    feature: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    featureText: {
      fontSize: 16,
      color: theme.colors.text,
      marginLeft: 12,
    },
    subscribeButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      padding: 16,
      alignItems: "center",
      marginTop: 20,
    },
    subscribeButtonDisabled: {
      opacity: 0.6,
    },
    subscribeButtonText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#fff",
    },
    alreadyPremium: {
      backgroundColor: theme.colors.success,
      borderRadius: theme.borderRadius.lg,
      padding: 16,
      alignItems: "center",
      marginTop: 20,
    },
    alreadyPremiumText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#fff",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Premium Subscription</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.premiumTitle}>WorldFriends Premium</Text>
        <Text style={styles.price}>$3.00 / month</Text>

        <Text style={styles.featuresTitle}>Premium Features:</Text>
        
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
          <Text style={styles.featureText}>Unlimited messages</Text>
        </View>
        
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
          <Text style={styles.featureText}>Priority support</Text>
        </View>
        
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
          <Text style={styles.featureText}>Exclusive badges</Text>
        </View>
        
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
          <Text style={styles.featureText}>Ad-free experience</Text>
        </View>

        {isPremium ? (
          <View style={styles.alreadyPremium}>
            <Text style={styles.alreadyPremiumText}>✓ You are already a Premium member</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.subscribeButton, isLoading && styles.subscribeButtonDisabled]}
            onPress={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
