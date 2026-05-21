import earth from "@/assets/images/earth.png";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotHeroCafe from "@/assets/images/mascot-hero-cafe.jpg";
import mascotSweater from "@/assets/images/mascot-sweater.png";
import mascotLogo from "@/assets/images/mascot-logo.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import palace from "@/assets/images/palace.png";
import streakFire from "@/assets/images/streak-fire.png";
import treasure from "@/assets/images/treasure.png";

/** Remote placeholder when a portrait asset is not bundled locally. */
export const AI_TEACHER_AVATAR_URI =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop";

/** Blurred wall / shelves backdrop (no furniture) for the AI Teacher stage. */
export const AI_LESSON_ROOM_URI =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&h=1200&fit=crop";

export type LessonImageKey =
  | "greetings"
  | "dailyLife"
  | "cafe"
  | "travel"
  | "shopping"
  | "family";

export type UnitHeroImageKey = "mascotHeroCafe" | "mascotWelcome" | "palace" | "earth";

/** Picsum placeholders keyed by lesson topic when no local card asset exists. */
export const lessonCardImages: Record<LessonImageKey, string> = {
  greetings:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=160&h=160&fit=crop",
  dailyLife:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop",
  cafe: "https://images.unsplash.com/photo-1501339846602-324c07f30717?w=160&h=160&fit=crop",
  travel:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=160&h=160&fit=crop",
  shopping:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=160&h=160&fit=crop",
  family:
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=160&h=160&fit=crop",
};

export const unitHeroImages = {
  mascotHeroCafe,
  mascotWelcome,
  palace,
  earth,
} satisfies Record<UnitHeroImageKey, typeof mascotHeroCafe>;

export const images = {
  earth,
  mascotHeroCafe,
  mascotAuth,
  /** Fox teacher on the AI audio lesson screen (purple sweater, waving) */
  mascotTeacher: mascotSweater,
  mascotSweater,
  mascotLogo,
  mascotWelcome,
  palace,
  streakFire,
  treasure,
};
