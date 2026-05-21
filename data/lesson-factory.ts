import type { Activity, AITeacherPrompt, LanguageId, Lesson } from "@/types/learning";

type StubLessonInput = {
  id: string;
  unitId: string;
  languageId: LanguageId;
  order: number;
  title: string;
  description: string;
  cardImageKey?: string;
};

function defaultAiTeacher(title: string, languageId: LanguageId): AITeacherPrompt {
  const languageLabel =
    languageId === "es" ? "Spanish" : languageId === "fr" ? "French" : "Mandarin";

  return {
    systemPrompt:
      `You are a warm ${languageLabel} tutor for beginners. ` +
      `Teach "${title}" with simple examples and encourage repetition.`,
    openingLine: `Let's learn "${title}" together. Repeat after me.`,
    focusAreas: [title, "pronunciation", "short practice phrases"],
  };
}

function defaultActivities(lessonId: string): Activity[] {
  return [
    {
      id: `${lessonId}-intro`,
      type: "vocabulary_intro",
      title: "Meet the words",
      instructions: "Learn the key words for this lesson.",
    },
    {
      id: `${lessonId}-listen`,
      type: "listen_repeat",
      title: "Listen & repeat",
      instructions: "Listen and repeat each phrase out loud.",
    },
  ];
}

/** Minimal lesson row for extending units without duplicating full content blocks. */
export function createStubLesson(input: StubLessonInput): Lesson {
  return {
    id: input.id,
    unitId: input.unitId,
    languageId: input.languageId,
    order: input.order,
    title: input.title,
    description: input.description,
    estimatedMinutes: 5,
    xpReward: 10,
    cardImageKey: input.cardImageKey,
    goals: [
      {
        id: `${input.id}-goal-1`,
        description: `Understand core phrases for ${input.title}`,
      },
    ],
    vocabulary: [],
    phrases: [],
    activities: defaultActivities(input.id),
    aiTeacher: defaultAiTeacher(input.title, input.languageId),
  };
}
