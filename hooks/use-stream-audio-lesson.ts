import { useAuth, useUser } from "@clerk/expo";
import {
  callManager,
  CallingState,
  StreamVideoClient,
  type Call,
  type User as StreamUser,
} from "@stream-io/video-react-native-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import { useVisionAgentSession } from "@/hooks/use-vision-agent-session";
import type { AiLessonContext } from "@/lib/ai-lesson";
import { buildLessonCallCustom } from "@/lib/lesson-call-custom";
import { posthog } from "@/lib/posthog";
import { leaveCallIfJoined } from "@/lib/stream-call-lifecycle";
import { fetchStreamToken, prepareLessonAudioCall } from "@/lib/stream-api";
import type {
  AudioLessonCallStatus,
  AudioLessonParticipantInfo,
  VisionAgentConnectionStatus,
} from "@/types/stream";

type UseStreamAudioLessonResult = {
  client: StreamVideoClient | null;
  call: Call | null;
  status: AudioLessonCallStatus;
  statusMessage: string;
  error: string | null;
  micEnabled: boolean;
  localUser: AudioLessonParticipantInfo | null;
  participants: AudioLessonParticipantInfo[];
  agentStatus: VisionAgentConnectionStatus;
  agentStatusMessage: string;
  agentError: string | null;
  startCall: () => Promise<void>;
  retryAgent: () => Promise<void>;
  toggleMic: () => Promise<void>;
  endCall: () => Promise<void>;
};

function mapCallingStateToStatus(
  callingState: CallingState | undefined,
  micMuted: boolean,
  hasError: boolean,
  manuallyEnded: boolean,
  hasJoined: boolean,
): AudioLessonCallStatus {
  if (hasError) return "error";
  if (manuallyEnded) return "ended";

  if (callingState === CallingState.LEFT) {
    return hasJoined ? "ended" : "error";
  }

  switch (callingState) {
    case CallingState.JOINED:
      return micMuted ? "muted" : "joined";
    case CallingState.JOINING:
    case CallingState.RECONNECTING:
    case CallingState.MIGRATING:
    case CallingState.RINGING:
    case CallingState.IDLE:
    case CallingState.UNKNOWN:
      return "connecting";
    case CallingState.RECONNECTING_FAILED:
    case CallingState.OFFLINE:
      return "error";
    default:
      return "connecting";
  }
}

function statusLabel(status: AudioLessonCallStatus): string {
  switch (status) {
    case "idle":
      return "Ready to start";
    case "loading":
      return "Preparing audio lesson…";
    case "connecting":
      return "Connecting to tutor…";
    case "joined":
      return "Live audio lesson";
    case "muted":
      return "Microphone muted";
    case "error":
      return "Connection issue";
    case "ended":
      return "Call ended";
    default:
      return "";
  }
}

