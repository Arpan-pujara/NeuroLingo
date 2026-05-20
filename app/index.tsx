import { type Href, Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
      }}
    >
      <Text className="typ-h1 text-ink text-lingua-purple">NeuroLingo</Text>
      <Link href={"/onboarding" as Href} asChild>
        <Pressable className="rounded-xl bg-lingua-purple px-6 py-3 active:opacity-90">
          <Text className="font-poppins-semibold text-base text-white">
            View Onboarding
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
