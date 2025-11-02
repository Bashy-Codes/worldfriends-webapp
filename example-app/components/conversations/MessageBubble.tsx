import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useTheme } from "@/lib/Theme";
import { ImageViewer } from "@/components/common/ImageViewer";
import { MessageData } from "@/types/conversations";

interface MessageBubbleProps {
  message: MessageData;
  onLongPress: (message: MessageData) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onLongPress,
}) => {
  const theme = useTheme();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const getReplyPreview = () => {
    if (!message.replyParent) return null;

    const { replyParent } = message;
    if (replyParent.type === "image") {
      return "📷 Photo";
    }

    return replyParent.content || "Message";
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginVertical: 4,
          marginHorizontal: 16,
          alignItems: message.isOwner ? "flex-end" : "flex-start",
        },
        bubble: {
          maxWidth: "80%",
          borderRadius: 20,
          padding: 12,
          backgroundColor: message.isOwner
            ? theme.colors.primary
            : theme.colors.surface,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        imageContainer: {
          maxWidth: "80%",
          borderRadius: 20,
          backgroundColor: theme.colors.surface,
          padding: 4,
        },
        replyContainer: {
          backgroundColor: message.isOwner
            ? theme.colors.background + "40"
            : theme.colors.border + "60",
          borderRadius: 8,
          padding: 8,
          marginBottom: 8,
          borderLeftWidth: 6,
          borderLeftColor: message.isOwner
            ? theme.colors.background + "40"
            : theme.colors.info,
        },
        replyHeader: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 2,
        },
        replyAuthor: {
          fontSize: 12,
          fontWeight: "600",
          color: message.isOwner
            ? theme.colors.white + "CC"
            : theme.colors.textSecondary,
        },
        replyContent: {
          fontSize: 12,
          color: message.isOwner
            ? theme.colors.white + "AA"
            : theme.colors.textMuted,
        },
        messageContent: {},

        messageText: {
          fontSize: 16,
          color: message.isOwner ? theme.colors.white : theme.colors.text,
          lineHeight: 22,
        },
        messageImage: {
          width: 200,
          height: 150,
          borderRadius: 12,
          margin: 4,
        },
      }),
    [theme, message.isOwner]
  );

  return (
    <>
      <View style={styles.container}>
        {message.type === "image" && message.imageUrl ? (
          <TouchableOpacity
            style={styles.imageContainer}
            onLongPress={() => onLongPress(message)}
            activeOpacity={0.8}
            delayLongPress={500}
            onPress={() => setImageViewerVisible(true)}
          >
            <Image
              source={{ uri: message.imageUrl }}
              style={styles.messageImage}
              contentFit="contain"
              priority="normal"
              placeholder={require("@/assets/images/photo.png")}
              placeholderContentFit="scale-down"
              transition={{ duration: 300, effect: "cross-dissolve" }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.bubble}
            onLongPress={() => onLongPress(message)}
            activeOpacity={0.9}
            delayLongPress={500}
          >
            {message.replyParent && (
              <View style={styles.replyContainer}>
                <View style={styles.replyHeader}>
                  <Text style={styles.replyAuthor}>
                    {message.replyParent.sender.name}
                  </Text>
                </View>
                <Text style={styles.replyContent} numberOfLines={1}>
                  {getReplyPreview()}
                </Text>
              </View>
            )}

            <View style={styles.messageContent}>
              <Text style={styles.messageText}>
                {message.content}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {message.imageUrl && (
        <ImageViewer
          images={[{ uri: message.imageUrl }]}
          imageIndex={0}
          visible={imageViewerVisible}
          onRequestClose={() => setImageViewerVisible(false)}
        />
      )}
    </>
  );
};
