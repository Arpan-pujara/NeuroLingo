import { CallingState, type Call } from "@stream-io/video-react-native-sdk";

/** Leave only when the local client is still in the call. */
export async function leaveCallIfJoined(call: Call | null | undefined): Promise<void> {
  if (!call) return;

  const state = call.state.callingState;
  if (state === CallingState.LEFT) return;

  try {
    await call.leave();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("already been left")) return;
    throw error;
  }
}
