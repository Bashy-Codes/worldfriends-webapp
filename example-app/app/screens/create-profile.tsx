import { useEffect } from "react";
import { ScreenLoading } from "@/components/ScreenLoading";
import { useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreateProfileComponent } from "@/components/lazy/CreateProfileComponent";

export default function CreateProfileScreen() {
  const router = useRouter();
  const hasProfile = useQuery(api.users.queries.hasProfile);

  useEffect(() => {
    if (hasProfile) {
      router.replace("/(tabs)");
    }
  }, [hasProfile, router]);

  if (hasProfile === undefined) {
    return <ScreenLoading />;
  }

  return <CreateProfileComponent />;
}