import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
  type DimensionValue,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants/images";

const SPEECH_BUBBLE = {
  hello: { bg: "#E3EEFF", text: "#0D132B" },
  hola: { bg: "#EBE6FF", text: "#6C4EF5" },
  nihao: { bg: "#FFE8DC", text: "#FF4D4F" },
} as const;

/** Percent string typed for layout props (template literals are inferred as `string`). */
function pct(value: number): DimensionValue {
  return `${value}%` as DimensionValue;
}

/** Absolute % positions tuned per width bucket (SE → Pro Max) and height (compact ↔ tall). */
function getOnboardingBubblePositions(windowWidth: number, windowHeight: number) {
  // Same vertical anchor for Hello + ¡Hola! (ear level); 你好! sits lower by the waving hand.
  let earBubbleBottom = 60;
  let helloLeft = 11;
  let holaRight = 11;
  let nihaoBottom = 43;
  let nihaoRight = 5.5;

  if (windowWidth <= 360) {
    earBubbleBottom = 57;
    helloLeft = 7;
    holaRight = 7;
    nihaoBottom = 40;
    nihaoRight = 4;
  } else if (windowWidth <= 390) {
    earBubbleBottom = 60;
    helloLeft = 11;
    holaRight = 11;
    nihaoBottom = 43;
    nihaoRight = 5;
  } else if (windowWidth < 428) {
    earBubbleBottom = 61;
    helloLeft = 12;
    holaRight = 12;
    nihaoBottom = 44;
    nihaoRight = 6;
  } else {
    earBubbleBottom = 63;
    helloLeft = 13;
    holaRight = 13;
    nihaoBottom = 46;
    nihaoRight = 7;
  }

  // Compact vertical space (e.g. SE): lower bubbles slightly toward the fox.
  if (windowHeight < 700) {
    earBubbleBottom -= 3;
    nihaoBottom -= 3;
  } else if (windowHeight >= 852) {
    earBubbleBottom += 1;
    nihaoBottom += 1;
  }

  return {
    hello: { bottom: pct(earBubbleBottom), left: pct(helloLeft) },
    hola: { bottom: pct(earBubbleBottom), right: pct(holaRight) },
    nihao: { bottom: pct(nihaoBottom), right: pct(nihaoRight) },
  };
}

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
          alignSelf: tailSide === "bottom-right" ? "flex-end" : "flex-start",
          marginLeft: tailSide === "bottom-left" ? 18 : undefined,
          marginRight: tailSide === "bottom-right" ? 18 : undefined,
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

function OnboardingMascot({
  illustrationWidth,
  bubblePositions,
}: {
  illustrationWidth: number;
  bubblePositions: ReturnType<typeof getOnboardingBubblePositions>;
}) {
  const illustrationHeight = illustrationWidth * 1.08;

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
          bottom: bubblePositions.hello.bottom,
          left: bubblePositions.hello.left,
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
          bottom: bubblePositions.hola.bottom,
          right: bubblePositions.hola.right,
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
          bottom: bubblePositions.nihao.bottom,
          right: bubblePositions.nihao.right,
          zIndex: 2,
        }}
      />
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const illustrationWidth = Math.min(width - 20, width * 0.96);
  const bubblePositions = getOnboardingBubblePositions(width, height);

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

        <View className="mt-6 w-full items-center px-6">
          <View
            style={{
              width: "100%",
              maxWidth: 352,
              alignSelf: "center",
            }}
          >
            <Text className="typ-h1 text-left text-ink">
              Your AI language{"\n"}
              <Text className="text-left text-lingua-purple">teacher.</Text>
            </Text>
            <Text className="typ-body-md mt-3 text-left text-ink-secondary">
              Real conversations, personalized lessons, anytime, anywhere.
            </Text>
          </View>
        </View>

        <View className="min-h-0 flex-1 items-center justify-start px-6 pt-4">
          <OnboardingMascot
            illustrationWidth={illustrationWidth}
            bubblePositions={bubblePositions}
          />
        </View>

        <View className="px-6 pb-6">
          <Pressable
            accessibilityRole="button"
            className="flex-row items-center justify-center rounded-full bg-lingua-purple py-4 active:opacity-90"
            onPress={() => router.push("/sign-up")}
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
