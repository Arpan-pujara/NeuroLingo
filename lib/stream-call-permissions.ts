import { NEUROLINGO_AGENT_USER_ID } from "@/lib/stream-agent";
import { getStreamServerClient } from "@/lib/stream-server";

/** audio_room speakers publish audio as host (not listener). */
export const LESSON_SPEAKER_ROLE = "host";

const SEND_AUDIO = "send-audio";

/**
 * Grant the AI teacher permission to publish audio in an audio_room call.
 * Call once before starting the vision agent session.
 */
export async function grantAgentAudioPublishAccess(
  callType: string,
  callId: string,
): Promise<void> {
  const call = getStreamServerClient().video.call(callType, callId);

  await call.updateCallMembers({
    update_members: [
      { user_id: NEUROLINGO_AGENT_USER_ID, role: LESSON_SPEAKER_ROLE },
    ],
  });

  await call.updateUserPermissions({
    user_id: NEUROLINGO_AGENT_USER_ID,
    grant_permissions: [SEND_AUDIO],
  });
}

/** Grant the learner send-audio (host role is set at call creation). */
export async function grantLearnerAudioPublishAccess(
  callType: string,
  callId: string,
  learnerUserId: string,
): Promise<void> {
  const call = getStreamServerClient().video.call(callType, callId);

  await call.updateUserPermissions({
    user_id: learnerUserId,
    grant_permissions: [SEND_AUDIO],
  });
}
