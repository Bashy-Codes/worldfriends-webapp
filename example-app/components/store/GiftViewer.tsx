import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { getCountryByCode } from "@/constants/geographics";

const { height: screenHeight } = Dimensions.get("window");

interface GiftViewerProps {
  gift: {
    productDetails?: {
      title: string;
      image: string;
    };
    senderInfo?: {
      name: string;
      country: string;
    };
    receiverInfo?: {
      name: string;
      country: string;
    };
    createdAt: number;
  } | null;
  visible: boolean;
  onRequestClose: () => void;
  giftId?: string;
  showBadgeButton?: boolean;
  onSetBadge?: () => void;
}

export const GiftViewer: React.FC<GiftViewerProps> = ({
  gift,
  visible,
  onRequestClose,
  onSetBadge,
}) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  if (!gift || !gift.productDetails) return null;

  const userInfo = gift.senderInfo || gift.receiverInfo;
  const country = userInfo ? getCountryByCode(userInfo.country) : null;

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.95)",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
    },
    giftContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: 24,
      width: "90%",
      alignItems: "center",
      marginBottom: 16,
    },
    image: {
      width: "100%",
      height: screenHeight * 0.25,
      borderRadius: theme.borderRadius.lg,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
      backgroundColor: theme.colors.background,
      padding: 16,
      borderRadius: theme.borderRadius.lg,
    },
    userInfoContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: 20,
      width: "90%",
      marginBottom: 24,
    },
    infoCard: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.md,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    infoIcon: {
      marginRight: 16,
    },
    infoValue: {
      fontSize: 15,
      color: theme.colors.text,
      fontWeight: "600",
    },
    closeButtonContainer: {
      paddingVertical: 16,
      width: "90%",
      bottom: 12,
    },
    closeButton: {
      width: "100%",
      height: 50,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    setBadgeButton: {
      width: "100%",
      marginBottom: 12,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.giftContainer}>
            <Image
              source={{ uri: gift.productDetails.image }}
              style={styles.image}
              contentFit="contain"
            />
            <Text style={styles.title}>{gift.productDetails.title}</Text>
          </View>

          {userInfo && (
            <View style={styles.userInfoContainer}>
              <View style={styles.infoCard}>
                <Ionicons
                  name={gift.senderInfo ? "arrow-forward-outline" : "paper-plane"}
                  size={24}
                  color={theme.colors.primary}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoValue}>{userInfo.name}</Text>
              </View>

              <View style={styles.infoCard}>
                <Ionicons
                  name="location"
                  size={24}
                  color={theme.colors.error}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoValue}>
                  {country?.flag} {country?.name}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.closeButtonContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onRequestClose}
              activeOpacity={0.8}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};