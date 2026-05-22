import type { LessonCallCustomData } from "@/lib/lesson-call-custom";
import {
  buildLessonCallCid,
  buildLessonCallId,
  STREAM_AUDIO_CALL_TYPE,
} from "@/lib/stream-call";

export type StreamTokenResponse = {
  token: string;
  apiKey: string;
  userId: string;
};

export type StreamCallSessionResponse = {
  callId: string;
  callType: string;
  callCid: string;
};

type PrepareLessonCallInput = LessonCallCustomData & {
  userDisplayName?: string;
  userImageUrl?: string;
};

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export async function fetchStreamToken(
  getClerkToken: () => Promise<string | null>,
  profile?: { name?: string; imageUrl?: string },
): Promise<StreamTokenResponse> {
  const clerkToken = await getClerkToken();
  if (!clerkToken) {
    throw new Error("Sign in to start an audio lesson call.");
  }

  const response = await fetch("/api/stream/token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile ?? {}),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json() as Promise<StreamTokenResponse>;
}

export async function prepareLessonAudioCall(
  getClerkToken: () => Promise<string | null>,
  input: PrepareLessonCallInput,
): Promise<StreamCallSessionResponse> {
  const clerkToken = await getClerkToken();
  if (!clerkToken) {
    throw new Error("Sign in to join this audio lesson.");
  }

  const response = await fetch("/api/stream/call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clerkToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const data = (await response.json()) as StreamCallSessionResponse;
  return {
    callId: data.callId ?? buildLessonCallId(input.languageId, input.lessonId),
    callType: data.callType ?? STREAM_AUDIO_CALL_TYPE,
    callCid:
      data.callCid ?? buildLessonCallCid(input.languageId, input.lessonId),
  };
}