export function useStreamAudioLesson(
  context: AiLessonContext | null,
): UseStreamAudioLessonResult {
  const { getToken, isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [status, setStatus] = useState<AudioLessonCallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [participants, setParticipants] = useState<AudioLessonParticipantInfo[]>([]);
  const [callingState, setCallingState] = useState<CallingState | undefined>();
  const [manuallyEnded, setManuallyEnded] = useState(false);
  const [preparedCallId, setPreparedCallId] = useState<string | null>(null);

  const callRef = useRef<Call | null>(null);
  const clientRef = useRef<StreamVideoClient | null>(null);
  const startingRef = useRef(false);
  const hasJoinedRef = useRef(false);
  const endingRef = useRef(false);

  const localUser: AudioLessonParticipantInfo | null = user
    ? {
        id: user.id,
        name: user.fullName ?? user.firstName ?? "You",
        imageUrl: user.imageUrl,
        isLocal: true,
      }
    : null;

  const getClerkToken = useCallback(async () => {
    if (!isSignedIn) return null;
    return getToken();
  }, [getToken, isSignedIn]);

  const isCallJoined = callingState === CallingState.JOINED;

  const {
    status: agentStatus,
    statusMessage: agentStatusMessage,
    error: agentError,
    startAgent,
    stopAgent,
  } = useVisionAgentSession({
    context,
    callId: preparedCallId,
    enabled: Boolean(preparedCallId) && isCallJoined && !manuallyEnded,
    getClerkToken,
    participants,
  });

  const syncParticipants = useCallback((activeCall: Call) => {
    const remote = activeCall.state.participants.map((participant) => ({
      id: participant.userId,
      name: participant.name ?? "Tutor",
      imageUrl: participant.image,
    }));
    setParticipants(remote);
  }, []);

  const startCall = useCallback(async () => {
    if (!context || startingRef.current || manuallyEnded) return;
    if (!isAuthLoaded || !isUserLoaded) return;

    if (!isSignedIn || !user) {
      setError("Sign in to start the audio lesson call.");
      setStatus("error");
      return;
    }

    startingRef.current = true;
    hasJoinedRef.current = false;
    setPreparedCallId(null);
    setStatus("loading");
    setError(null);

    const { lesson, language } = context;
    const profile = {
      name: user.fullName ?? user.firstName ?? "Learner",
      imageUrl: user.imageUrl,
    };

    try {
      const session = await prepareLessonAudioCall(getClerkToken, {
        ...buildLessonCallCustom(context),
        userDisplayName: profile.name,
        userImageUrl: profile.imageUrl,
      });

      const { token, apiKey } = await fetchStreamToken(getClerkToken, profile);

      const streamUser: StreamUser = {
        id: user.id,
        name: profile.name,
        image: profile.imageUrl,
      };

      const tokenProvider = async () => {
        const refreshed = await fetchStreamToken(getClerkToken, profile);
        return refreshed.token;
      };

      const videoClient = StreamVideoClient.getOrCreateInstance({
        apiKey,
        user: streamUser,
        token,
        tokenProvider,
      });

      clientRef.current = videoClient;
      const lessonCall = videoClient.call(session.callType, session.callId);
      callRef.current = lessonCall;

      setStatus("connecting");
      setClient(videoClient);
      setCall(lessonCall);

      callManager.start({
        audioRole: "communicator",
        deviceEndpointType: "speaker",
      });

      await lessonCall.join({ create: false });
      await lessonCall.camera.disable();
      setMicEnabled(true);
      hasJoinedRef.current = true;
      setPreparedCallId(session.callId);

      posthog.capture("audio_lesson_call_joined", {
        lesson_id: lesson.id,
        language_id: lesson.languageId,
        call_id: session.callId,
        call_cid: session.callCid,
      });

      syncParticipants(lessonCall);
    } catch (startError) {
      setPreparedCallId(null);
      hasJoinedRef.current = false;
      const message =
        startError instanceof Error
          ? startError.message
          : "Could not start the audio lesson.";
      setError(message);
      setStatus("error");
      posthog.capture("audio_lesson_call_error", {
        lesson_id: lesson.id,
        language_id: lesson.languageId,
        message,
      });
    } finally {
      startingRef.current = false;
    }
  }, [
    context,
    getClerkToken,
    isAuthLoaded,
    isSignedIn,
    isUserLoaded,
    manuallyEnded,
    syncParticipants,
    user,
  ]);

  const toggleMic = useCallback(async () => {
    const activeCall = callRef.current;
    if (!activeCall) return;

    try {
      await activeCall.microphone.toggle();
      const isMuted = activeCall.microphone.state.status === "disabled";
      setMicEnabled(!isMuted);
    } catch (toggleError) {
      console.error("Failed to toggle microphone", toggleError);
    }
  }, []);

  const endCall = useCallback(async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    setManuallyEnded(true);

    const activeCall = callRef.current;
    const activeClient = clientRef.current;

    try {
      await stopAgent();
      await leaveCallIfJoined(activeCall);
      if (activeClient) {
        await activeClient.disconnectUser();
      }
    } catch (leaveError) {
      console.error("Failed to end call", leaveError);
    } finally {
      callRef.current = null;
      clientRef.current = null;
      hasJoinedRef.current = false;
      setCall(null);
      setClient(null);
      setParticipants([]);
      setPreparedCallId(null);
      setStatus("ended");
      endingRef.current = false;

      if (context) {
        posthog.capture("audio_lesson_call_ended", {
          lesson_id: context.lesson.id,
          language_id: context.lesson.languageId,
        });
      }
    }
  }, [context, stopAgent]);

  useEffect(() => {
    if (!call) return;

    const subscription = call.state.callingState$.subscribe((nextState) => {
      setCallingState(nextState);
      if (nextState === CallingState.JOINED) {
        hasJoinedRef.current = true;
      }
    });

    const participantsSubscription = call.state.participants$.subscribe(() => {
      syncParticipants(call);
    });

    setCallingState(call.state.callingState);
    if (call.state.callingState === CallingState.JOINED) {
      hasJoinedRef.current = true;
    }
    syncParticipants(call);

    return () => {
      subscription.unsubscribe();
      participantsSubscription.unsubscribe();
    };
  }, [call, syncParticipants]);

  useEffect(() => {
    const micMuted = !micEnabled;
    const nextStatus = mapCallingStateToStatus(
      callingState,
      micMuted,
      Boolean(error),
      manuallyEnded,
      hasJoinedRef.current,
    );
    setStatus(nextStatus);
  }, [callingState, micEnabled, error, manuallyEnded]);

  useEffect(() => {
    if (!context || !isAuthLoaded || !isUserLoaded) return;
    if (status !== "idle" || manuallyEnded) return;
    void startCall();
  }, [context, isAuthLoaded, isUserLoaded, manuallyEnded, startCall, status]);

  const stopAgentRef = useRef(stopAgent);
  stopAgentRef.current = stopAgent;

  useEffect(() => {
    return () => {
      void stopAgentRef.current();
      void leaveCallIfJoined(callRef.current).catch(() => undefined);
      const activeClient = clientRef.current;
      if (activeClient) {
        void activeClient.disconnectUser().catch(() => undefined);
      }
    };
  }, []);

  return {
    client,
    call,
    status,
    statusMessage: error ?? statusLabel(status),
    error,
    micEnabled,
    localUser,
    participants,
    agentStatus,
    agentStatusMessage,
    agentError,
    startCall,
    retryAgent: startAgent,
    toggleMic,
    endCall,
  };
}
