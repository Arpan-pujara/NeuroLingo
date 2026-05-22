import { parseJsonBody } from "@/lib/api-request";
import { requireClerkUserId } from "@/lib/clerk-api-auth";
import { requireUserOwnsCall } from "@/lib/stream-call-auth";
import { stopVisionAgentSession } from "@/lib/vision-agent-server";

type StopAgentRequestBody = {
  callId?: string;
  callType?: string;
  sessionId?: string;
};

export async function POST(request: Request) {
  try {
    const userId = await requireClerkUserId(request);
    const body = await parseJsonBody<StopAgentRequestBody>(request);

    const callId = body.callId?.trim();
    const callType = body.callType?.trim();
    const sessionId = body.sessionId?.trim();

    if (!callId || !callType || !sessionId) {
      return Response.json(
        { error: "callId, callType, and sessionId are required." },
        { status: 400 },
      );
    }

    await requireUserOwnsCall(callType, callId, userId);
    await stopVisionAgentSession(callId, sessionId);

    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("[api/agent/stop]", error);
    const message =
      error instanceof Error ? error.message : "Failed to stop the AI teacher.";
    return Response.json({ error: message }, { status: 500 });
  }
}
