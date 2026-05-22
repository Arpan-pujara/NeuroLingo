import { requireClerkUserId } from "@/lib/clerk-api-auth";
import { stopVisionAgentSession } from "@/lib/vision-agent-server";

type StopAgentRequestBody = {
  callId?: string;
  sessionId?: string;
};

export async function POST(request: Request) {
  try {
    await requireClerkUserId(request);
    const body = (await request.json()) as StopAgentRequestBody;

    const callId = body.callId?.trim();
    const sessionId = body.sessionId?.trim();

    if (!callId || !sessionId) {
      return Response.json(
        { error: "callId and sessionId are required." },
        { status: 400 },
      );
    }

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
