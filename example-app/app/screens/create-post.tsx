import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";
import { useCreatePost } from "@/hooks/feed/useCreatePost";

// components
import { ScreenHeader } from "@/components/ScreenHeader";
import { AddImageSection } from "@/components/feed/AddImageSection";
import { SelectionItem } from "@/components/ui/SelectionItem";
import { InfoSection } from "@/components/common/InfoSection";
import { ImagePickerModal } from "@/components/common/ImagePicker";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { LoadingModal } from "@/components/common/LoadingModal";
import { CollectionsModal } from "@/components/feed/CollectionsModal";
import { LargeInputContainer } from "@/components/common/LargeInputContainer";


export default function CreatePostScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const {
    // State
    content,
    images,
    showDiscardModal,
    showPostModal,
    loadingModalState,
    selectedCollectionId,

    // Refs
    imagePickerRef,
    collectionsModalRef,

    // Computed values
    canPost,

    // Content handlers
    setContent,

    // Navigation handlers
    handleBack,

    // Post creation handlers
    handlePost,
    confirmPost,
    confirmDiscard,

    // Image handlers
    handleAddImage,
    handleImageSelected,
    handleRemoveImage,

    // Collection handlers
    handleAddToCollectionPress,
    handleCollectionSelect,
    handleRemoveCollection,

    // Modal handlers
    closeDiscardModal,
    closePostModal,
    handleLoadingModalComplete,
  } = useCreatePost();

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
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader
        title={t("screenTitles.createPost")}
        onBack={handleBack}
        rightComponent="button"
        rightButtonText={
          <Ionicons
            name={"checkmark-circle"}
            size={20}
            color={theme.colors.white}
          />
        }
        onRightPress={handlePost}
        rightButtonEnabled={canPost}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <LargeInputContainer
          value={content}
          onChangeText={setContent}
          maxLength={2000}
          placeholder={t("createPost.placeholder")}
          placeholderTextColor={theme.colors.textMuted}
          autoCorrect={true}
        />

        <AddImageSection
          images={images}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          maxImages={3}
        />

        {/* Collection Selection */}
        <SelectionItem
          title={t('createPost.sections.selectCollection')}
          icon="bookmarks-outline"
          isSelected={!!selectedCollectionId}
          onSelect={handleAddToCollectionPress}
          onRemove={handleRemoveCollection}
        />

        {/* Info Section */}
        <InfoSection infoMessage={t("createPost.infoMessage")} />
      </ScrollView>

      <ImagePickerModal
        ref={imagePickerRef}
        onImageSelected={handleImageSelected}
      />



      <CollectionsModal
        ref={collectionsModalRef}
        onCollectionSelect={handleCollectionSelect}
      />

      <ConfirmationModal
        visible={showDiscardModal}
        icon="warning-outline"
        description={t("confirmation.discardPost")}
        confirmButtonColor={theme.colors.error}
        onConfirm={confirmDiscard}
        onCancel={closeDiscardModal}
      />

      <ConfirmationModal
        visible={showPostModal}
        icon="checkmark-circle-outline"
        description={t("confirmation.createPost")}
        iconColor={theme.colors.info}
        confirmButtonColor={theme.colors.success}
        onConfirm={confirmPost}
        onCancel={closePostModal}
      />

      <LoadingModal
        visible={loadingModalState !== 'hidden'}
        state={loadingModalState === 'hidden' ? 'loading' : loadingModalState}
        onComplete={handleLoadingModalComplete}
      />
    </SafeAreaView>
  );
}
