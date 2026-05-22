import { CallingState, type Call } from "@stream-io/video-react-native-sdk";

const LEAVEABLE_STATES = new Set<CallingState>([
  CallingState.JOINED,
  CallingState.JOINING,
  CallingState.RECONNECTING,
  CallingState.MIGRATING,
  CallingState.RINGING,
]);

/** Leave only when the local client is in an active join/leave lifecycle. */
export async function leaveCallIfJoined(call: Call | null | undefined): Promise<void> {
  if (!call) return;

  const state = call.state.callingState;
  if (state === CallingState.LEFT || !LEAVEABLE_STATES.has(state)) {
    return;
  }

  try {
    await call.leave();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("already been left")) return;
    throw error;
  }
}
