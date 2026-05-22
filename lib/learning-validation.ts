import type { LanguageId } from "@/types/learning";

const LANGUAGE_IDS: readonly LanguageId[] = ["es", "fr", "zh"];

export function isLanguageId(value: unknown): value is LanguageId {
  return typeof value === "string" && (LANGUAGE_IDS as readonly string[]).includes(value);
}
