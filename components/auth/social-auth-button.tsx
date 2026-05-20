import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type SocialProvider = "google" | "facebook" | "apple";

type SocialAuthButtonProps = {
  provider: SocialProvider;
  onPress?: () => void;
};

const SOCIAL_CONFIG: Record<
  SocialProvider,
  { label: string; icon: keyof typeof FontAwesome5.glyphMap; color: string }
> = {
  google: {
    label: "Continue with Google",
    icon: "google",
    color: "#EA4335",
  },
  facebook: {
    label: "Continue with Facebook",
    icon: "facebook",
    color: "#1877F2",
  },
  apple: {
    label: "Continue with Apple",
    icon: "apple",
    color: "#0D132B",
  },
};

export function SocialAuthButton({ provider, onPress }: SocialAuthButtonProps) {
  const config = SOCIAL_CONFIG[provider];

  return (
    <Pressable
      accessibilityRole="button"
      className="rounded-xl border border-border bg-white active:opacity-90"
      onPress={onPress}
    >
      <View className="relative flex-row items-center justify-center px-4 py-3.5">
        <View className="absolute left-4">
          <FontAwesome5
            name={config.icon}
            size={18}
            color={config.color}
            brand={provider !== "apple"}
          />
        </View>
        <Text className="font-poppins-medium text-base text-ink">
          {config.label}
        </Text>
      </View>
    </Pressable>
  );
}
