import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AiLessonHeader } from "@/components/ai-lesson/ai-lesson-header";
import { CallControls } from "@/components/ai-lesson/call-controls";
import { LessonContextCard } from "@/components/ai-lesson/lesson-context-card";
import { LessonFeedbackCard } from "@/components/ai-lesson/lesson-feedback-card";
import { TeacherStage } from "@/components/ai-lesson/teacher-stage";
import { getAiLessonContext } from "@/lib/ai-lesson";
import { posthog } from "@/lib/posthog";
import { useProgressStore } from "@/store/progress-store";

const safeAreaStyle = { flex: 1, backgroundColor: "#ffffff" } as const;

/** How far the rating card overlaps the stage vs white area (half-and-half). */
const FEEDBACK_OVERLAP = 38;

export default function AiLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = typeof id === "string" ? id : "";
  const context = lessonId ? getAiLessonContext(lessonId) : null;
  const streak = useProgressStore((state) => state.streak);

  const [micEnabled, setMicEnabled] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    posthog.capture("ai_lesson_started", { lesson_id: lessonId });
  }, [lessonId]);

  if (!context) {
    return (
      <SafeAreaView style={safeAreaStyle}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="typ-h3 text-center text-ink">Lesson not found</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            className="mt-4 rounded-full bg-lingua-purple px-6 py-3"
          >
            <Text className="font-poppins-semibold text-white">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const {
    lesson,
    language,
    bubblePrimary,
    bubbleSecondary,
    goals,
    phrases,
    focusAreas,
    feedbackScores,
  } = context;

  const handleEndCall = () => {
    posthog.capture("ai_lesson_ended", {
      lesson_id: lesson.id,
      language_id: lesson.languageId,
    });
    router.back();
  };

  const handleToggleCamera = () => {
    Alert.alert(
      "Camera preview",
      "Video calling is not part of this audio lesson. The camera area is a visual placeholder only.",
    );
  };

  return (
    <SafeAreaView style={safeAreaStyle} edges={["top"]}>
      <AiLessonHeader streak={streak} onBack={() => router.back()} />

      <View style={styles.lessonBody}>
        <View style={styles.stageShell}>
          <TeacherStage
            bubblePrimary={bubblePrimary}
            bubbleSecondary={bubbleSecondary}
            showSubtitles={subtitlesEnabled}
          />
          <View pointerEvents="none" style={styles.controlsScrim} />
          <View style={styles.controlsOverlay}>
            <CallControls
              overlay
              micEnabled={micEnabled}
              subtitlesEnabled={subtitlesEnabled}
              onToggleMic={() => setMicEnabled((value) => !value)}
              onToggleSubtitles={() => setSubtitlesEnabled((value) => !value)}
              onToggleCamera={handleToggleCamera}
              onEndCall={handleEndCall}
            />
          </View>
        </View>

        <View style={styles.feedbackOverlap}>
          <LessonFeedbackCard overlapping scores={feedbackScores} />
        </View>
      </View>

      {subtitlesEnabled ? (
        <ScrollView
          style={styles.contextScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          <LessonContextCard
            languageName={language.name}
            lessonTitle={lesson.title}
            goals={goals}
            phrases={phrases}
            focusAreas={focusAreas}
          />
        </ScrollView>
      ) : (
        <View style={styles.bottomSpacer} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lessonBody: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 4,
    paddingBottom: FEEDBACK_OVERLAP,
  },
  stageShell: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 400,
  },
  controlsScrim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    zIndex: 5,
    experimental_backgroundImage:
      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(60,50,45,0.38) 100%)",
  },
  controlsOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 26,
    zIndex: 10,
  },
  feedbackOverlap: {
    marginTop: -FEEDBACK_OVERLAP,
    zIndex: 20,
  },
  contextScroll: {
    flex: 1,
    maxHeight: 140,
    marginTop: 4,
  },
  bottomSpacer: {
    height: 12,
  },
});
