import React from "react";
import {
  StyleSheet,
  Text,
} from "react-native";
import { useTheme } from "@/lib/Theme";
import { WFModal } from "../ui/WFModal";

interface Request {
  requestMessage: string;
}

interface RequestViewerProps {
  request: Request | null;
  visible: boolean;
  loading?: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export const RequestViewer: React.FC<RequestViewerProps> = ({
  request,
  visible,
  loading = false,
  onAccept,
  onReject,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    messageText: {
      fontSize: 16,
      color: theme.colors.text,
      lineHeight: 22,
      minHeight: "30%"
    },
  });

  if (!request) return null;

  return (
    <WFModal
      visible={visible}
      onClose={onReject}
      onConfirm={onAccept}
      closeIcon="trash"
      headerIcon="mail"
      loading={loading}
    >
      <Text style={styles.messageText}>{request.requestMessage}</Text>
    </WFModal>
  );
};