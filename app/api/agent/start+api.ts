import { parseJsonBody } from "@/lib/api-request";
import { requireClerkUserId } from "@/lib/clerk-api-auth";
import { requireUserOwnsCall } from "@/lib/stream-call-auth";
import { grantAgentAudioPublishAccess } from "@/lib/stream-call-permissions";
import { startVisionAgentSession } from "@/lib/vision-agent-server";

type StartAgentRequestBody = {
  callId?: string;
  callType?: string;
};

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = await parseJsonBody<StartAgentRequestBody>(request);

    const callId = body.callId?.trim();
    const callType = body.callType?.trim();

    if (!callId || !callType) {
      return Response.json(
        { error: "callId and callType are required." },
        { status: 400 },
      );
    }

    await requireUserOwnsCall(callType, callId, userId);
    await grantAgentAudioPublishAccess(callType, callId);

    const session = await startVisionAgentSession(callId, callType);

    return Response.json(session);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("[api/agent/start]", error);
    const message =
      error instanceof Error ? error.message : "Failed to start the AI teacher.";
    return Response.json({ error: message }, { status: 500 });
  }
}
