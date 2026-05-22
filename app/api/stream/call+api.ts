import { requireClerkUserId } from "@/lib/clerk-api-auth";
import type { LessonCallCustomData } from "@/lib/lesson-call-custom";
import {
  buildLessonCallCid,
  buildLessonCallId,
  STREAM_AUDIO_CALL_TYPE,
} from "@/lib/stream-call";
import { NEUROLINGO_AGENT_USER_ID, NEUROLINGO_AGENT_USER_NAME } from "@/lib/stream-agent";
import {
  grantAgentAudioPublishAccess,
  grantLearnerAudioPublishAccess,
  LESSON_SPEAKER_ROLE,
} from "@/lib/stream-call-permissions";
import { getStreamServerClient } from "@/lib/stream-server";
import type { LanguageId } from "@/types/learning";

type CallRequestBody = LessonCallCustomData & {
  userDisplayName?: string;
  userImageUrl?: string;
};

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = (await request.json()) as CallRequestBody;

    const lessonId = body.lessonId?.trim();
    const languageId = body.languageId as LanguageId | undefined;

    if (!lessonId || !languageId) {
      return Response.json(
        { error: "lessonId and languageId are required." },
        { status: 400 },
      );
    }

    const client = getStreamServerClient();
    const displayName = body.userDisplayName?.trim() || "Learner";

    await client.upsertUsers([
      {
        id: userId,
        role: "user",
        name: displayName,
        image: body.userImageUrl,
      },
      {
        id: NEUROLINGO_AGENT_USER_ID,
        role: "user",
        name: NEUROLINGO_AGENT_USER_NAME,
      },
    ]);

    const callId = buildLessonCallId(languageId, lessonId);
    const callCid = buildLessonCallCid(languageId, lessonId);
    const call = client.video.call(STREAM_AUDIO_CALL_TYPE, callId);

    const custom: LessonCallCustomData = {
      lessonId,
      languageId,
      lessonTitle: body.lessonTitle ?? "",
      languageName: body.languageName ?? "",
      systemPrompt: body.systemPrompt ?? "",
      openingLine: body.openingLine ?? "",
      focusAreas: body.focusAreas ?? [],
      goals: body.goals ?? [],
      vocabulary: body.vocabulary ?? [],
      phrases: body.phrases ?? [],
    };

    await call.getOrCreate({
      data: {
        created_by_id: userId,
        members: [
          { user_id: userId, role: LESSON_SPEAKER_ROLE },
          { user_id: NEUROLINGO_AGENT_USER_ID, role: LESSON_SPEAKER_ROLE },
        ],
        custom,
        settings_override: {
          audio: {
            mic_default_on: true,
            default_device: "speaker",
          },
          backstage: {
            enabled: false,
          },
        },
      },
    });

    await grantLearnerAudioPublishAccess(STREAM_AUDIO_CALL_TYPE, callId, userId);
    await grantAgentAudioPublishAccess(STREAM_AUDIO_CALL_TYPE, callId);

    return Response.json({
      callId,
      callType: STREAM_AUDIO_CALL_TYPE,
      callCid,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("[api/stream/call]", error);
    return Response.json({ error: "Failed to prepare audio lesson call." }, { status: 500 });
  }
}
