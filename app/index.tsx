import { useAuth, useClerk } from "@clerk/expo";
import { Redirect, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <ActivityIndicator size="large" color="#6338FF" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={"/onboarding" as Href} />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        backgroundColor: "#ffffff",
      }}
    >
      <Text className="typ-h1 text-ink text-lingua-purple">NeuroLingo</Text>
      <Text className="typ-body-md text-ink-secondary">
        Welcome back! Your lessons are ready.
      </Text>
      <Pressable
        accessibilityRole="button"
        className="rounded-xl bg-lingua-purple px-6 py-3 active:opacity-90"
      >
        <Text className="font-poppins-semibold text-base text-white">
          Continue learning
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        className="rounded-xl border border-border px-6 py-3 active:opacity-90"
        onPress={() => router.push("/choose-language")}
      >
        <Text className="font-poppins-semibold text-base text-ink">
          Choose a language
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        className="rounded-xl border border-border px-6 py-3 active:opacity-90"
        disabled={isSigningOut}
        onPress={handleSignOut}
        style={{ opacity: isSigningOut ? 0.7 : 1 }}
      >
        {isSigningOut ? (
          <ActivityIndicator color="#6338FF" />
        ) : (
          <Text className="font-poppins-semibold text-base text-ink">
            Sign out
          </Text>
        )}
      </Pressable>
    </View>
  );
}
