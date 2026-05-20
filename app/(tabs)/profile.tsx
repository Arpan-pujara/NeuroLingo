import { Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="typ-h2 text-ink">Profile</Text>
      <Text className="mt-2 text-center typ-body-md text-ink-secondary">
        Profile and settings will live here.
      </Text>
    </View>
  );
}
