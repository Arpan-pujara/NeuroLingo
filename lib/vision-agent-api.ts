import type { VisionAgentSessionResponse } from "@/lib/vision-agent-server";

export type { VisionAgentSessionResponse };

type StartAgentSessionInput = {
  callId: string;
  callType: string;
};

type StopAgentSessionInput = {
  callId: string;
  callType: string;
  sessionId: string;
};

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export async function startVisionAgentLesson(
  getClerkToken: () => Promise<string | null>,
  input: StartAgentSessionInput,
): Promise<VisionAgentSessionResponse> {
  const clerkToken = await getClerkToken();
  if (!clerkToken) {
    throw new Error("Sign in to start the AI teacher.");
  }

  const response = await fetch("/api/agent/start", {
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

  return response.json() as Promise<VisionAgentSessionResponse>;
}

export async function stopVisionAgentLesson(
  getClerkToken: () => Promise<string | null>,
  input: StopAgentSessionInput,
): Promise<void> {
  const clerkToken = await getClerkToken();
  if (!clerkToken) return;

  const response = await fetch("/api/agent/stop", {
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
}
