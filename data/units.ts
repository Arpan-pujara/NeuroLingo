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
    heroImageKey: "mascotWelcome",
  },
  {
    id: "es-unit-3",
    languageId: "es",
    order: 3,
    title: "At the Café",
    description: "Order drinks, ask for the check, and chat at a café.",
    level: "beginner",
    lessonIds: [
      "es-u3-lesson-1",
      "es-u3-lesson-2",
      "es-u3-lesson-3",
      "es-u3-lesson-4",
      "es-u3-lesson-5",
      "es-u3-lesson-6",
    ],
    heroImageKey: "mascotHeroCafe",
  },
  {
    id: "fr-unit-1",
    languageId: "fr",
    order: 1,
    title: "Greetings",
    description: "Master bonjour, merci, and other French essentials.",
    level: "beginner",
    lessonIds: [
      "fr-lesson-1",
      "fr-lesson-2",
      "fr-lesson-3",
      "fr-lesson-4",
      "fr-lesson-5",
      "fr-lesson-6",
    ],
    heroImageKey: "palace",
  },
  {
    id: "zh-unit-1",
    languageId: "zh",
    order: 1,
    title: "Greetings",
    description: "Learn 你好, 谢谢, and tone-friendly introductions.",
    level: "beginner",
    lessonIds: [
      "zh-lesson-1",
      "zh-lesson-2",
      "zh-lesson-3",
      "zh-lesson-4",
      "zh-lesson-5",
      "zh-lesson-6",
    ],
    heroImageKey: "earth",
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
