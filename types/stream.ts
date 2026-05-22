/** App-level audio lesson call status shown in the lesson UI. */
export type AudioLessonCallStatus =
  | "idle"
  | "loading"
  | "connecting"
  | "joined"
  | "muted"
  | "error"
  | "ended";

export type AudioLessonParticipantInfo = {
  id: string;
  name: string;
  imageUrl?: string;
  isLocal?: boolean;
};

/** Vision Agent connection state shown alongside the Stream audio call. */
export type VisionAgentConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "failed";
