import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type AiLessonHeaderProps = {
  streak: number;
  onBack: () => void;
};

export function AiLessonHeader({ streak, onBack }: AiLessonHeaderProps) {
  return (
    <View className="flex-row items-center px-5 pb-3 pt-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        hitSlop={8}
        className="h-10 w-10 items-center justify-center active:opacity-70"
      >
        <Ionicons name="chevron-back" size={26} color="#0D132B" />
      </Pressable>

      <View className="ml-1 flex-1">
        <Text className="font-poppins-bold text-xl text-ink">AI Teacher</Text>
        <View className="mt-0.5 flex-row items-center">
          <View className="mr-1.5 h-2 w-2 rounded-full bg-lingua-green" />
          <Text className="font-poppins text-sm text-ink-secondary">Online</Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="h-10 w-10 items-center justify-center rounded-full border border-border bg-white opacity-50">
          <Ionicons name="videocam-outline" size={20} color="#9CA3AF" />
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-full border border-border bg-white">
          <Text className="font-poppins-semibold text-sm text-ink">{streak}</Text>
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-full border border-border bg-white">
          <Ionicons name="headset-outline" size={20} color="#0D132B" />
        </View>
      </View>
    </View>
  );
}
