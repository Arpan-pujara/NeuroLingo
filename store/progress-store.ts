import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
      completedLessonIds: ["es-lesson-1"],
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
      storage: createJSONStorage(() => AsyncStorage),
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
