import type { LanguageId, Unit } from "@/types/learning";

export const units: Unit[] = [
  {
    id: "es-unit-1",
    languageId: "es",
    order: 1,
    title: "Greetings",
    description: "Say hello, goodbye, and polite phrases in Spanish.",
    level: "beginner",
    lessonIds: ["es-lesson-1", "es-lesson-2"],
  },
  {
    id: "fr-unit-1",
    languageId: "fr",
    order: 1,
    title: "Greetings",
    description: "Master bonjour, merci, and other French essentials.",
    level: "beginner",
    lessonIds: ["fr-lesson-1"],
  },
  {
    id: "zh-unit-1",
    languageId: "zh",
    order: 1,
    title: "Greetings",
    description: "Learn 你好, 谢谢, and tone-friendly introductions.",
    level: "beginner",
    lessonIds: ["zh-lesson-1"],
  },
];

export function getUnitsByLanguage(languageId: LanguageId): Unit[] {
  return units
    .filter((unit) => unit.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}

export function getUnitById(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}
