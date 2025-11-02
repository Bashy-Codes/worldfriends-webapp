import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView, Animated, Dimensions, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/lib/Theme";
import { Flashcard } from "@/types/study";

const { width: screenWidth } = Dimensions.get("window");

interface ViewerFlashCardProps {
    flashcard: Flashcard;
    flipped: boolean;
    onFlip: () => void;
}

const ViewerFlashCard: React.FC<ViewerFlashCardProps> = ({ flashcard, flipped, onFlip }) => {
    const theme = useTheme();
    const flipAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.spring(flipAnim, {
            toValue: flipped ? 180 : 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
        }).start();
    }, [flipped]);

    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ["0deg", "180deg"],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ["-180deg", "0deg"],
    });

    const viewerCardStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.lg,
            padding: 40,
            minHeight: 350,
            maxHeight: 500,
            width: '100%',
            justifyContent: "center",
            alignItems: "center",
        },
        front: {
            backfaceVisibility: "hidden",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            width: '100%',
        },
        back: {
            backfaceVisibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
        },
        text: {
            fontSize: 28,
            fontWeight: "600",
            color: theme.colors.text,
            textAlign: "center",
            lineHeight: 36,
            flexWrap: 'wrap',
        },
    });

    return (
        <TouchableOpacity
            style={viewerCardStyles.container}
            onPress={onFlip}
            activeOpacity={0.9}
        >
            <Animated.View
                style={[
                    viewerCardStyles.front,
                    { transform: [{ rotateY: frontInterpolate }] },
                ]}
            >
                <Text style={viewerCardStyles.text}>{flashcard.word}</Text>
            </Animated.View>

            <Animated.View
                style={[
                    viewerCardStyles.back,
                    { transform: [{ rotateY: backInterpolate }] },
                ]}
            >
                <Text style={viewerCardStyles.text}>{flashcard.meaning}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

interface FlashCardViewerProps {
    flashcards: Flashcard[];
    cardIndex: number;
    visible: boolean;
    onRequestClose: () => void;
    onDelete: (id: string) => void;
}

export const FlashCardViewer: React.FC<FlashCardViewerProps> = ({
    flashcards,
    cardIndex,
    visible,
    onRequestClose,
    onDelete,
}) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const [currentIndex, setCurrentIndex] = useState(cardIndex);
    const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    useEffect(() => {
        if (visible && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: cardIndex * screenWidth,
                animated: false,
            });
            setCurrentIndex(cardIndex);
        }
    }, [visible, cardIndex]);

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / screenWidth);
        setCurrentIndex(index);
    };

    const handleFlip = (index: number) => {
        setFlippedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const styles = StyleSheet.create({
        modal: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
        },
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        scrollView: {
            flex: 1,
        },
        cardContainer: {
            width: screenWidth,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
        },
        viewerCard: {
            width: screenWidth - 40
        },
        closeButtonContainer: {
            position: "absolute",
            bottom: insets.bottom + 20,
            left: 20,
            right: 20,
            zIndex: 10,
            flexDirection: "row",
            gap: 12,
        },
        closeButton: {
            flex: 1,
            height: 50,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.background,
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(10px)"
        },
        deleteButton: {
            flex: 1,
            height: 50,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.error,
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(10px)",
        },
        countContainer: {
            position: "absolute",
            top: insets.top + 50,
            left: 0,
            right: 0,
            alignItems: "center",
        },
        countText: {
            color: theme.colors.white,
            fontSize: 16,
            fontWeight: "600",
            textShadowColor: "rgba(0, 0, 0, 0.5)",
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
        },
    });

    const renderCard = (flashcard: Flashcard, index: number) => (
        <View key={index} style={styles.cardContainer}>
            <View style={styles.viewerCard}>
                <ViewerFlashCard
                    flashcard={flashcard}
                    flipped={flippedCards.has(index)}
                    onFlip={() => handleFlip(index)}
                />
            </View>
        </View>
    );

    const renderCount = () => {
        if (flashcards.length === 0) return null;

        return (
            <View style={styles.countContainer}>
                <Text style={styles.countText}>
                    {currentIndex + 1}/{flashcards.length}
                </Text>
            </View>
        );
    };

    return (
        <Animated.View
            style={[
                styles.modal,
                {
                    opacity: fadeAnim,
                },
            ]}
        >
            <View style={styles.container}>
                {renderCount()}

                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollView}
                    contentContainerStyle={{ alignItems: "center" }}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {flashcards.map((flashcard, index) => renderCard(flashcard, index))}
                </ScrollView>

                <View style={styles.closeButtonContainer}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => {
                            onDelete(flashcards[currentIndex].id);
                            onRequestClose();
                        }}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={24}
                            color={theme.colors.white}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onRequestClose}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="close"
                            size={24}
                            color={theme.colors.white}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Animated.View>
    );
};