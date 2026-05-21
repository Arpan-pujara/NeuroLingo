import { Pressable, Text, View } from "react-native";

export type LessonsTab = "lessons" | "practice";

type LessonsTabSwitcherProps = {
  activeTab: LessonsTab;
  onTabChange: (tab: LessonsTab) => void;
};

export function LessonsTabSwitcher({
  activeTab,
  onTabChange,
}: LessonsTabSwitcherProps) {
  return (
    <View className="mx-5 mt-4 flex-row rounded-2xl bg-[#ECE9FF] p-1">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: activeTab === "lessons" }}
        onPress={() => onTabChange("lessons")}
        className={`flex-1 items-center rounded-xl py-3 ${
          activeTab === "lessons" ? "bg-white shadow-sm" : ""
        }`}
      >
        <Text
          className={`font-poppins-semibold text-[15px] ${
            activeTab === "lessons" ? "text-lingua-purple" : "text-ink-secondary"
          }`}
        >
          Lessons
        </Text>
        {activeTab === "lessons" ? (
          <View className="absolute bottom-1 h-1 w-12 rounded-full bg-lingua-purple" />
        ) : null}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: activeTab === "practice" }}
        onPress={() => onTabChange("practice")}
        className={`flex-1 items-center rounded-xl py-3 ${
          activeTab === "practice" ? "bg-white shadow-sm" : ""
        }`}
      >
        <Text
          className={`font-poppins-semibold text-[15px] ${
            activeTab === "practice" ? "text-lingua-purple" : "text-ink-secondary"
          }`}
        >
          Practice
        </Text>
        {activeTab === "practice" ? (
          <View className="absolute bottom-1 h-1 w-12 rounded-full bg-lingua-purple" />
        ) : null}
      </Pressable>
    </View>
  );
}
