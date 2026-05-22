import type { AiLessonContext } from "@/lib/ai-lesson";
import type { LanguageId, LessonGoal, Phrase, VocabularyItem } from "@/types/learning";

/** Serializable lesson payload stored on Stream call `custom` for the vision agent. */
export type LessonCallCustomData = {
  lessonId: string;
  languageId: LanguageId;
  lessonTitle: string;
  languageName: string;
  systemPrompt: string;
  openingLine: string;
  focusAreas: string[];
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
};

export function buildLessonCallCustom(context: AiLessonContext): LessonCallCustomData {
  const { lesson, language } = context;

  return {
    lessonId: lesson.id,
    languageId: lesson.languageId,
    lessonTitle: lesson.title,
    languageName: language.name,
    systemPrompt: lesson.aiTeacher.systemPrompt,
    openingLine: lesson.aiTeacher.openingLine,
    focusAreas: lesson.aiTeacher.focusAreas,
    goals: context.goals,
    vocabulary: lesson.vocabulary,
    phrases: context.phrases,
  };
}
