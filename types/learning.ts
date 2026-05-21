/**
 * Learning content types for hardcoded lesson data.
 * Extend LanguageId and add rows in data/ when adding new languages.
 */

/** Supported target language codes. Add new codes here when extending data/. */
export type LanguageId = "es" | "fr" | "zh";

export type ProficiencyLevel = "beginner" | "intermediate" | "advanced";

export type ActivityType =
  | "vocabulary_intro"
  | "listen_repeat"
  | "multiple_choice"
  | "phrase_practice"
  | "vision_agent_session";

export type Language = {
  id: LanguageId;
  /** Display name in English (e.g. "Spanish") */
  name: string;
  /** Name in the target language (e.g. "Español") */
  nativeName: string;
  /** Short emoji flag for UI */
  flag: string;
  /** BCP 47 locale tag */
  locale: string;
  shortDescription: string;
  /** Display label for popularity (e.g. "28.4M learners") */
  learnerCountLabel: string;
};

export type LessonDisplayStatus = "completed" | "in_progress" | "not_started";

export type Unit = {
  id: string;
  languageId: LanguageId;
  order: number;
  title: string;
  description: string;
  level: ProficiencyLevel;
  /** Ordered lesson ids in this unit */
  lessonIds: string[];
  /** Key into constants/images lessonHero map */
  heroImageKey?: string;
};

export type VocabularyItem = {
  id: string;
  /** Word or phrase in the target language */
  term: string;
  /** English gloss for learners */
  translation: string;
  /** Optional romanization or IPA-style hint */
  pronunciation?: string;
  /** Short usage example in the target language */
  example?: string;
};

export type Phrase = {
  id: string;
  text: string;
  translation: string;
  pronunciation?: string;
  /** When or how to use the phrase */
  context?: string;
};

export type LessonGoal = {
  id: string;
  description: string;
};

/**
 * Prompt bundle for future Stream Vision Agent / audio teacher sessions.
 * Server routes can pass systemPrompt; the agent speaks openingLine first.
 */
export type AITeacherPrompt = {
  systemPrompt: string;
  openingLine: string;
  /** Topics the AI teacher should emphasize during the session */
  focusAreas: string[];
};

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  instructions: string;
  /** Vocabulary ids from the parent lesson to use in this step */
  vocabularyIds?: string[];
  /** Phrase ids from the parent lesson to use in this step */
  phraseIds?: string[];
};

export type Lesson = {
  id: string;
  unitId: string;
  languageId: LanguageId;
  order: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  xpReward: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: Activity[];
  aiTeacher: AITeacherPrompt;
  /** Key into constants/images lessonCard map */
  cardImageKey?: string;
};
