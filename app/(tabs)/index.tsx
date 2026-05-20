import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AI_TEACHER_AVATAR_URI, images } from "@/constants/images";
import { getHomeLearningContext, type TodaysPlanItem } from "@/lib/home-data";
import { useLanguageStore } from "@/store/language-store";
import { useProgressStore } from "@/store/progress-store";

function HomeHeader({
  flagUri,
  greeting,
  streak,
}: {
  flagUri: string;
  greeting: string;
  streak: number;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center">
        <Image
          source={{ uri: flagUri }}
          style={styles.flagAvatar}
          contentFit="cover"
        />
        <Text className="ml-3 font-poppins-bold text-xl text-ink">{greeting}</Text>
      </View>
      <View className="flex-row items-center gap-3">
        <View className="flex-row items-center gap-1">
          <Image source={images.streakFire} style={styles.streakIcon} contentFit="contain" />
          <Text className="font-poppins-semibold text-base text-ink">{streak}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          hitSlop={8}
          className="active:opacity-70"
        >
          <Ionicons name="notifications-outline" size={24} color="#0D132B" />
        </Pressable>
      </View>
    </View>
  );
}

function DailyGoalCard({
  dailyXp,
  dailyGoalXp,
}: {
  dailyXp: number;
  dailyGoalXp: number;
}) {
  const progress = Math.min(dailyXp / dailyGoalXp, 1);

  return (
    <View className="mt-5 flex-row items-center overflow-hidden rounded-3xl bg-[#FFF9F0] px-5 py-4">
      <View className="flex-1 pr-3">
        <Text className="typ-body-sm text-ink-secondary">Daily goal</Text>
        <View className="mt-1 flex-row items-baseline">
          <Text className="font-poppins-bold text-[28px] leading-8 text-ink">{dailyXp}</Text>
          <Text className="ml-1 font-poppins-medium text-base text-ink-secondary">
            / {dailyGoalXp} XP
          </Text>
        </View>
        <View className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#FFE4C4]">
          <View
            className="h-full rounded-full bg-streak"
            style={{ width: `${progress * 100}%` }}
          />
        </View>
      </View>
      <Image source={images.treasure} style={styles.treasureImage} contentFit="contain" />
    </View>
  );
}

function ContinueLearningCard({
  languageName,
  levelLabel,
  onContinue,
}: {
  languageName: string;
  levelLabel: string;
  onContinue: () => void;
}) {
  return (
    <View
      className="mt-4 overflow-hidden rounded-3xl"
      style={{
        experimental_backgroundImage:
          "linear-gradient(135deg, #6C4EF5 0%, #5B3BF6 45%, #4D8BFF 100%)",
      }}
    >
      <View className="min-h-[168px] flex-row items-center px-5 py-5">
        <View className="z-10 flex-1 pr-2">
          <Text className="typ-body-sm text-white/90">Continue learning</Text>
          <Text className="mt-1 font-poppins-bold text-[26px] leading-8 text-white">
            {languageName}
          </Text>
          <Text className="mt-0.5 font-poppins-medium text-[15px] text-white/95">
            {levelLabel}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onContinue}
            className="mt-4 self-start rounded-full bg-white px-5 py-2.5 active:opacity-90"
          >
            <Text className="font-poppins-semibold text-sm text-lingua-purple">Continue</Text>
          </Pressable>
        </View>
        <Image source={images.palace} style={styles.palaceImage} contentFit="contain" />
      </View>
    </View>
  );
}

function PlanStatusIndicator({ completed }: { completed: boolean }) {
  if (completed) {
    return (
      <View className="h-7 w-7 items-center justify-center rounded-full bg-lingua-purple">
        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
      </View>
    );
  }

  return <View className="h-7 w-7 rounded-full border-2 border-[#D1D5DB]" />;
}

