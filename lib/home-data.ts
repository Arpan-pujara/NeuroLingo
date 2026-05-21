import { getLanguageById } from "@/data/languages";
import { getLessonsByLanguage } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import type { PlanStepId } from "@/store/progress-store";
import type { Language, LanguageId, Lesson, ProficiencyLevel, Unit } from "@/types/learning";

export type TodaysPlanItem = {
  id: PlanStepId;
  title: string;
  subtitle: string;
  iconName: "book" | "headset" | "flash";
  iconBackgroundClass: string;
  completed: boolean;
};

export type HomeLearningContext = {
  language: Language;
  currentUnit: Unit;
  currentLesson: Lesson;
  proficiencyLabel: string;
  continueSubtitle: string;
  todaysPlan: TodaysPlanItem[];
  vocabularyWordCount: number;
};

const LESSON_PLAN_SUBTITLES: Partial<Record<string, string>> = {
  "es-lesson-1": "Hello & Goodbye",
  "es-lesson-2": "Please & Thank You",
  "fr-lesson-1": "Bonjour Basics",
  "zh-lesson-1": "你好 & Essentials",
};

const AI_CONVERSATION_SUBTITLES: Partial<Record<string, string>> = {
  "es-lesson-1": "Talk about your day",
  "es-lesson-2": "Polite expressions & short dialogues",
  "fr-lesson-1": "Introduce yourself",
  "zh-lesson-1": "Say hello in Mandarin",
};

function getProficiencyLabel(level: ProficiencyLevel): string {
  if (level === "beginner") return "A1";
  if (level === "intermediate") return "B1";
  return "C1";
}

function getLessonPlanSubtitle(lesson: Lesson): string {
  return LESSON_PLAN_SUBTITLES[lesson.id] ?? lesson.title;
}

function getAiConversationSubtitle(lesson: Lesson): string {
  return (
    AI_CONVERSATION_SUBTITLES[lesson.id] ??
    lesson.aiTeacher.focusAreas[0] ??
    "Practice with your AI tutor"
  );
}

function getCompletedLessonsForLanguage(
  languageId: LanguageId,
  completedLessonIds: string[],
): string[] {
  const prefix = `${languageId}-`;
  return completedLessonIds.filter((lessonId) => lessonId.startsWith(prefix));
}

function resolveCurrentLesson(
  languageId: LanguageId,
  completedLessonIds: string[],
): Lesson | undefined {
  const lessons = getLessonsByLanguage(languageId);
  if (lessons.length === 0) return undefined;

  const completedForLanguage = getCompletedLessonsForLanguage(
    languageId,
    completedLessonIds,
  );
  const nextLesson = lessons.find(
    (lesson) => !completedForLanguage.includes(lesson.id),
  );
  return nextLesson ?? lessons[lessons.length - 1];
}

const GREETING_BY_LANGUAGE: Record<LanguageId, string> = {
  es: "Hola",
  fr: "Bonjour",
  zh: "你好",
};

export function getHomeGreeting(languageId: LanguageId, firstName: string): string {
  const greeting = GREETING_BY_LANGUAGE[languageId] ?? "Hello";
  return `${greeting}, ${firstName}! 👋`;
}

export function getHomeLearningContext(
  languageId: LanguageId,
  completedLessonIds: string[],
  completedPlanStepIds: PlanStepId[],
): HomeLearningContext | null {
  const language = getLanguageById(languageId);
  if (!language) return null;

  const units = getUnitsByLanguage(languageId);
  const currentLesson = resolveCurrentLesson(languageId, completedLessonIds);
  if (!currentLesson) return null;

  const currentUnit =
    units.find((unit) => unit.lessonIds.includes(currentLesson.id)) ?? units[0];

  if (!currentUnit) return null;

  const vocabularyWordCount = currentLesson.vocabulary.length;

  const todaysPlan: TodaysPlanItem[] = [
    {
      id: "lesson",
      title: "Lesson",
      subtitle: getLessonPlanSubtitle(currentLesson),
      iconName: "book",
      iconBackgroundClass: "bg-lingua-purple",
      completed: completedPlanStepIds.includes("lesson"),
    },
    {
      id: "ai-conversation",
      title: "AI Conversation",
      subtitle: getAiConversationSubtitle(currentLesson),
      iconName: "headset",
      iconBackgroundClass: "bg-lingua-purple",
      completed: completedPlanStepIds.includes("ai-conversation"),
    },
    {
      id: "new-words",
      title: "New words",
      subtitle: `${vocabularyWordCount} words`,
      iconName: "flash",
      iconBackgroundClass: "bg-[#FF6B6B]",
      completed: completedPlanStepIds.includes("new-words"),
    },
  ];

  return {
    language,
    currentUnit,
    currentLesson,
    proficiencyLabel: getProficiencyLabel(currentUnit.level),
    continueSubtitle: `${getProficiencyLabel(currentUnit.level)} • Unit ${currentUnit.order}`,
    todaysPlan,
    vocabularyWordCount,
  };
}
