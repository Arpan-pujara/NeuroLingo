import type { Language, LanguageId } from "@/types/learning";

export const languages: Language[] = [
  {
    id: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: `https://flagcdn.com/w320/es.png`,
    locale: "es-ES",
    shortDescription: "Learn everyday Spanish from greetings to simple conversations.",
    learnerCountLabel: "28.4M learners",
  },
  {
    id: "fr",
    name: "French",
    nativeName: "Français",
    flag: `https://flagcdn.com/w320/fr.png`,
    locale: "fr-FR",
    shortDescription: "Build confidence with French greetings and polite phrases.",
    learnerCountLabel: "19.4M learners",
  },
  {
    id: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: `https://flagcdn.com/w320/cn.png`,
    locale: "zh-CN",
    shortDescription: "Start with Mandarin tones, pinyin, and essential daily phrases.",
    learnerCountLabel: "12.1M learners",
  },
];

export function getLanguageById(id: LanguageId): Language | undefined {
  return languages.find((language) => language.id === id);
}
