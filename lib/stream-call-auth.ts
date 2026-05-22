import { getStreamServerClient } from "@/lib/stream-server";

function forbidden(message = "You do not have access to this call.") {
  return Response.json({ error: message }, { status: 403 });
}

/** Ensure the authenticated user is allowed to control this lesson call. */
export async function requireUserOwnsCall(
  callType: string,
  callId: string,
  userId: string,
): Promise<void> {
  const call = getStreamServerClient().video.call(callType, callId);
  const response = await call.get();
  const callData = response.call;

  if (!callData) {
    throw forbidden("Call not found.");
  }

  const createdById = callData.created_by?.id;
  if (createdById === userId) {
    return;
  }

  const members = callData.members ?? [];
  const isMember = members.some((member) => member.user_id === userId);
  if (!isMember) {
    throw forbidden();
  }
}
