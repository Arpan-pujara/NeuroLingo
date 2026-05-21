import { getLanguageById } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import type { Language, Lesson, LessonGoal, Phrase } from "@/types/learning";

export type LessonFeedbackScore = {
  label: string;
  value: string;
  colorClass: string;
};

export type AiLessonContext = {
  lesson: Lesson;
  language: Language;
  bubblePrimary: string;
  bubbleSecondary: string;
  goals: LessonGoal[];
  phrases: Phrase[];
  focusAreas: string[];
  feedbackScores: LessonFeedbackScore[];
};

const DEFAULT_FEEDBACK: LessonFeedbackScore[] = [
  { label: "Speaking", value: "Excellent", colorClass: "text-lingua-green" },
  { label: "Pronunciation", value: "Great", colorClass: "text-lingua-blue" },
  { label: "Grammar", value: "Good", colorClass: "text-lingua-purple" },
];

function buildTeacherBubble(lesson: Lesson): {
  bubblePrimary: string;
  bubbleSecondary: string;
} {
  const firstPhrase = lesson.phrases[0];
  if (firstPhrase) {
    const primary =
      lesson.languageId === "es"
        ? "¡Muy bien!"
        : lesson.languageId === "fr"
          ? "Très bien !"
          : "很好！";

    return {
      bubblePrimary: primary,
      bubbleSecondary: `That was great! ${firstPhrase.translation} 👏`,
    };
  }

  const opening = lesson.aiTeacher.openingLine;
  const sentenceEnd = opening.indexOf(".");
  const bubblePrimary =
    sentenceEnd > 0 ? opening.slice(0, sentenceEnd + 1) : opening;
  const bubbleSecondary = lesson.goals[0]?.description ?? lesson.description;

  return { bubblePrimary, bubbleSecondary };
}

export function getAiLessonContext(lessonId: string): AiLessonContext | null {
  const lesson = getLessonById(lessonId);
  if (!lesson) return null;

  const language = getLanguageById(lesson.languageId);
  if (!language) return null;

  const { bubblePrimary, bubbleSecondary } = buildTeacherBubble(lesson);

  return {
    lesson,
    language,
    bubblePrimary,
    bubbleSecondary,
    goals: lesson.goals,
    phrases: lesson.phrases,
    focusAreas: lesson.aiTeacher.focusAreas,
    feedbackScores: DEFAULT_FEEDBACK,
  };
}
