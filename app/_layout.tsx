import "../global.css";

import { Stack } from "expo-router";
import { View } from "react-native";

import { useAppFonts } from "@/hooks/use-app-fonts";

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#ffffff" }} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
