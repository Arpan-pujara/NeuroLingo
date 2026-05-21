import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import type { StateStorage } from "zustand/middleware";

/** SSR / Node render (Expo web) — no `window`, so avoid AsyncStorage. */
const isServer = typeof window === "undefined";

const serverStorage: StateStorage = {
  getItem: async () => null,
  setItem: async () => {},
  removeItem: async () => {},
};

const webStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

/**
 * Zustand persist storage that works on native, web, and during Expo web SSR.
 */
export function createPersistStorage(): StateStorage {
  if (isServer) return serverStorage;
  if (Platform.OS === "web") return webStorage;
  return AsyncStorage;
}

export async function removePersistedItem(key: string): Promise<void> {
  const storage = createPersistStorage();
  await storage.removeItem(key);
}
