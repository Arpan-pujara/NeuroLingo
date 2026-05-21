import { Text, View } from "react-native";

export default function AiTeacherScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="typ-h2 text-ink">AI Teacher</Text>
      <Text className="mt-2 text-center typ-body-md text-ink-secondary">
        Video lessons with your AI teacher will live here.
      </Text>
    </View>
  );
}
