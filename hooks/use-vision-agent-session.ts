import { useCallback, useEffect, useRef, useState } from "react";

import type { AiLessonContext } from "@/lib/ai-lesson";
import { posthog } from "@/lib/posthog";
import { NEUROLINGO_AGENT_USER_ID } from "@/lib/stream-agent";
import { STREAM_AUDIO_CALL_TYPE } from "@/lib/stream-call";
import {
  startVisionAgentLesson,
  stopVisionAgentLesson,
} from "@/lib/vision-agent-api";
import type {
  AudioLessonParticipantInfo,
  VisionAgentConnectionStatus,
} from "@/types/stream";

type UseVisionAgentSessionOptions = {
  context: AiLessonContext | null;
  callId: string | null;
  enabled: boolean;
  getClerkToken: () => Promise<string | null>;
  participants: AudioLessonParticipantInfo[];
};

type UseVisionAgentSessionResult = {
  status: VisionAgentConnectionStatus;
  statusMessage: string;
  error: string | null;
  startAgent: () => Promise<void>;
  stopAgent: () => Promise<void>;
};

function statusLabel(status: VisionAgentConnectionStatus): string {
  switch (status) {
    case "idle":
      return "AI teacher standby";
    case "connecting":
      return "AI teacher connecting…";
    case "connected":
      return "AI teacher connected";
    case "failed":
      return "AI teacher unavailable";
    default:
      return "";
  }
}

export function useVisionAgentSession({
  context,
  callId,
  enabled,
  getClerkToken,
  participants,
}: UseVisionAgentSessionOptions): UseVisionAgentSessionResult {
  const [status, setStatus] = useState<VisionAgentConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const sessionIdRef = useRef<string | null>(null);
  const startingRef = useRef(false);
  const stoppedRef = useRef(false);

  const agentJoined = participants.some(
    (participant) => participant.id === NEUROLINGO_AGENT_USER_ID,
  );

  const stopAgent = useCallback(async () => {
    const sessionId = sessionIdRef.current;
    const activeCallId = callId;

    stoppedRef.current = true;
    sessionIdRef.current = null;

    if (!sessionId || !activeCallId) {
      setStatus("idle");
      return;
    }

    try {
      await stopVisionAgentLesson(getClerkToken, {
        callId: activeCallId,
        callType: STREAM_AUDIO_CALL_TYPE,
        sessionId,
      });
    } catch (stopError) {
      console.error("Failed to stop vision agent session", stopError);
    } finally {
      setStatus("idle");
      setError(null);
    }
  }, [callId, getClerkToken]);

  const startAgent = useCallback(async () => {
    if (!context || !callId || startingRef.current) return;

    const previousSessionId = sessionIdRef.current;
    stoppedRef.current = false;
    sessionIdRef.current = null;
    startingRef.current = true;
    setStatus("connecting");
    setError(null);

    const { lesson } = context;

    try {
      if (previousSessionId && callId) {
        await stopVisionAgentLesson(getClerkToken, {
          callId,
          callType: STREAM_AUDIO_CALL_TYPE,
          sessionId: previousSessionId,
        });
      }
      const session = await startVisionAgentLesson(getClerkToken, {
        callId,
        callType: STREAM_AUDIO_CALL_TYPE,
      });

      sessionIdRef.current = session.session_id;

      posthog.capture("vision_agent_session_started", {
        lesson_id: lesson.id,
        language_id: lesson.languageId,
        call_id: callId,
        session_id: session.session_id,
      });
    } catch (startError) {
      const message =
        startError instanceof Error
          ? startError.message
          : "Could not connect the AI teacher.";
      setError(message);
      setStatus("failed");
      sessionIdRef.current = null;

      posthog.capture("vision_agent_session_error", {
        lesson_id: lesson.id,
        language_id: lesson.languageId,
        call_id: callId,
        message,
      });
    } finally {
      startingRef.current = false;
    }
  }, [callId, context, getClerkToken]);

  useEffect(() => {
    if (!enabled || !callId || !context || stoppedRef.current) return;
    if (status !== "idle" || sessionIdRef.current) return;
    void startAgent();
  }, [callId, context, enabled, startAgent, status]);

  useEffect(() => {
    if (status === "connecting" && agentJoined) {
      setStatus("connected");
      setError(null);
    }
  }, [agentJoined, status]);

  const stopAgentRef = useRef(stopAgent);
  stopAgentRef.current = stopAgent;

  useEffect(() => {
    return () => {
      void stopAgentRef.current();
    };
  }, []);

  return {
    status,
    statusMessage: error ?? statusLabel(status),
    error,
    startAgent,
    stopAgent,
  };
}
