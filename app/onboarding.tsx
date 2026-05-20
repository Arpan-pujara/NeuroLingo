import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

const SPEECH_BUBBLE = {
  hello: { bg: "#E3EEFF", text: "#0D132B" },
  hola: { bg: "#EBE6FF", text: "#6C4EF5" },
  nihao: { bg: "#FFE8DC", text: "#FF4D4F" },
} as const;

type SpeechBubbleProps = {
  label: string;
  backgroundColor: string;
  textColor: string;
  bold?: boolean;
  tailSide?: "bottom-left" | "bottom-right";
  style?: ViewStyle;
};

function SpeechBubble({
  label,
  backgroundColor,
  textColor,
  bold = false,
  tailSide = "bottom-right",
  style,
}: SpeechBubbleProps) {
  return (
    <View style={style}>
      <View
        style={{
          backgroundColor,
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: 6,
          shadowColor: "#0D132B",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Text
          className={bold ? "font-poppins-semibold" : "font-poppins-medium"}
          style={{ color: textColor, fontSize: 15 }}
        >
          {label}
        </Text>
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          marginTop: -1,
          alignSelf: tailSide === "bottom-right" ? "flex-start" : "flex-end",
          marginLeft: tailSide === "bottom-right" ? 18 : undefined,
          marginRight: tailSide === "bottom-left" ? 18 : undefined,
          borderLeftWidth: 7,
          borderRightWidth: 7,
          borderTopWidth: 9,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: backgroundColor,
        }}
      />
    </View>
  );
}

function OnboardingMascot() {
  const { width } = useWindowDimensions();
  const illustrationWidth = width - 32;
  const illustrationHeight = illustrationWidth * 0.92;

  return (
    <View
      style={{
        width: illustrationWidth,
        height: illustrationHeight,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
      }}
    >
      <Image
        source={images.mascotWelcome}
        style={{
          width: illustrationWidth,
          height: illustrationHeight,
        }}
        contentFit="contain"
      />
      <SpeechBubble
        label="Hello!"
        backgroundColor={SPEECH_BUBBLE.hello.bg}
        textColor={SPEECH_BUBBLE.hello.text}
        tailSide="bottom-right"
        style={{
          position: "absolute",
          bottom: "66%",
          left: "10%",
          zIndex: 2,
        }}
      />
      <SpeechBubble
        label="¡Hola!"
        backgroundColor={SPEECH_BUBBLE.hola.bg}
        textColor={SPEECH_BUBBLE.hola.text}
        bold
        tailSide="bottom-left"
        style={{
          position: "absolute",
          bottom: "68%",
          right: "10%",
          zIndex: 2,
        }}
      />
      <SpeechBubble
        label="你好!"
        backgroundColor={SPEECH_BUBBLE.nihao.bg}
        textColor={SPEECH_BUBBLE.nihao.text}
        bold
        tailSide="bottom-left"
        style={{
          position: "absolute",
          bottom: "50%",
          right: "8%",
          zIndex: 2,
        }}
      />
    </View>
  );
}

export default function OnboardingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="flex-1 bg-background">
        <View className="items-center pt-3">
          <View className="flex-row items-center gap-2">
            <Image
              source={images.mascotLogo}
              style={{ width: 32, height: 32 }}
              contentFit="contain"
            />
            <Text className="font-poppins-bold text-xl text-ink">NeuroLingo</Text>
          </View>
        </View>

        <View className="mt-6 px-6">
          <Text className="typ-h1 text-ink">
            Your AI language{"\n"}
            <Text className="text-lingua-purple">teacher.</Text>
          </Text>
          <Text className="typ-body-md mt-3 text-ink-secondary">
            Real conversations, personalized lessons, anytime, anywhere.
          </Text>
        </View>

        <View className="min-h-0 flex-1 items-center justify-center px-6">
          <OnboardingMascot />
        </View>

        <View className="px-6 pb-6">
          <Pressable
            accessibilityRole="button"
            className="flex-row items-center justify-center rounded-2xl bg-lingua-purple py-4 active:opacity-90"
          >
            <Text className="font-poppins-bold text-base text-white">
              Get Started
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#ffffff"
              style={{ position: "absolute", right: 20 }}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
