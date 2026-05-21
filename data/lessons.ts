import type { LanguageId, Lesson } from "@/types/learning";

export const lessons: Lesson[] = [
  {
    id: "es-lesson-1",
    unitId: "es-unit-1",
    languageId: "es",
    order: 1,
    title: "Hello & Goodbye",
    description: "Practice hola, adiós, and common greeting phrases.",
    estimatedMinutes: 5,
    xpReward: 10,
    goals: [
      { id: "es-g1", description: "Recognize hola and adiós" },
      { id: "es-g2", description: "Greet someone in the morning or afternoon" },
    ],
    vocabulary: [
      {
        id: "es-v-hola",
        term: "hola",
        translation: "hello",
        pronunciation: "OH-lah",
        example: "¡Hola! ¿Cómo estás?",
      },
      {
        id: "es-v-adios",
        term: "adiós",
        translation: "goodbye",
        pronunciation: "ah-DYOHS",
      },
      {
        id: "es-v-buenos-dias",
        term: "buenos días",
        translation: "good morning",
        pronunciation: "BWEH-nohs DEE-ahs",
        example: "Buenos días, señora.",
      },
    ],
    phrases: [
      {
        id: "es-p-hola-como",
        text: "Hola, ¿cómo estás?",
        translation: "Hello, how are you?",
        pronunciation: "OH-lah, KOH-moh ehs-TAHS",
        context: "Informal greeting with friends.",
      },
    ],
    activities: [
      {
        id: "es-a1-intro",
        type: "vocabulary_intro",
        title: "Meet the words",
        instructions: "Tap each card to hear and learn hola, adiós, and buenos días.",
        vocabularyIds: ["es-v-hola", "es-v-adios", "es-v-buenos-dias"],
      },
      {
        id: "es-a1-listen",
        type: "listen_repeat",
        title: "Listen & repeat",
        instructions: "Listen to each word, then repeat out loud.",
        vocabularyIds: ["es-v-hola", "es-v-adios"],
      },
      {
        id: "es-a1-vision",
        type: "vision_agent_session",
        title: "Practice with your AI teacher",
        instructions: "Join a short audio lesson with your AI tutor.",
        vocabularyIds: ["es-v-hola", "es-v-buenos-dias"],
        phraseIds: ["es-p-hola-como"],
      },
    ],
    aiTeacher: {
      systemPrompt:
        "You are a warm, patient Spanish tutor for absolute beginners. " +
        "Speak slowly, use simple Spanish, and briefly explain in English when needed. " +
        "Focus on greetings: hola, adiós, buenos días. Encourage the learner to repeat aloud. " +
        "Keep responses under 3 sentences unless practicing a dialogue.",
      openingLine:
        "¡Hola! I'm your Spanish teacher. Today we'll practice simple greetings. Repeat after me: hola.",
      focusAreas: [
        "pronunciation of hola and adiós",
        "when to use buenos días",
        "informal greeting: ¿Cómo estás?",
      ],
    },
  },
  {
    id: "es-lesson-2",
    unitId: "es-unit-1",
    languageId: "es",
    order: 2,
    title: "Please & Thank You",
    description: "Learn por favor, gracias, and polite responses.",
    estimatedMinutes: 5,
    xpReward: 10,
    goals: [
      { id: "es-g3", description: "Say please and thank you in Spanish" },
      { id: "es-g4", description: "Respond to gracias with de nada" },
    ],
    vocabulary: [
      {
        id: "es-v-por-favor",
        term: "por favor",
        translation: "please",
        pronunciation: "por fah-VOR",
      },
      {
        id: "es-v-gracias",
        term: "gracias",
        translation: "thank you",
        pronunciation: "GRAH-syahs",
      },
      {
        id: "es-v-de-nada",
        term: "de nada",
        translation: "you're welcome",
        pronunciation: "deh NAH-dah",
      },
    ],
    phrases: [
      {
        id: "es-p-gracias-por-favor",
        text: "Un café, por favor.",
        translation: "A coffee, please.",
        pronunciation: "oon kah-FEH, por fah-VOR",
        context:
          "Use por favor at the end of a request to sound polite, especially when ordering at a café.",
      },
    ],
    activities: [
      {
        id: "es-a2-intro",
        type: "vocabulary_intro",
        title: "Polite words",
        instructions: "Learn por favor, gracias, and de nada.",
        vocabularyIds: ["es-v-por-favor", "es-v-gracias", "es-v-de-nada"],
      },
      {
        id: "es-a2-choice",
        type: "multiple_choice",
        title: "Pick the meaning",
        instructions: "Choose the correct English translation.",
        vocabularyIds: ["es-v-gracias", "es-v-de-nada"],
      },
      {
        id: "es-a2-phrase",
        type: "phrase_practice",
        title: "Say it naturally",
        instructions: "Practice a short polite request with por favor.",
        phraseIds: ["es-p-gracias-por-favor"],
      },
    ],
    aiTeacher: {
      systemPrompt:
        "You are a friendly Spanish tutor teaching polite expressions. " +
        "Drill por favor, gracias, and de nada. Role-play a café order or thank-you exchange. " +
        "Praise effort and correct pronunciation gently.",
      openingLine:
        "¡Muy bien! Let's learn polite Spanish. First word: por favor. Can you say it with me?",
      focusAreas: [
        "por favor in requests",
        "gracias and common replies",
        "short polite dialogues",
      ],
    },
  },
  {
    id: "fr-lesson-1",
    unitId: "fr-unit-1",
    languageId: "fr",
    order: 1,
    title: "Bonjour Basics",
    description: "Start with bonjour, au revoir, and merci.",
    estimatedMinutes: 5,
    xpReward: 10,
    goals: [
      { id: "fr-g1", description: "Say bonjour and au revoir" },
      { id: "fr-g2", description: "Thank someone with merci" },
    ],
    vocabulary: [
      {
        id: "fr-v-bonjour",
        term: "bonjour",
        translation: "hello / good day",
        pronunciation: "bon-ZHOOR",
        example: "Bonjour, madame.",
      },
      {
        id: "fr-v-au-revoir",
        term: "au revoir",
        translation: "goodbye",
        pronunciation: "oh ruh-VWAHR",
      },
      {
        id: "fr-v-merci",
        term: "merci",
        translation: "thank you",
        pronunciation: "mehr-SEE",
      },
    ],
    phrases: [
      {
        id: "fr-p-bonjour-comment",
        text: "Bonjour, comment allez-vous ?",
        translation: "Hello, how are you? (formal)",
        pronunciation: "bon-ZHOOR, koh-mahn tah-lay-VOO",
        context: "Polite form with strangers or elders.",
      },
    ],
    activities: [
      {
        id: "fr-a1-intro",
        type: "vocabulary_intro",
        title: "First French words",
        instructions: "Learn bonjour, au revoir, and merci.",
        vocabularyIds: ["fr-v-bonjour", "fr-v-au-revoir", "fr-v-merci"],
      },
      {
        id: "fr-a1-listen",
        type: "listen_repeat",
        title: "French sounds",
        instructions: "Repeat each word and notice the French R sound.",
        vocabularyIds: ["fr-v-bonjour", "fr-v-au-revoir"],
      },
      {
        id: "fr-a1-vision",
        type: "vision_agent_session",
        title: "AI teacher session",
        instructions: "Practice greetings live with your AI tutor.",
        vocabularyIds: ["fr-v-bonjour", "fr-v-merci"],
        phraseIds: ["fr-p-bonjour-comment"],
      },
    ],
    aiTeacher: {
      systemPrompt:
        "You are an encouraging French tutor for beginners. " +
        "Teach bonjour, au revoir, and merci with clear pronunciation tips. " +
        "Mention when to use formal comment allez-vous. Mix brief English explanations.",
      openingLine:
        "Bonjour ! Je suis votre professeur de français. Répétez avec moi : bonjour.",
      focusAreas: [
        "bonjour vs bonsoir (mention briefly)",
        "au revoir pronunciation",
        "merci in daily exchanges",
      ],
    },
  },
  {
    id: "zh-lesson-1",
    unitId: "zh-unit-1",
    languageId: "zh",
    order: 1,
    title: "你好 & Essentials",
    description: "Learn 你好, 谢谢, and tone-friendly greetings.",
    estimatedMinutes: 6,
    xpReward: 10,
    goals: [
      { id: "zh-g1", description: "Say 你好 and 再见" },
      { id: "zh-g2", description: "Use 谢谢 and 不客气 politely" },
    ],
    vocabulary: [
      {
        id: "zh-v-nihao",
        term: "你好",
        translation: "hello",
        pronunciation: "nǐ hǎo",
        example: "你好！很高兴认识你。",
      },
      {
        id: "zh-v-zaijian",
        term: "再见",
        translation: "goodbye",
        pronunciation: "zài jiàn",
      },
      {
        id: "zh-v-xiexie",
        term: "谢谢",
        translation: "thank you",
        pronunciation: "xiè xie",
      },
      {
        id: "zh-v-bukeqi",
        term: "不客气",
        translation: "you're welcome",
        pronunciation: "bù kè qi",
      },
    ],
    phrases: [
      {
        id: "zh-p-nihao-ma",
        text: "你好吗？",
        translation: "How are you?",
        pronunciation: "nǐ hǎo ma",
        context: "Common follow-up after 你好.",
      },
    ],
    activities: [
      {
        id: "zh-a1-intro",
        type: "vocabulary_intro",
        title: "Characters & pinyin",
        instructions: "Learn each word with pinyin and meaning.",
        vocabularyIds: ["zh-v-nihao", "zh-v-zaijian", "zh-v-xiexie", "zh-v-bukeqi"],
      },
      {
        id: "zh-a1-listen",
        type: "listen_repeat",
        title: "Tone practice",
        instructions: "Listen and repeat, paying attention to the 3rd tone in 你好.",
        vocabularyIds: ["zh-v-nihao", "zh-v-xiexie"],
      },
      {
        id: "zh-a1-vision",
        type: "vision_agent_session",
        title: "Practice with AI teacher",
        instructions: "Practice tones and greetings with your AI tutor.",
        vocabularyIds: ["zh-v-nihao", "zh-v-xiexie"],
        phraseIds: ["zh-p-nihao-ma"],
      },
    ],
    aiTeacher: {
      systemPrompt:
        "You are a patient Mandarin tutor for English speakers. " +
        "Always give pinyin for new words. Emphasize tones for 你好 (nǐ hǎo) and 谢谢 (xiè xie). " +
        "Speak slowly, ask the learner to repeat, and use simple Chinese with English hints.",
      openingLine:
        "你好！我是你的中文老师。今天我们学习问候语。请跟我读：你好。",
      focusAreas: [
        "tone practice for 你好",
        "谢谢 and 不客气 exchange",
        "你好吗？ as a follow-up question",
      ],
    },
  },
];

export function getLessonsByUnit(unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonsByLanguage(languageId: LanguageId): Lesson[] {
  return lessons
    .filter((lesson) => lesson.languageId === languageId)
    .sort((a, b) => a.order - b.order);
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}
