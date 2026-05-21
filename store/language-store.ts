import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createPersistStorage, removePersistedItem } from "@/lib/persist-storage";
import type { LanguageId } from "@/types/learning";

const STORAGE_KEY = "neurolingo-language";

type LanguageStoreState = {
  selectedLanguageId: LanguageId | null;
  hasHydrated: boolean;
  setSelectedLanguageId: (id: LanguageId) => void;
  clearSelectedLanguage: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useLanguageStore = create<LanguageStoreState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      hasHydrated: false,
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
      clearSelectedLanguage: () => set({ selectedLanguageId: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => createPersistStorage()),
      partialize: (state) => ({
        selectedLanguageId: state.selectedLanguageId,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error("Failed to rehydrate language store", error);
        }
        useLanguageStore.setState({ hasHydrated: true });
      },
    },
  ),
);

export async function clearLanguageStorageForTesting(): Promise<void> {
  await removePersistedItem(STORAGE_KEY);
  useLanguageStore.persist.clearStorage();
  useLanguageStore.setState({
    selectedLanguageId: null,
    hasHydrated: true,
  });
}
