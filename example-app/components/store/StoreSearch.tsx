import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/lib/Theme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface StoreSearchProps {
  onSearch: (query: string) => void;
}

export const StoreSearch: React.FC<StoreSearchProps> = ({ onSearch }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    onSearch(text);
  }, [onSearch]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingVertical: 20,
      paddingHorizontal: 16,
      alignItems: "center",
      borderRadius: theme.borderRadius.lg
    },
    iconContainer: {
      marginBottom: 24,
      alignItems: "center",
      shadowColor: theme.colors.text,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    storeIcon: {
      width: 120,
      height: 120,
    },
    searchContainer: {
      width: "100%",
      position: "relative",
    },
    searchInput: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingLeft: 44,
      fontSize: 16,
      color: theme.colors.text,
    },
    searchIcon: {
      position: "absolute",
      left: 14,
      top: 14,
      zIndex: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: "https://storage.worldfriends.app/wf-store.png" }}
          style={styles.storeIcon}
          contentFit="cover"
        />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder={t("common.searchPlaceholder")}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};