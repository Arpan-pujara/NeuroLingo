import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { fontAssets } from "@/lib/fonts";

SplashScreen.preventAutoHideAsync();

/**
 * Loads Poppins font files. Call once in the root layout.
 */
export function useAppFonts(): boolean {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (error) {
    throw error;
  }

  return loaded;
}
