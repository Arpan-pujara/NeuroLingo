export type VisionAgentSessionResponse = {
  session_id: string;
  call_id: string;
  session_started_at?: string;
};

function visionAgentBaseUrl(): string {
  const explicit = process.env.VISION_AGENT_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const host = process.env.VISION_AGENT_HOST ?? "127.0.0.1";
  const port = process.env.VISION_AGENT_PORT ?? "8000";
  return `http://${host}:${port}`;
}

async function parseVisionAgentError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: string; error?: string };
    return body.detail ?? body.error ?? `Vision agent error (${response.status})`;
  } catch {
    return `Vision agent error (${response.status})`;
  }
}

export async function startVisionAgentSession(
  callId: string,
  callType: string,
): Promise<VisionAgentSessionResponse> {
  const response = await fetch(
    `${visionAgentBaseUrl()}/calls/${encodeURIComponent(callId)}/sessions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ call_type: callType }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseVisionAgentError(response));
  }

  return response.json() as Promise<VisionAgentSessionResponse>;
}

export async function stopVisionAgentSession(
  callId: string,
  sessionId: string,
): Promise<void> {
  const response = await fetch(
    `${visionAgentBaseUrl()}/calls/${encodeURIComponent(callId)}/sessions/${encodeURIComponent(sessionId)}`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 202) {
    throw new Error(await parseVisionAgentError(response));
  }
}
