import React from "react";
import { StyleSheet, TouchableOpacity, View, Text, Modal } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { Product } from "@/types/store";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";

interface ProductViewerProps {
  product: Product | null;
  visible: boolean;
  onRequestClose: () => void;
  onPress?: () => void;
  buttonText?: string;
  loading?: boolean;
}

export const ProductViewer: React.FC<ProductViewerProps> = ({
  product,
  visible,
  onRequestClose,
  onPress,
  buttonText,
  loading = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!product) return null;

  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.95)",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    imageContainer: {
      width: "90%",
      height: "40%",
      borderRadius: theme.borderRadius.xl,
      overflow: "hidden",
      marginVertical: 16,
      backgroundColor: theme.colors.surface,
      padding: 24
    },
    image: {
      width: "100%",
      height: "100%",
    },
    contentContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: 24,
      width: "90%",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 12,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textMuted,
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 16,
    },
    closeButtonContainer: {
      paddingVertical: 16,
      width: "90%",
    },
    closeButton: {
      width: "100%",
      height: 50,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
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
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              contentFit="contain"
            />
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.description}>{product.description}</Text>
            <Button
              title={buttonText || t("common.buy")}
              onPress={loading ? () => { } : (onPress || (() => console.log("Purchase", product.id)))}
              style={{ width: "100%" }}
              loading={loading}
            />
          </View>

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