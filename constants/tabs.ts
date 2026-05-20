import type { Ionicons } from "@expo/vector-icons";

export type TabRouteName =
  | "index"
  | "learn"
  | "ai-teacher"
  | "chat"
  | "profile";

export type TabItem = {
  route: TabRouteName;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
};

export const TAB_ITEMS: TabItem[] = [
  { route: "index", label: "Home", icon: "home-outline", activeIcon: "home" },
  { route: "learn", label: "Learn", icon: "book-outline", activeIcon: "book" },
  {
    route: "ai-teacher",
    label: "AI Teacher",
    icon: "school-outline",
    activeIcon: "school",
  },
  {
    route: "chat",
    label: "Chat",
    icon: "chatbubble-outline",
    activeIcon: "chatbubble",
  },
  {
    route: "profile",
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
];

export const TAB_INACTIVE_COLOR = "#9CA3AF";
export const TAB_ACTIVE_CIRCLE_COLOR = "#6C4EF5";
export const TAB_INDICATOR_SIZE = 52;
export const TAB_ICON_SIZE = 24;
export const TAB_LABEL_SIZE = 11;
