import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { useTranslation } from "react-i18next";
import { useComposeLetter } from "@/hooks/letters/useComposeLetter";
import { getCountryByCode } from "@/constants/geographics";

// components
import { ScreenHeader } from "@/components/ScreenHeader";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { LoadingModal } from "@/components/common/LoadingModal";
import { FriendsPickerModal } from "@/components/friends/FriendsPickerModal";
import { SelectionItem } from "@/components/ui/SelectionItem";
import { ScheduleLetter } from "@/components/letters/ScheduleLetter";
import { LargeInputContainer } from "@/components/common/LargeInputContainer";

export default function ComposeLetterScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    // State
    title,
    content,
    selectedFriend,
    scheduleDays,
    showDiscardModal,
    showSendModal,
    loadingModalState,

    // Refs
    friendsPickerModalRef,

    // Computed values
    canSend,

    // Constants
    MAX_CONTENT_LENGTH,
    MIN_CONTENT_LENGTH,

    // Handlers
    handleTitleChange,
    handleContentChange,
    handleSelectFriend,
    handleFriendSelected,
    handleRemoveFriend,
    handleScheduleIncrease,
    handleScheduleDecrease,
    handleBack,
    handleSend,
    confirmSend,
    confirmDiscard,
    closeSendModal,
    closeDiscardModal,
    handleLoadingModalComplete,

    // Utility functions
    getScheduleText,
  } = useComposeLetter();

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
        title={t("screenTitles.composeLetter")}
        onBack={handleBack}
        rightComponent="button"
        rightButtonText={
          <Ionicons name="send" size={20} color={theme.colors.white} />
        }
        onRightPress={handleSend}
        rightButtonEnabled={canSend}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Title Input */}
        <View style={styles.titleInputContainer}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={handleTitleChange}
            placeholder={t("composeLetter.letterTitleInput")}
            placeholderTextColor={theme.colors.textMuted}
            selectionColor={theme.colors.primary}
            maxLength={100}
          />
        </View>

        {/* Content Input */}
        <LargeInputContainer
          value={content}
          onChangeText={handleContentChange}
          minLength={MIN_CONTENT_LENGTH}
          maxLength={MAX_CONTENT_LENGTH}
          placeholder={t("composeLetter.inputPlaceholder")}
          placeholderTextColor={theme.colors.textMuted}
          autoCorrect={true}
        />

        {/* Friend Selection */}
        <SelectionItem
          title={t("composeLetter.deliverTo")}
          icon="person-add"
          isSelected={!!selectedFriend}
          selectedText={selectedFriend ? `${selectedFriend.name} ${getCountryByCode(selectedFriend.country)?.flag}` : undefined}
          onSelect={handleSelectFriend}
          onRemove={handleRemoveFriend}
        />

        {/* Schedule Section */}
        <ScheduleLetter
          scheduleDays={scheduleDays}
          onIncrease={handleScheduleIncrease}
          onDecrease={handleScheduleDecrease}
          minDays={1}
          maxDays={30}
          getScheduleText={getScheduleText}
        />
      </ScrollView>

      {/* Friends Picker Modal */}
      <FriendsPickerModal
        ref={friendsPickerModalRef}
        onFriendSelect={handleFriendSelected}
      />

      {/* Discard Confirmation Modal */}
      <ConfirmationModal
        visible={showDiscardModal}
        icon="warning-outline"
        description={t("confirmation.discardLetter")}
        confirmButtonColor={theme.colors.error}
        onConfirm={confirmDiscard}
        onCancel={closeDiscardModal}
      />

      {/* Send Confirmation Modal */}
      <ConfirmationModal
        visible={showSendModal}
        icon="send-outline"
        description={
          selectedFriend
            ? t("confirmation.sendLetter", {
              name: selectedFriend.name,
              countryFlag: getCountryByCode(selectedFriend.country)?.flag,
            })
            : ""
        }
        iconColor={theme.colors.primary}
        confirmButtonColor={theme.colors.success}
        onConfirm={confirmSend}
        onCancel={closeSendModal}
      />

      {/* Loading Modal */}
      <LoadingModal
        visible={loadingModalState !== "hidden"}
        state={loadingModalState === "hidden" ? "loading" : loadingModalState}
        onComplete={handleLoadingModalComplete}
      />
    </SafeAreaView>
  );
}
