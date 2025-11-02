import React from "react";
import { StyleSheet, ScrollView, View, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { useCreateDiscussion } from "@/hooks/communities/useCreateDiscussion";
import { ScreenHeader } from "@/components/ScreenHeader";
import { LargeInputContainer } from "@/components/common/LargeInputContainer";
import { AddImageSection } from "@/components/feed/AddImageSection";
import { ImagePickerModal } from "@/components/common/ImagePicker";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { LoadingModal } from "@/components/common/LoadingModal";
import { useTranslation } from "react-i18next";

export default function CreateDiscussionScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    title,
    content,
    image,
    canCreate,
    showDiscardModal,
    showCreateModal,
    loadingModalState,
    imagePickerRef,
    setTitle,
    setContent,
    handleBack,
    handleCreate,
    confirmCreate,
    confirmDiscard,
    closeDiscardModal,
    closeCreateModal,
    handleLoadingModalComplete,
    handleAddImage,
    handleImageSelected,
    handleRemoveImage,
  } = useCreateDiscussion();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    titleInputContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: 16,
      marginBottom: 12,
    },
    titleInput: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      textAlignVertical: "top",
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader
        title={t("screenTitles.createDiscussion")}
        onBack={handleBack}
        rightComponent="button"
        rightButtonText={
          <Ionicons
            name="checkmark-circle"
            size={20}
            color={theme.colors.white}
          />
        }
        onRightPress={handleCreate}
        rightButtonEnabled={canCreate}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.titleInputContainer}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder={t("communities.createDiscussion.titlePlaceholder")}
            placeholderTextColor={theme.colors.textMuted}
            selectionColor={theme.colors.primary}
            maxLength={100}
          />
        </View>

        <LargeInputContainer
          value={content}
          onChangeText={setContent}
          maxLength={3000}
          placeholder={t("communities.createDiscussion.contentPlaceholder")}
          placeholderTextColor={theme.colors.textMuted}
          autoCorrect={true}
        />

        <AddImageSection
          images={image ? [image] : []}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          maxImages={1}
        />
      </ScrollView>

      <ImagePickerModal
        ref={imagePickerRef}
        onImageSelected={handleImageSelected}
      />

      <ConfirmationModal
        visible={showDiscardModal}
        icon="warning-outline"
        description={t("confirmation.discardDiscussion")}
        confirmButtonColor={theme.colors.error}
        onConfirm={confirmDiscard}
        onCancel={closeDiscardModal}
      />

      <ConfirmationModal
        visible={showCreateModal}
        icon="checkmark-circle-outline"
        description={t("confirmation.createDiscussion")}
        iconColor={theme.colors.info}
        confirmButtonColor={theme.colors.success}
        onConfirm={confirmCreate}
        onCancel={closeCreateModal}
      />

      <LoadingModal
        visible={loadingModalState !== "hidden"}
        state={loadingModalState === "hidden" ? "loading" : loadingModalState}
        onComplete={handleLoadingModalComplete}
      />
    </SafeAreaView>
  );
}
