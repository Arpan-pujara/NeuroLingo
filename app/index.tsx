import { useAuth } from "@clerk/expo";
import { Redirect, type Href } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useLanguageStore } from "@/store/language-store";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  if (!isLoaded || !hasHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <ActivityIndicator size="large" color="#6338FF" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={"/onboarding" as Href} />;
  }

  if (!selectedLanguageId) {
    return <Redirect href={"/choose-language" as Href} />;
  }

  return <Redirect href={"/(tabs)" as Href} />;
}
