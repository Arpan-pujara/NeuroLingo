import { StyleSheet, Text, View } from "react-native";

import type { LessonFeedbackScore } from "@/lib/ai-lesson";

type LessonFeedbackCardProps = {
  scores: LessonFeedbackScore[];
  overlapping?: boolean;
};

export function LessonFeedbackCard({ scores, overlapping }: LessonFeedbackCardProps) {
  return (
    <View
      className={`mx-5 flex-row overflow-hidden rounded-2xl border border-border bg-white py-4 ${
        overlapping ? "" : "mt-5"
      }`}
      style={overlapping ? styles.overlapping : undefined}
    >
      {scores.map((score, index) => (
        <View
          key={score.label}
          className={`flex-1 items-center px-2 ${index < scores.length - 1 ? "border-r border-border" : ""}`}
        >
          <Text className="font-poppins-medium text-sm text-ink-secondary">
            {score.label}
          </Text>
          <Text className={`mt-1 font-poppins-bold text-base ${score.colorClass}`}>
            {score.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlapping: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
});
