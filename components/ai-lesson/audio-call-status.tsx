import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import type {
  AudioLessonCallStatus,
  AudioLessonParticipantInfo,
  VisionAgentConnectionStatus,
} from "@/types/stream";

type AudioCallStatusProps = {
  status: AudioLessonCallStatus;
  statusMessage: string;
  agentStatus: VisionAgentConnectionStatus;
  agentStatusMessage: string;
  lessonTitle: string;
  languageName: string;
  localUser: AudioLessonParticipantInfo | null;
  participants: AudioLessonParticipantInfo[];
  onRetry?: () => void;
  onRetryAgent?: () => void;
};

function ParticipantChip({ participant }: { participant: AudioLessonParticipantInfo }) {
  return (
    <View className="mr-2 flex-row items-center rounded-full border border-border bg-white px-2 py-1">
      {participant.imageUrl ? (
        <Image
          source={{ uri: participant.imageUrl }}
          className="mr-1.5 h-5 w-5 rounded-full"
          contentFit="cover"
        />
      ) : (
        <View className="mr-1.5 h-5 w-5 items-center justify-center rounded-full bg-lingua-purple/15">
          <Ionicons name="person" size={12} color="#6C4EF5" />
        </View>
      )}
      <Text className="font-poppins-medium text-xs text-ink" numberOfLines={1}>
        {participant.isLocal ? "You" : participant.name}
      </Text>
    </View>
  );
}

function agentStatusTone(status: VisionAgentConnectionStatus): string {
  switch (status) {
    case "connected":
      return "text-lingua-green";
    case "connecting":
      return "text-streak";
    case "failed":
      return "text-error";
    case "idle":
    default:
      return "text-ink-secondary";
  }
}

function agentStatusIcon(status: VisionAgentConnectionStatus): keyof typeof Ionicons.glyphMap {
  switch (status) {
    case "connected":
      return "checkmark-circle";
    case "connecting":
      return "sync-outline";
    case "failed":
      return "alert-circle-outline";
    case "idle":
    default:
      return "sparkles-outline";
  }
}

/** Lesson context, participants, and AI teacher connection status. */
export function AudioCallStatus({
  status,
  statusMessage,
  agentStatus,
  agentStatusMessage,
  lessonTitle,
  languageName,
  localUser,
  participants,
  onRetry,
  onRetryAgent,
}: AudioCallStatusProps) {
  const showParticipants =
    localUser || participants.length > 0 || status === "joined";
  const showCallError = status === "error";
  const showAgentError = agentStatus === "failed";

  return (
    <View className="mx-5 mb-1 rounded-2xl border border-border bg-white px-4 py-2.5">
      <Text className="font-poppins-semibold text-sm text-ink" numberOfLines={1}>
        {languageName} · {lessonTitle}
      </Text>

      <View className="mt-2 flex-row items-center">
        <Ionicons name={agentStatusIcon(agentStatus)} size={16} color="#6C4EF5" />
        <Text
          className={`ml-2 flex-1 font-poppins text-xs ${agentStatusTone(agentStatus)}`}
          numberOfLines={2}
        >
          {agentStatusMessage}
        </Text>
      </View>

      {showCallError ? (
        <View className="mt-2 flex-row items-start">
          <Ionicons name="alert-circle-outline" size={16} color="#FF4D4F" />
          <Text className="ml-2 flex-1 font-poppins text-xs text-error">{statusMessage}</Text>
        </View>
      ) : null}

      {showParticipants ? (
        <View className="mt-2 flex-row flex-wrap items-center">
          {localUser ? <ParticipantChip participant={localUser} /> : null}
          {participants.map((participant) => (
            <ParticipantChip key={participant.id} participant={participant} />
          ))}
          {status === "joined" && participants.length === 0 && agentStatus === "connecting" ? (
            <Text className="font-poppins text-xs text-ink-secondary">
              Waiting for tutor to join…
            </Text>
          ) : null}
        </View>
      ) : null}

      {showCallError && onRetry ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          className="mt-2 self-start rounded-full bg-lingua-purple px-4 py-2 active:opacity-90"
        >
          <Text className="font-poppins-semibold text-xs text-white">Retry call</Text>
        </Pressable>
      ) : null}

      {showAgentError && onRetryAgent ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRetryAgent}
          className="mt-2 self-start rounded-full border border-lingua-purple px-4 py-2 active:opacity-90"
        >
          <Text className="font-poppins-semibold text-xs text-lingua-purple">Retry AI teacher</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
