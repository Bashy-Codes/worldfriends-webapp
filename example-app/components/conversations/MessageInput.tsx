import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/lib/Theme";
import { MessageData } from "@/types/conversations";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { uploadImageToConvex } from "@/utils/uploadImages";
import { ImagePickerModal, ImagePickerRef } from "@/components/common/ImagePicker";
import { LoadingModal } from "@/components/common/LoadingModal";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onSendImage: (imageId: Id<"_storage">) => void;
  replyingTo: MessageData | null;
  onCancelReply: () => void;
  isSending: boolean;
  messagePlaceholder: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendImage,
  replyingTo,
  onCancelReply,
  isSending,
  messagePlaceholder,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [message, setMessage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const imagePickerRef = useRef<ImagePickerRef>(null);

  const generateUploadUrl = useMutation(api.storage.generateConvexUploadUrl);

  const getReplyPreview = () => {
    if (!replyingTo) return "";

    if (replyingTo.type === "image") {
      return "📷";
    }

    return replyingTo.content || "Message";
  };

  const handleImagePress = () => {
    Keyboard.dismiss();
    imagePickerRef.current?.present();
  };

  const handleSend = () => {
    if (!message.trim() || isSending) return;

    onSendMessage(message);
    setMessage("");
  };

  const handleImageSelected = async (imageUri: string) => {
    try {
      setIsUploadingImage(true);

      const result = await uploadImageToConvex(imageUri, generateUploadUrl);

      if (!result?.storageId) {
        throw new Error("Failed to upload image");
      }

      onSendImage(result.storageId as Id<"_storage">);
      setMessage("");
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: insets.bottom + 12,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
    },
    replyContainer: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary,
    },
    replyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    replyAuthorRow: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    cancelButton: {
      padding: 4,
    },
    replyAuthor: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      marginBottom: 2,
    },
    replyContent: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
    },
    inputContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      minHeight: 44,
    },
    textInput: {
      fontSize: 16,
      color: theme.colors.text,
      maxHeight: 100,
      paddingVertical: 4,
    },
    imageButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: message.trim()
        ? theme.colors.primary
        : theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <>
      <View style={styles.container}>
        {replyingTo && (
          <View style={styles.replyContainer}>
            <View style={styles.replyHeader}>
              <View style={styles.replyAuthorRow}>
                <Text style={styles.replyAuthor}>
                  ↪️ {replyingTo.sender.name}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancelReply}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={16}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.replyContent} numberOfLines={1}>
              {getReplyPreview()}
            </Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handleImagePress}
            activeOpacity={0.7}
            disabled={isSending}
          >
            <Ionicons
              name="camera"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={messagePlaceholder}
              placeholderTextColor={theme.colors.textMuted}
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="center"
              autoCorrect={true}
            />
          </View>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            activeOpacity={0.7}
            disabled={!message.trim() || isSending}
          >
            <Ionicons
              name="send"
              size={18}
              color={
                message.trim() ? theme.colors.white : theme.colors.textMuted
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <ImagePickerModal
        ref={imagePickerRef}
        onImageSelected={handleImageSelected}
      />

      <LoadingModal
        visible={isUploadingImage}
        state="loading"
      />
    </>
  );
};
