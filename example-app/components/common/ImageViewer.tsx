import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Animated,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/lib/Theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface ImageViewerProps {
  images: Array<{ uri: string }>;
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  imageIndex,
  visible,
  onRequestClose,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [currentIndex, setCurrentIndex] = useState(imageIndex);

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
        x: imageIndex * screenWidth,
        animated: false,
      });
      setCurrentIndex(imageIndex);
    }
  }, [visible, imageIndex]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
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
    imageContainer: {
      width: screenWidth,
      height: screenHeight,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    image: {
      width: screenWidth - 40,
      height: screenHeight * 0.7,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
    },
    closeButtonContainer: {
      bottom: insets.bottom + 32,
      width: "90%",
    },
    closeButton: {
      width: "100%",
      height: 50,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(10px)",
    },
    indicatorContainer: {
      position: "absolute",
      top: insets.top + 50,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      backgroundColor: "rgba(255, 255, 255, 0.4)",
    },
    activeIndicator: {
      backgroundColor: theme.colors.primary,
      width: 24,
    },
  });

  const renderImage = (image: { uri: string }, index: number) => (
    <Animated.View
      key={index}
      style={[
        styles.imageContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Image
        source={{ uri: image.uri }}
        style={styles.image}
        contentFit="contain"
        placeholder={require("@/assets/images/photo.png")}
        priority="normal"
        cachePolicy="memory-disk"
      />
    </Animated.View>
  );

  const renderIndicators = () => {
    if (images.length <= 1) return null;

    return (
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <Animated.View
        style={[
          styles.modal,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.container}>
          {renderIndicators()}

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
            {images.map((image, index) => renderImage(image, index))}
          </ScrollView>

          <View style={styles.closeButtonContainer}>
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
    </Modal>
  );
};