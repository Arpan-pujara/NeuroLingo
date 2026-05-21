import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LessonCard } from "@/components/lessons/lesson-card";
import {
    LessonsTabSwitcher,
    type LessonsTab,
} from "@/components/lessons/lessons-tab-switcher";
import { UnitHeroImage } from "@/components/lessons/unit-hero-image";
import { getLanguageById } from "@/data/languages";
import { getLessonsScreenContext } from "@/lib/lessons-screen";
import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/language-store";
import { useProgressStore } from "@/store/progress-store";

const safeAreaStyle = { flex: 1, backgroundColor: "#ffffff" } as const;

const listContentStyle = { paddingHorizontal: 20, paddingBottom: 24 } as const;

export default function LearnScreen() {
  const router = useRouter();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const hasLanguageHydrated = useLanguageStore((state) => state.hasHydrated);
  const completedLessonIds = useProgressStore((state) => state.completedLessonIds);
  const hasProgressHydrated = useProgressStore((state) => state.hasHydrated);
  const [activeTab, setActiveTab] = useState<LessonsTab>("lessons");

  const isReady = hasLanguageHydrated && hasProgressHydrated;

  const screenContext =
    selectedLanguageId && isReady
      ? getLessonsScreenContext(selectedLanguageId, completedLessonIds)
      : null;

  if (!isReady) {
    return (
      <SafeAreaView style={safeAreaStyle}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6C4EF5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!selectedLanguageId || !screenContext) {
    return (
      <SafeAreaView style={safeAreaStyle}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="typ-h3 text-center text-ink">Choose a language to see lessons</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/choose-language")}
            className="mt-4 rounded-full bg-lingua-purple px-6 py-3 active:opacity-90"
          >
            <Text className="font-poppins-semibold text-white">Select language</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const language = getLanguageById(selectedLanguageId);
  const { headerTitle, headerSubtitle, lessons } = screenContext;

  const handleLessonPress = (lessonId: string, lessonTitle: string) => {
    posthog.capture("lesson_card_pressed", {
      language_id: selectedLanguageId,
      lesson_id: lessonId,
      lesson_title: lessonTitle,
    });
    router.push(`/lesson/${lessonId}` as Href);
  };

  return (
    <SafeAreaView style={safeAreaStyle} edges={["top"]}>
      <View className="flex-1 bg-white">
        <View className="flex-row items-center px-5 pb-2 pt-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.push("/")}
            hitSlop={8}
            className="h-10 w-10 items-center justify-center active:opacity-70"
          >
            <Ionicons name="chevron-back" size={26} color="#0D132B" />
          </Pressable>
          <View className="ml-1 flex-1">
            <Text className="font-poppins-bold text-xl text-ink" numberOfLines={1}>
              {headerTitle}
            </Text>
            <Text className="font-poppins text-sm text-ink-secondary">
              {headerSubtitle}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Bookmark unit"
            hitSlop={8}
            className="h-10 w-10 items-center justify-center active:opacity-70"
          >
            <Ionicons name="bookmark" size={24} color="#FF8A00" />
          </Pressable>
        </View>

        <UnitHeroImage />

        <LessonsTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "practice" ? (
          <ScrollView
            contentContainerStyle={{ ...listContentStyle, paddingTop: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="items-center rounded-2xl border border-border bg-surface px-6 py-10">
              <Ionicons name="barbell-outline" size={40} color="#6C4EF5" />
              <Text className="mt-3 font-poppins-semibold text-lg text-ink">
                Practice coming soon
              </Text>
              <Text className="mt-2 text-center typ-body-md text-ink-secondary">
                Review exercises for {language?.name ?? "your language"} will appear here.
              </Text>
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={lessons}
            keyExtractor={(item) => item.lesson.id}
            renderItem={({ item }) => (
              <LessonCard
                item={item}
                onPress={() =>
                  handleLessonPress(item.lesson.id, item.lesson.title)
                }
              />
            )}
            contentContainerStyle={{ ...listContentStyle, paddingTop: 12 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
