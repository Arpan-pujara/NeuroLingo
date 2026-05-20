import "react-native-reanimated";

import "../global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { View } from "react-native";

import { useAppFonts } from "@/hooks/use-app-fonts";
import { publishableKey } from "@/lib/clerk";

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#ffffff" }} />;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
