import type { ImageSourcePropType } from "react-native";

import { getLessonsByUnit } from "@/data/lessons";
import { getUnitsByLanguage } from "@/data/units";
import {
  lessonCardImages,
  unitHeroImages,
  type LessonImageKey,
  type UnitHeroImageKey,
} from "@/constants/images";
import type {
  LanguageId,
  Lesson,
  LessonDisplayStatus,
  Unit,
} from "@/types/learning";

export type LessonCardModel = {
  lesson: Lesson;
  order: number;
  status: LessonDisplayStatus;
  imageUri: string | ImageSourcePropType;
};

export type LessonsScreenContext = {
  unit: Unit;
  lessons: LessonCardModel[];
  completedCount: number;
  headerTitle: string;
  headerSubtitle: string;
  heroImage: ImageSourcePropType;
};

function getCompletedForLanguage(
  languageId: LanguageId,
  completedLessonIds: string[],
): string[] {
  const prefix = `${languageId}-`;
  return completedLessonIds.filter((id) => id.startsWith(prefix));
}

function resolveActiveUnit(
  languageId: LanguageId,
  completedLessonIds: string[],
): Unit | undefined {
  const units = getUnitsByLanguage(languageId);
  const completed = getCompletedForLanguage(languageId, completedLessonIds);

  for (const unit of units) {
    const unitLessons = getLessonsByUnit(unit.id);
    const hasIncomplete = unitLessons.some(
      (lesson) => !completed.includes(lesson.id),
    );
    if (hasIncomplete) return unit;
  }

  return units[units.length - 1];
}

function resolveInProgressLessonId(
  unitLessons: Lesson[],
  completedLessonIds: string[],
): string | undefined {
  const next = unitLessons.find(
    (lesson) => !completedLessonIds.includes(lesson.id),
  );
  return next?.id ?? unitLessons[unitLessons.length - 1]?.id;
}

export function getLessonDisplayStatus(
  lessonId: string,
  inProgressLessonId: string | undefined,
  completedLessonIds: string[],
): LessonDisplayStatus {
  if (completedLessonIds.includes(lessonId)) return "completed";
  if (lessonId === inProgressLessonId) return "in_progress";
  return "not_started";
}

export function getLessonCardImageSource(
  cardImageKey?: string,
): string | ImageSourcePropType {
  const key = cardImageKey as LessonImageKey | undefined;
  if (key && key in lessonCardImages) {
    return lessonCardImages[key];
  }
  return lessonCardImages.greetings;
}

export function getUnitHeroImage(heroImageKey?: string): ImageSourcePropType {
  const key = (heroImageKey ?? "mascotWelcome") as UnitHeroImageKey;
  return unitHeroImages[key] ?? unitHeroImages.mascotWelcome;
}

export function getLessonsScreenContext(
  languageId: LanguageId,
  completedLessonIds: string[],
): LessonsScreenContext | null {
  const unit = resolveActiveUnit(languageId, completedLessonIds);
  if (!unit) return null;

  const unitLessons = getLessonsByUnit(unit.id);
  if (unitLessons.length === 0) return null;

  const inProgressLessonId = resolveInProgressLessonId(
    unitLessons,
    completedLessonIds,
  );
  const completedCount = unitLessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id),
  ).length;

  const inProgressLesson = unitLessons.find(
    (lesson) => lesson.id === inProgressLessonId,
  );

  const lessons: LessonCardModel[] = unitLessons.map((lesson) => ({
    lesson,
    order: lesson.order,
    status: getLessonDisplayStatus(
      lesson.id,
      inProgressLessonId,
      completedLessonIds,
    ),
    imageUri: getLessonCardImageSource(lesson.cardImageKey),
  }));

  return {
    unit,
    lessons,
    completedCount,
    headerTitle: inProgressLesson?.title ?? unit.title,
    headerSubtitle: `Unit ${unit.order} • ${completedCount} / ${unitLessons.length} lessons`,
    heroImage: getUnitHeroImage(unit.heroImageKey),
  };
}
