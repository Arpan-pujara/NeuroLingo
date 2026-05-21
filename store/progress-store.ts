import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createPersistStorage } from "@/lib/persist-storage";

const STORAGE_KEY = "neurolingo-progress";

export type PlanStepId = "lesson" | "ai-conversation" | "new-words";

type ProgressStoreState = {
  dailyXp: number;
  dailyGoalXp: number;
  streak: number;
  completedLessonIds: string[];
  completedPlanStepIds: PlanStepId[];
  hasHydrated: boolean;
  addDailyXp: (amount: number) => void;
  completeLesson: (lessonId: string) => void;
  completePlanStep: (stepId: PlanStepId) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useProgressStore = create<ProgressStoreState>()(
  persist(
    (set, get) => ({
      dailyXp: 15,
      dailyGoalXp: 20,
      streak: 12,
      completedLessonIds: [
        "es-lesson-1",
        "es-lesson-2",
        "es-u3-lesson-1",
        "es-u3-lesson-2",
      ],
      completedPlanStepIds: ["lesson"],
      hasHydrated: false,
      addDailyXp: (amount) =>
        set({ dailyXp: Math.min(get().dailyXp + amount, get().dailyGoalXp) }),
      completeLesson: (lessonId) =>
        set((state) => ({
          completedLessonIds: state.completedLessonIds.includes(lessonId)
            ? state.completedLessonIds
            : [...state.completedLessonIds, lessonId],
        })),
      completePlanStep: (stepId) =>
        set((state) => ({
          completedPlanStepIds: state.completedPlanStepIds.includes(stepId)
            ? state.completedPlanStepIds
            : [...state.completedPlanStepIds, stepId],
        })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => createPersistStorage()),
      partialize: (state) => ({
        dailyXp: state.dailyXp,
        dailyGoalXp: state.dailyGoalXp,
        streak: state.streak,
        completedLessonIds: state.completedLessonIds,
        completedPlanStepIds: state.completedPlanStepIds,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error("Failed to rehydrate progress store", error);
        }
        useProgressStore.setState({ hasHydrated: true });
      },
    },
  ),
);
