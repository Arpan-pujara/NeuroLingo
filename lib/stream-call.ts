import { isLanguageId } from "@/lib/learning-validation";
import type { LanguageId } from "@/types/learning";

/** Stream call type optimized for audio-only lesson rooms. */
export const STREAM_AUDIO_CALL_TYPE = "audio_room";

export function buildLessonCallId(languageId: LanguageId, lessonId: string): string {
  const safeLesson = lessonId.replace(/[^a-zA-Z0-9_-]/g, "-");
  return `nl-${languageId}-${safeLesson}`;
}

export function buildLessonCallCid(languageId: LanguageId, lessonId: string): string {
  return `${STREAM_AUDIO_CALL_TYPE}:${buildLessonCallId(languageId, lessonId)}`;
}

/** Parse `nl-{languageId}-{lessonId}` and validate the language segment. */
export function parseLessonCallId(callId: string): { languageId: LanguageId; lessonId: string } | null {
  const match = /^nl-([a-z]+)-(.+)$/.exec(callId);
  if (!match) return null;
  const languageId = match[1];
  if (!isLanguageId(languageId)) return null;
  return { languageId, lessonId: match[2] };
}
