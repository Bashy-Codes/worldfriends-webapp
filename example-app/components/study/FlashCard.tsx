import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTheme } from "@/lib/Theme";
import { Flashcard } from "@/types/study";

interface FlashCardProps {
    flashcard: Flashcard;
    onView?: () => void;
}

export const FlashCard: React.FC<FlashCardProps> = ({
    flashcard,
    onView,
}) => {
    const theme = useTheme();

    const handlePress = () => {
        if (onView) {
            onView();
        }
    };

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: 32,
            marginHorizontal: 16,
            marginVertical: 12,
            minHeight: 220,
            justifyContent: "center",
            alignItems: "center",
        },
        text: {
            fontSize: 24,
            fontWeight: "600",
            color: theme.colors.text,
            textAlign: "center",
            lineHeight: 32,
        },
    });

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <Text style={styles.text}>{flashcard.word}</Text>
        </TouchableOpacity>
    );
};