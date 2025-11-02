import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "@/lib/Theme";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { useTranslation } from "react-i18next";
import { ActionItem } from "../common/ActionItem";

interface CommunitySettingsSectionProps {
  isAdmin: boolean;
  onLeave: () => void;
  onDelete: () => void;
  isLeaving: boolean;
  isDeleting: boolean;
}

export const CommunitySettingsSection: React.FC<CommunitySettingsSectionProps> = ({
  isAdmin,
  onLeave,
  onDelete,
  isLeaving,
  isDeleting,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 16,

    }
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {isAdmin && (
          <>
            <ActionItem
              title={t("communities.settingsSection.editCommunity")}
              description={t("communities.settingsSection.editDescription")}
              icon="pencil"
              iconColor={theme.colors.success}
              onPress={() => { }}
              type="default"
            />
            <ActionItem
              title={t("communities.settingsSection.deleteCommunity")}
              description={t("communities.settingsSection.deleteDescription")}
              icon="trash-outline"
              iconColor={theme.colors.error}
              onPress={() => setShowDeleteModal(true)}
              type="default"
            />
          </>
        )}

        {!isAdmin && (
          <ActionItem
            title={t("communities.settingsSection.deleteCommunity")}
            description={t("communities.settingsSection.deleteDescription")}
            icon="log-out-outline"
            iconColor={theme.colors.error}
            onPress={() => setShowLeaveModal(true)}
            type="default"
          />
        )}
      </View>

      <ConfirmationModal
        visible={showLeaveModal}
        icon="log-out-outline"
        message={t("confirmation.leaveCommunity")}
        onConfirm={() => {
          setShowLeaveModal(false);
          onLeave();
        }}
        onCancel={() => setShowLeaveModal(false)}
        loading={isLeaving}
      />

      <ConfirmationModal
        visible={showDeleteModal}
        icon="trash-outline"
        message={t("confirmation.deleteCommunity")}
        onConfirm={() => {
          setShowDeleteModal(false);
          onDelete();
        }}
        onCancel={() => setShowDeleteModal(false)}
        loading={isDeleting}
      />
    </ScrollView >
  );
};