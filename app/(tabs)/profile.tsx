import { useClerk, useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { posthog } from "@/lib/posthog";

const safeAreaStyle = { flex: 1, backgroundColor: "#ffffff" } as const;

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      await Promise.resolve(posthog.reset());
      posthog.capture("sign_out_completed");
      router.replace("/onboarding");
    } catch (error) {
      console.error("Sign out failed", error);
      posthog.capture("sign_out_failed");
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={safeAreaStyle}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6C4EF5" />
        </View>
      </SafeAreaView>
    );
  }

  const displayName =
    user?.fullName?.trim() ||
    user?.firstName?.trim() ||
    user?.primaryEmailAddress?.emailAddress ||
    "Learner";

  return (
    <SafeAreaView style={safeAreaStyle}>
      <View className="flex-1 px-6 pt-4">
        <Text className="typ-h2 text-ink">Profile</Text>
        <Text className="typ-body-md mt-2 text-ink-secondary">{displayName}</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => void handleSignOut()}
          className="mt-8 items-center rounded-xl border border-border bg-white py-4 active:opacity-90"
        >
          <Text className="font-poppins-semibold text-base text-error">Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
