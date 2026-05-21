import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import type { LessonCardModel } from "@/lib/lessons-screen";

type LessonCardProps = {
  item: LessonCardModel;
  onPress: () => void;
};

function LessonStatusIcon({ item }: { item: LessonCardModel }) {
  if (item.status === "completed") {
    return (
      <View className="h-9 w-9 items-center justify-center rounded-full bg-lingua-green">
        <Ionicons name="checkmark" size={22} color="#FFFFFF" />
      </View>
    );
  }

  if (item.status === "in_progress") {
    return (
      <Image
        source={item.imageUri}
        className="h-[52px] w-[52px] rounded-xl"
        contentFit="cover"
      />
    );
  }

  return (
    <View className="h-9 w-9 items-center justify-center">
      <Ionicons name="lock-closed-outline" size={26} color="#9CA3AF" />
    </View>
  );
}

export function LessonCard({ item, onPress }: LessonCardProps) {
  const { lesson, order, status } = item;
  const isInProgress = status === "in_progress";
  const isNotStarted = status === "not_started";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Lesson ${order}: ${lesson.title}`}
      onPress={onPress}
      className={`mb-3 flex-row items-center rounded-2xl border px-4 py-4 active:opacity-90 ${
        isInProgress
          ? "border-lingua-purple bg-[#F5F3FF]"
          : "border-border bg-white"
      }`}
    >
      <View className="flex-1 pr-3">
        <Text
          className={`font-poppins-medium text-xs ${
            isInProgress ? "text-lingua-purple" : "text-ink-secondary"
          }`}
        >
          Lesson {order}
        </Text>
        <Text
          className={`mt-0.5 font-poppins-semibold text-base ${
            isNotStarted ? "text-ink-secondary" : "text-ink"
          }`}
        >
          {lesson.title}
        </Text>
        {isInProgress ? (
          <Text className="mt-1 font-poppins-medium text-sm text-lingua-purple">
            In progress
          </Text>
        ) : null}
        {isNotStarted ? (
          <Text className="mt-1 font-poppins text-xs text-ink-secondary">
            0 / 6 lessons
          </Text>
        ) : null}
      </View>
      <LessonStatusIcon item={item} />
    </Pressable>
  );
}
