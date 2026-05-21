import { Text, View } from "react-native";

import type { LessonGoal, Phrase } from "@/types/learning";

type LessonContextCardProps = {
  languageName: string;
  lessonTitle: string;
  goals: LessonGoal[];
  phrases: Phrase[];
  focusAreas: string[];
};

export function LessonContextCard({
  languageName,
  lessonTitle,
  goals,
  phrases,
  focusAreas,
}: LessonContextCardProps) {
  return (
    <View className="mx-5 mt-4 rounded-2xl border border-border bg-surface px-4 py-4">
      <Text className="font-poppins-semibold text-xs uppercase tracking-wide text-lingua-purple">
        {languageName}
      </Text>
      <Text className="mt-1 font-poppins-bold text-lg text-ink">{lessonTitle}</Text>

      {goals.length > 0 ? (
        <View className="mt-3">
          <Text className="font-poppins-semibold text-sm text-ink">Goals</Text>
          {goals.map((goal) => (
            <Text
              key={goal.id}
              className="mt-1 font-poppins text-sm leading-5 text-ink-secondary"
            >
              • {goal.description}
            </Text>
          ))}
        </View>
      ) : null}

      {phrases.length > 0 ? (
        <View className="mt-3">
          <Text className="font-poppins-semibold text-sm text-ink">Phrases</Text>
          {phrases.map((phrase) => (
            <View key={phrase.id} className="mt-2">
              <Text className="font-poppins-semibold text-[15px] text-ink">
                {phrase.text}
              </Text>
              <Text className="font-poppins text-sm text-ink-secondary">
                {phrase.translation}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {focusAreas.length > 0 ? (
        <View className="mt-3">
          <Text className="font-poppins-semibold text-sm text-ink">Focus</Text>
          <Text className="mt-1 font-poppins text-sm leading-5 text-ink-secondary">
            {focusAreas.join(" · ")}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
