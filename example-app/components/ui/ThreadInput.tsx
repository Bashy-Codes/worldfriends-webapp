import React, { useState, useCallback, memo } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/lib/Theme";
import { useTranslation } from "react-i18next";

interface ReplyPreview {
  authorName: string;
  content: string;
}

export interface ThreadInputProps {
  onSubmit: (text: string) => void;
  onCancelReply?: () => void;
  replyPreview?: ReplyPreview | null;
}

export const ThreadInput: React.FC<ThreadInputProps> = memo(({
  onSubmit,
  onCancelReply,
  replyPreview,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");

  const handleSubmit = useCallback(() => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
    }
  }, [text, onSubmit]);

  const isSubmitDisabled = !text.trim();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: insets.bottom + 12,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      backgroundColor: theme.colors.background,
      borderRadius: 22,
      paddingHorizontal: 16,
      paddingVertical: 8,
      minHeight: 44,
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      lineHeight: 20,
      color: theme.colors.text,
      maxHeight: 250,
      paddingVertical: 8,
    },
    sendButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 18,
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 6,
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
      opacity: 0.5,
    },
    replyPreviewContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    replyPreviewContent: {
      flex: 1,
      marginRight: 8,
    },
    replyPreviewTitle: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.primary,
      marginBottom: 2,
    },
    replyPreviewText: {
      fontSize: 13,
      color: theme.colors.textMuted,
    },
    replyPreviewCloseButton: {
      padding: 4,
    },
  });

  return (
    <View style={styles.container}>
      {replyPreview && (
        <View style={styles.replyPreviewContainer}>
          <View style={styles.replyPreviewContent}>
            <Text style={styles.replyPreviewTitle}>
              {`Replying to ${replyPreview.authorName}`}
            </Text>
            <Text style={styles.replyPreviewText} numberOfLines={1}>
              {replyPreview.content}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.replyPreviewCloseButton}
            onPress={onCancelReply}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder={t("threads.writeReply")}
          placeholderTextColor={theme.colors.textMuted}
          multiline
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
          maxLength={1000}
          autoCorrect={true}
        />
        <TouchableOpacity
          style={[styles.sendButton, isSubmitDisabled && styles.sendButtonDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.7}
          disabled={isSubmitDisabled}
        >
          <Ionicons name="send" size={16} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>
    </View>
  );
});