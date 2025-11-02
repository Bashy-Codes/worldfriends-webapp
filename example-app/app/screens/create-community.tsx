import React, { useCallback, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useTheme } from "@/lib/Theme";
import { useCreateCommunity } from "@/hooks/communities/useCreateCommunity";
import { LANGUAGES, getLanguageByCode } from "@/constants/geographics";

// Components
import { ScreenHeader } from "@/components/ScreenHeader";
import { Button } from "@/components/ui/Button";
import { ItemPickerModal, ItemPickerModalRef, PickerItem } from "@/components/ItemPickerModal";
import { useTranslation } from "react-i18next";

export default function CreateCommunityScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const [newRule, setNewRule] = useState("");
  const languagePickerRef = useRef<ItemPickerModalRef>(null);

  const {
    title,
    description,
    rules,
    genderOption,
    language,
    bannerUri,
    isCreating,
    agreementAccepted,
    setTitle,
    setDescription,
    addRule,
    removeRule,
    setGenderOption,
    setLanguage,
    setBannerUri,
    setAgreementAccepted,
    createCommunity,
    canCreate,
  } = useCreateCommunity();

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleAddRule = useCallback(() => {
    if (newRule.trim()) {
      addRule(newRule);
      setNewRule("");
    }
  }, [newRule, addRule]);

  const handleCreate = useCallback(async () => {
    const success = await createCommunity();
    if (success) {
      router.back();
    }
  }, [createCommunity]);

  const handleImagePicker = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setBannerUri(result.assets[0].uri);
    }
  }, [setBannerUri]);

  const languageItems: PickerItem[] = LANGUAGES.map(lang => ({
    id: lang.code,
    name: lang.name,
    emoji: "🌍"
  }));

  const handleLanguageSelection = useCallback((selectedIds: string[]) => {
    if (selectedIds.length > 0) {
      setLanguage(selectedIds[0]);
    }
  }, [setLanguage]);

  const selectedLanguage = getLanguageByCode(language);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: 16,
      fontSize: 16,
      color: theme.colors.text,
      minHeight: 50,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    ruleContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    ruleInput: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: 12,
      fontSize: 14,
      color: theme.colors.text,
      marginRight: 8,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      padding: 12,
    },
    ruleItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: theme.borderRadius.md,
      padding: 12,
      marginBottom: 8,
    },
    ruleText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
    },
    removeButton: {
      padding: 4,
    },
    genderOption: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: 16,
      marginBottom: 12,
    },
    genderText: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
    },
    agreementContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: 16,
      marginBottom: 24,
    },
    agreementText: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 12,
    },
    bannerContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      height: 120,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    bannerImage: {
      width: "100%",
      height: "100%",
    },
    bannerPlaceholder: {
      alignItems: "center",
    },
    languageSelector: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    languageText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    languagePlaceholder: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title={t("screenTitles.createCommunity")} onBack={handleBack} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("communities.createCommunityScreen.title")}</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={t("communities.createCommunityScreen.titlePlaceholder")}
            placeholderTextColor={theme.colors.textSecondary}
            maxLength={50}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("communities.createCommunityScreen.description")}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t("communities.createCommunityScreen.descriptionPlaceholder")}
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            maxLength={500}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("communities.createCommunityScreen.banner")}</Text>
          <TouchableOpacity
            style={styles.bannerContainer}
            onPress={handleImagePicker}
            activeOpacity={0.8}
          >
            {bannerUri ? (
              <Image
                source={{ uri: bannerUri }}
                style={styles.bannerImage}
                contentFit="cover"
              />
            ) : (
              <View style={styles.bannerPlaceholder}>
                <Ionicons
                  name="image"
                  size={56}
                  color={theme.colors.textSecondary}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("communities.createCommunityScreen.rules")}</Text>
          <View style={styles.ruleContainer}>
            <TextInput
              style={styles.ruleInput}
              value={newRule}
              onChangeText={setNewRule}
              placeholder={t("communities.createCommunityScreen.rulesPlaceholder")}
              placeholderTextColor={theme.colors.textSecondary}
              onSubmitEditing={handleAddRule}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddRule}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>

          {rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <Text style={styles.ruleText}>{rule}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeRule(index)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("communities.createCommunityScreen.language")}</Text>
          <TouchableOpacity
            style={styles.languageSelector}
            onPress={() => languagePickerRef.current?.present()}
            activeOpacity={0.8}
          >
            <Text style={selectedLanguage ? styles.languageText : styles.languagePlaceholder}>
              {selectedLanguage ? selectedLanguage.name : t("communities.createCommunityScreen.languagePlaceholder")}
            </Text>
            <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("communities.createCommunityScreen.gender")}</Text>
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGenderOption("all")}
            activeOpacity={0.8}
          >
            <Text style={styles.genderText}>{t("communities.createCommunityScreen.genderPlaceholder1")}</Text>
            <Ionicons
              name={genderOption === "all" ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => setGenderOption("my_gender")}
            activeOpacity={0.8}
          >
            <Text style={styles.genderText}>{t("communities.createCommunityScreen.genderPlaceholder2")}</Text>
            <Ionicons
              name={genderOption === "my_gender" ? "radio-button-on" : "radio-button-off"}
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.agreementContainer}>
          <Switch
            value={agreementAccepted}
            onValueChange={setAgreementAccepted}
            trackColor={{ false: theme.colors.surfaceSecondary, true: theme.colors.primary }}
            thumbColor={theme.colors.white}
          />
          <Text style={styles.agreementText}>
            {t("communities.createCommunityScreen.agreement")}
          </Text>
        </View>

        <Button
          title={t("communities.createCommunity")}
          onPress={handleCreate}
          loading={isCreating}
          disabled={!canCreate}
          style={{ marginBottom: 32 }}
        />
      </ScrollView>

      <ItemPickerModal
        ref={languagePickerRef}
        items={languageItems}
        selectedItems={language ? [language] : []}
        onSelectionChange={handleLanguageSelection}
        onConfirm={() => { }}
        multiSelect={false}
        minSelection={1}
        title="Language"
        headerIcon="language"
      />
    </SafeAreaView>
  );
}