function PlanItemIcon({ item }: { item: TodaysPlanItem }) {
  const iconName =
    item.iconName === "book"
      ? "book"
      : item.iconName === "headset"
        ? "headset"
        : "flash";

  return (
    <View
      className={`h-12 w-12 items-center justify-center rounded-2xl ${item.iconBackgroundClass}`}
    >
      <Ionicons name={iconName} size={22} color="#FFFFFF" />
    </View>
  );
}

function TodaysPlanSection({ items }: { items: TodaysPlanItem[] }) {
  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between">
        <Text className="font-poppins-semibold text-lg text-ink">Today&apos;s plan</Text>
        <Pressable accessibilityRole="button" hitSlop={8} className="active:opacity-70">
          <Text className="font-poppins-semibold text-sm text-lingua-purple">View all</Text>
        </Pressable>
      </View>
      <View className="mt-3 gap-3">
        {items.map((item) => (
          <View key={item.id} className="flex-row items-center">
            <PlanItemIcon item={item} />
            <View className="ml-3.5 flex-1">
              <Text className="font-poppins-semibold text-base text-ink">{item.title}</Text>
              <Text className="typ-body-sm mt-0.5 text-ink-secondary">{item.subtitle}</Text>
            </View>
            <PlanStatusIndicator completed={item.completed} />
          </View>
        ))}
      </View>
    </View>
  );
}

function NextUpCard() {
  return (
    <View className="mt-5 flex-row items-center overflow-hidden rounded-3xl bg-[#F0F9F4] px-5 py-4">
      <View className="flex-1 pr-3">
        <Text className="typ-body-sm font-poppins-medium text-[#166534]">Next up</Text>
        <Text className="mt-1 font-poppins-bold text-xl text-ink">AI Video Call</Text>
        <Text className="typ-body-sm mt-0.5 text-ink-secondary">Practice speaking</Text>
      </View>
      <View className="relative h-[72px] w-[72px]">
        <Image
          source={{ uri: AI_TEACHER_AVATAR_URI }}
          style={styles.teacherAvatar}
          contentFit="cover"
        />
        <View className="absolute -bottom-0.5 -right-0.5 h-9 w-9 items-center justify-center rounded-full bg-lingua-green shadow-sm">
          <Ionicons name="videocam" size={18} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const selectedLanguageId = useLanguageStore((state) => state.selectedLanguageId);
  const hasLanguageHydrated = useLanguageStore((state) => state.hasHydrated);
  const dailyXp = useProgressStore((state) => state.dailyXp);
  const dailyGoalXp = useProgressStore((state) => state.dailyGoalXp);
  const streak = useProgressStore((state) => state.streak);
  const completedLessonIds = useProgressStore((state) => state.completedLessonIds);
  const completedPlanStepIds = useProgressStore((state) => state.completedPlanStepIds);
  const hasProgressHydrated = useProgressStore((state) => state.hasHydrated);

  const isReady = isUserLoaded && hasLanguageHydrated && hasProgressHydrated;

  const learningContext =
    selectedLanguageId && isReady
      ? getHomeLearningContext(
          selectedLanguageId,
          completedLessonIds,
          completedPlanStepIds,
        )
      : null;

  const firstName = user?.firstName?.trim() || "Learner";
  const greeting = `Hola, ${firstName}! 👋`;

  if (!isReady) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6C4EF5" />
        </View>
      </SafeAreaView>
    );
  }

  if (!learningContext) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="typ-h3 text-center text-ink">Choose a language to get started</Text>
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

  const { language, continueSubtitle, todaysPlan } = learningContext;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HomeHeader flagUri={language.flag} greeting={greeting} streak={streak} />
        <DailyGoalCard dailyXp={dailyXp} dailyGoalXp={dailyGoalXp} />
        <ContinueLearningCard
          languageName={language.name}
          levelLabel={continueSubtitle}
          onContinue={() => router.push("/learn")}
        />
        <TodaysPlanSection items={todaysPlan} />
        <NextUpCard />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  flagAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  streakIcon: {
    width: 22,
    height: 22,
  },
  treasureImage: {
    width: 88,
    height: 88,
  },
  palaceImage: {
    width: 120,
    height: 120,
  },
  teacherAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
});
