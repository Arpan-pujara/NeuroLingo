import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Redirect, useRouter, type Href } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLanguageStore } from "@/store/language-store";
import type { Language, LanguageId } from "@/types/learning";

type LanguageListItemProps = {
  language: Language;
  isSelected: boolean;
  onPress: () => void;
};

function LanguageListItem({ language, isSelected, onPress }: LanguageListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      className={`flex-row items-center rounded-2xl border px-4 py-3.5 active:opacity-90 ${
        isSelected
          ? "border-lingua-purple bg-lingua-purple/5"
          : "border-border bg-white"
      }`}
    >
      <Image
        source={{ uri: language.flag }}
        style={{ width: 44, height: 44, borderRadius: 22 }}
        contentFit="cover"
      />
      <View className="ml-3.5 flex-1">
        <Text className="font-poppins-semibold text-base text-ink">
          {language.name}
        </Text>
        <Text className="typ-body-sm mt-0.5 text-ink-secondary">
          {language.learnerCountLabel}
        </Text>
      </View>
      {isSelected ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-lingua-purple">
          <Ionicons name="checkmark" size={18} color="#ffffff" />
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
      )}
    </Pressable>
  );
}

export default function ChooseLanguageScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const storedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);
  const setStoredLanguageId = useLanguageStore((state) => state.setSelectedLanguageId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguageId, setSelectedLanguageId] = useState<LanguageId>("es");

  useEffect(() => {
    if (storedLanguageId) {
      setSelectedLanguageId(storedLanguageId);
    }
  }, [storedLanguageId]);

  const filteredLanguages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return languages;
    }
    return languages.filter(
      (language) =>
        language.name.toLowerCase().includes(query) ||
        language.nativeName.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleConfirm = () => {
    const hadLanguage = !!useLanguageStore.getState().selectedLanguageId;
    setStoredLanguageId(selectedLanguageId);
    if (hadLanguage) {
      router.back();
    } else {
      router.replace("/");
    }
  };

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 bg-background">
        <View className="px-6 pt-1">
          <View className="relative min-h-10 items-center justify-center">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="absolute left-0 h-10 w-10 items-center justify-center active:opacity-70"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#0D132B" />
            </Pressable>
            <Text className="typ-h3 text-ink">Choose a language</Text>
          </View>

          <View className="mt-4 flex-row items-center rounded-full border border-border bg-white px-4 py-3">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="ml-2.5 flex-1 font-poppins text-base text-ink"
              placeholder="Search languages"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        <ScrollView
          style={{ flexShrink: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16 }}
        >
          <Text className="font-poppins-semibold text-base text-ink">Popular</Text>
          <View className="mt-3 gap-2.5">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <LanguageListItem
                  key={language.id}
                  language={language}
                  isSelected={selectedLanguageId === language.id}
                  onPress={() => setSelectedLanguageId(language.id)}
                />
              ))
            ) : (
              <Text className="typ-body-md py-6 text-center text-ink-secondary">
                No languages match your search.
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={{ marginTop: "auto" }}>
          <View className="px-6 pb-1">
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center justify-center rounded-full bg-lingua-purple py-4 active:opacity-90"
              onPress={handleConfirm}
            >
              <Text className="font-poppins-bold text-base text-white">Continue</Text>
            </Pressable>
          </View>

          <Image
            source={images.earth}
            style={{ width: "100%", height: 168 }}
            contentFit="cover"
            accessibilityIgnoresInvertColors
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
