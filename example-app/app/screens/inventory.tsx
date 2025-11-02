import { useState, useCallback, useRef } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "@/lib/Theme";
import { TabView, TabBar } from "react-native-tab-view";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Components
import { ScreenHeader } from "@/components/ScreenHeader";
import { ProductViewer } from "@/components/store/ProductViewer";
import { GiftViewer } from "@/components/store/GiftViewer";
import { FriendsPickerModal, FriendsPickerModalRef } from "@/components/friends/FriendsPickerModal";
import { OwnedProductsSection } from "@/components/inventory/OwnedProductsSection";
import { ReceivedGiftsSection } from "@/components/inventory/ReceivedGiftsSection";
import { SentGiftsSection } from "@/components/inventory/SentGiftsSection";
import { useTranslation } from "react-i18next";


export default function InventoryScreen() {
  const theme = useTheme();
  const { t } = useTranslation();

  const layout = useWindowDimensions();
  const friendsPickerRef = useRef<FriendsPickerModalRef>(null);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "owned", title: "Owned" },
    { key: "received", title: "Received" },
    { key: "sent", title: "Sent" },
  ]);

  const sendGiftMutation = useMutation(api.store.mutations.sendGift);

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [showProductViewer, setShowProductViewer] = useState(false);
  const [showGiftViewer, setShowGiftViewer] = useState(false);
  const [sendingGift, setSendingGift] = useState(false);

  const handleBack = useCallback(() => {
    router.back();
  }, []);



  const handleProductPress = useCallback((product: any) => {
    setSelectedProduct(product);
    setShowProductViewer(true);
  }, []);

  const handleGiftPress = useCallback((gift: any) => {
    setSelectedGift(gift);
    setShowGiftViewer(true);
  }, []);

  const handleSetBadge = useCallback(async () => {
    if (!selectedGift?.giftId) return;
    try {
      await selectedGift.setBadge({ giftId: selectedGift.productId });
      setShowGiftViewer(false);
    } catch (error) {
      console.error("Failed to set badge:", error);
    }
  }, [selectedGift]);

  const handleSendGift = useCallback(() => {
    friendsPickerRef.current?.present();
  }, []);

  const handleFriendSelect = useCallback(async (friend: any) => {
    if (!selectedProduct) return;

    setSendingGift(true);
    try {
      await sendGiftMutation({ receiverId: friend.userId as Id<"users">, productId: selectedProduct.productId });
      setShowProductViewer(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to send gift:", error);
    }
    setSendingGift(false);
  }, [selectedProduct, sendGiftMutation]);

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: theme.colors.primary }}
        style={{ backgroundColor: theme.colors.background }}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.textSecondary}
        labelStyle={{ fontWeight: "600", textTransform: "none", fontSize: 14 }}
      />
    ),
    [theme]
  );

  const renderScene = useCallback(
    ({ route }: any) => {
      switch (route.key) {
        case "owned":
          return <OwnedProductsSection onProductPress={handleProductPress} />;
        case "received":
          return <ReceivedGiftsSection onGiftPress={handleGiftPress} />;
        case "sent":
          return <SentGiftsSection onGiftPress={handleGiftPress} />;
        default:
          return null;
      }
    },
    [handleProductPress, handleGiftPress]
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScreenHeader title="Inventory" onBack={handleBack} />
      <View style={styles.content}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
          swipeEnabled={true}
        />
      </View>


      <ProductViewer
        product={selectedProduct?.productDetails}
        visible={showProductViewer}
        onRequestClose={() => setShowProductViewer(false)}
        onPress={handleSendGift}
        buttonText={t("common.send")}
        loading={sendingGift}
      />

      <GiftViewer
        gift={selectedGift}
        visible={showGiftViewer}
        onRequestClose={() => setShowGiftViewer(false)}
        giftId={selectedGift?.productId}
        showBadgeButton={index === 1}
        onSetBadge={handleSetBadge}
      />

      <FriendsPickerModal
        ref={friendsPickerRef}
        onFriendSelect={handleFriendSelect}
      />
    </SafeAreaView>
  );
}