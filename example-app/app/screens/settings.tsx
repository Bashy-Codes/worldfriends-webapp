import { useCallback, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme, useThemeActions } from "@/lib/Theme";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import {
  getCurrentLanguage,
  SupportedLanguageCode,
} from "@/lib/i18n";

// components
import { ScreenHeader } from "@/components/ScreenHeader";
import { ActionItem } from "@/components/common/ActionItem";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { LoadingModal } from "@/components/common/LoadingModal";
import { LanguagePicker, LanguagePickerRef } from "@/components/LanguagePicker";

export default function SettingsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { signOut } = useAuthActions();
  const { toggleTheme } = useThemeActions();

  const languagePickerRef = useRef<LanguagePickerRef>(null);

  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingModalState, setLoadingModalState] = useState<'hidden' | 'loading' | 'success' | 'error'>('hidden');
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguageCode>(getCurrentLanguage());

  const deleteProfile = useMutation(api.users.mutations.deleteProfile);

  const handleEditProfile = useCallback(() => {
    router.push("/screens/edit-profile");
  }, []);

  const handleContactPress = () => {
    Linking.openURL("mailto:hello@worldfriends.app");
  };

  const handleLanguagePicker = useCallback(() => {
    languagePickerRef.current?.present();
  }, []);

  const handleLanguageChange = useCallback(
    (languageCode: SupportedLanguageCode) => {
      setCurrentLanguage(languageCode);
      Toast.show({
        type: "success",
        text1: t("successToasts.languageChanged")
      });
    },
    [t]
  );

  const handleLogout = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    try {
      await signOut();

      setShowLogoutModal(false);
      router.replace("/(auth)/authentication");
    } catch (error) {
      console.error("Logout error:", error);
      Toast.show({
        type: "error",
        text1: t("errorToasts.genericError")
      });
    }
  }, [signOut, router, t]);

  const handleDeleteAccount = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleLoadingModalComplete = useCallback(() => {
    setLoadingModalState('hidden');
  }, []);

  const confirmDeleteAccount = useCallback(async () => {
    try {
      setShowDeleteModal(false);
      setLoadingModalState('loading');

      await deleteProfile();

      setLoadingModalState('success');
      router.replace("/(auth)");
    } catch (error) {
      console.error("Delete account error:", error);

      // Show error state
      setLoadingModalState('error');
      Toast.show({
        type: "error",
        text1: t("errorToasts.genericError")
      });
    }
  }, [deleteProfile, signOut, router, t]);

  const handleAppAbout = useCallback(() => {
    router.push("/screens/app-info");
  }, [router]);


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    section: {
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 16,
      marginLeft: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title={t("screenTitles.settings")} />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("settings.sectionTitles.profile")}
          </Text>

          <ActionItem
            icon="person-outline"
            iconColor={theme.colors.primary}
            iconBgColor={`${theme.colors.primary}15`}
            title={t("settings.editProfile.title")}
            description={t("settings.editProfile.description")}
            type="default"
            onPress={handleEditProfile}
          />
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("settings.sectionTitles.subscription")}
          </Text>

          <ActionItem
            icon="star-outline"
            iconColor={theme.colors.warning}
            iconBgColor={`${theme.colors.warning}15`}
            title="Premium Subscription"
            description="Upgrade to Premium for exclusive features"
            type="default"
            onPress={() => router.push("/screens/subscription")}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("settings.sectionTitles.preferences")}
          </Text>

          <ActionItem
            icon="language-outline"
            iconColor={theme.colors.success}
            iconBgColor={`${theme.colors.success}15`}
            title={t("settings.language.title")}
            description={t("settings.language.description")}
            type="default"
            onPress={handleLanguagePicker}
          />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("settings.sectionTitles.account")}
          </Text>

          <ActionItem
            icon="log-out-outline"
            iconColor={theme.colors.warning}
            iconBgColor={`${theme.colors.warning}15`}
            title={t("settings.logout.title")}
            description={t("settings.logout.description")}
            type="default"
            onPress={handleLogout}
          />

          <ActionItem
            icon="trash-outline"
            iconColor={theme.colors.error}
            iconBgColor={`${theme.colors.error}15`}
            title={t("settings.deleteAccount.title")}
            description={t("settings.deleteAccount.description")}
            type="default"
            onPress={handleDeleteAccount}
          />
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t("settings.sectionTitles.platformInfo")}
          </Text>

          <ActionItem
            icon="information-circle-outline"
            iconColor={theme.colors.info}
            iconBgColor={`${theme.colors.info}15`}
            title={t("settings.platformInfo.title")}
            description={t("settings.platformInfo.description")}
            type="default"
            onPress={handleAppAbout}
          />

          <ActionItem
            icon="mail-outline"
            iconColor={theme.colors.success}
            iconBgColor={`${theme.colors.info}15`}
            title={t("settings.contact.title")}
            description={t("settings.contact.description")}
            type="default"
            onPress={handleContactPress}
          />
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        icon="log-out-outline"
        description={t("confirmation.logout")}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        icon="trash-outline"
        description={t("confirmation.deleteAccount")}
        onConfirm={confirmDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Language Picker */}
      <LanguagePicker
        ref={languagePickerRef}
        onLanguageChange={handleLanguageChange}
      />

      {/* Loading Modal */}
      <LoadingModal
        visible={loadingModalState !== 'hidden'}
        state={loadingModalState === 'hidden' ? 'loading' : loadingModalState}
        onComplete={handleLoadingModalComplete}
      />
    </SafeAreaView>
  );
}
