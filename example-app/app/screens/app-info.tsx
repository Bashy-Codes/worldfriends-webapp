import React, { Suspense } from "react";
import { ScreenLoading } from "@/components/ScreenLoading";
import { useRouter } from "expo-router";

const AppInfoComponent = React.lazy(() => 
  import("@/components/lazy/AppInfoComponent").then(module => ({
    default: module.AppInfoComponent
  }))
);

export default function AppInfoScreen() {
  const router = useRouter();

  return (
    <Suspense fallback={<ScreenLoading onBack={() => router.back()} />}>
      <AppInfoComponent />
    </Suspense>
  );
}