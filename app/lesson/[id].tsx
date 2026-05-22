import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StreamCall, StreamVideo } from "@stream-io/video-react-native-sdk";

import { AiLessonHeader } from "@/components/ai-lesson/ai-lesson-header";
import { AudioCallStatus } from "@/components/ai-lesson/audio-call-status";
import { CallControls } from "@/components/ai-lesson/call-controls";
import { LessonContextCard } from "@/components/ai-lesson/lesson-context-card";
import { LessonFeedbackCard } from "@/components/ai-lesson/lesson-feedback-card";
import { TeacherStage } from "@/components/ai-lesson/teacher-stage";
import { useStreamAudioLesson } from "@/hooks/use-stream-audio-lesson";
import { getAiLessonContext } from "@/lib/ai-lesson";
import { posthog } from "@/lib/posthog";
import { useProgressStore } from "@/store/progress-store";
import type { AudioLessonCallStatus } from "@/types/stream";

const safeAreaStyle = { flex: 1, backgroundColor: "#ffffff" } as const;

/** How far the rating card overlaps the stage vs white area (half-and-half). */
const FEEDBACK_OVERLAP = 38;

function headerToneFromStatus(
  status: AudioLessonCallStatus,
  agentStatus: "idle" | "connecting" | "connected" | "failed",
): "online" | "connecting" | "muted" | "error" | "ended" {
  if (agentStatus === "failed" || status === "error") return "error";
  switch (status) {
    case "joined":
      return agentStatus === "connected" ? "online" : "connecting";
    case "muted":
      return "muted";
    case "ended":
      return "ended";
    case "loading":
    case "connecting":
    case "idle":
    default:
      return "connecting";
  }
}

type AiLessonBodyProps = {
  context: NonNullable<ReturnType<typeof getAiLessonContext>>;
  streak: number;
  onBack: () => void;
};

function AiLessonBody({ context, streak, onBack }: AiLessonBodyProps) {
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

  const {
    client,
    call,
    status,
    statusMessage,
    error,
    micEnabled,
    localUser,
    participants,
    agentStatus,
    agentStatusMessage,
    startCall,
    retryAgent,
    toggleMic,
    endCall,
  } = useStreamAudioLesson(context);

  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  const headerStatusLabel = useMemo(() => {
    if (error) return error;
    if (agentStatus === "failed") return agentStatusMessage;
    if (agentStatus === "connecting") return agentStatusMessage;
    if (agentStatus === "connected" && status === "joined") return "Live with AI teacher";
    return statusMessage;
  }, [agentStatus, agentStatusMessage, error, status, statusMessage]);

  const handleEndCall = async () => {
    await endCall();
    posthog.capture("ai_lesson_ended", {
      lesson_id: lesson.id,
      language_id: lesson.languageId,
    });
    onBack();
  };

  const handleToggleMic = async () => {
    await toggleMic();
  };

  const handleToggleCamera = () => {
    Alert.alert(
      "Camera preview",
      "This is an audio-only lesson. Video is disabled; the stage shows your AI tutor.",
    );
  };

  const lessonContent = (
    <>
      <AiLessonHeader
        streak={streak}
        statusLabel={headerStatusLabel}
        statusTone={headerToneFromStatus(status, agentStatus)}
        onBack={onBack}
      />

      <AudioCallStatus
        status={status}
        statusMessage={statusMessage}
        agentStatus={agentStatus}
        agentStatusMessage={agentStatusMessage}
        lessonTitle={lesson.title}
        languageName={language.name}
        localUser={localUser}
        participants={participants}
        onRetry={status === "error" ? startCall : undefined}
        onRetryAgent={agentStatus === "failed" ? retryAgent : undefined}
      />

      <View style={styles.lessonBody}>
        <View style={styles.stageShell}>
          <TeacherStage
            bubblePrimary={bubblePrimary}
            bubbleSecondary={bubbleSecondary}
            showSubtitles={subtitlesEnabled}
            localUserImageUrl={localUser?.imageUrl}
            localUserName={localUser?.name}
          />
          <View pointerEvents="none" style={styles.controlsScrim} />
          <View style={styles.controlsOverlay}>
            <CallControls
              overlay
              micEnabled={micEnabled}
              subtitlesEnabled={subtitlesEnabled}
              onToggleMic={handleToggleMic}
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
    </>
  );

  if (!client) {
    return lessonContent;
  }

  if (call) {
    return (
      <StreamVideo client={client}>
        <StreamCall call={call}>{lessonContent}</StreamCall>
      </StreamVideo>
    );
  }

  return <StreamVideo client={client}>{lessonContent}</StreamVideo>;
}

export default function AiLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = typeof id === "string" ? id : "";
  const context = lessonId ? getAiLessonContext(lessonId) : null;
  const streak = useProgressStore((state) => state.streak);

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

  return (
    <GestureHandlerRootView style={safeAreaStyle}>
      <SafeAreaView style={safeAreaStyle} edges={["top"]}>
        <AiLessonBody
          context={context}
          streak={streak}
          onBack={() => router.back()}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  lessonBody: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 2,
    paddingBottom: FEEDBACK_OVERLAP,
  },
  stageShell: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    minHeight: 360,
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
