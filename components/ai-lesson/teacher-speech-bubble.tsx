import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TeacherSpeechBubbleProps = {
  primary: string;
  secondary: string;
  showSubtitles: boolean;
  onPlayAudio?: () => void;
};

export function TeacherSpeechBubble({
  primary,
  secondary,
  showSubtitles,
  onPlayAudio,
}: TeacherSpeechBubbleProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.bubble}>
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="font-poppins-bold text-lg text-ink">{primary}</Text>
            {showSubtitles ? (
              <Text className="mt-1 font-poppins text-[15px] leading-5 text-ink-secondary">
                {secondary}
              </Text>
            ) : (
              <Text className="mt-1 font-poppins text-[15px] leading-5 text-ink-secondary">
                That was great! 👏
              </Text>
            )}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Play teacher audio"
            onPress={onPlayAudio}
            hitSlop={8}
            className="h-9 w-9 items-center justify-center rounded-full bg-[#EEF2FF] active:opacity-80"
          >
            <Ionicons name="volume-high" size={20} color="#6C4EF5" />
          </Pressable>
        </View>
      </View>
      <View style={styles.tailRow}>
        <View style={styles.tail} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
  },
  bubble: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tailRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 118,
  },
  tail: {
    width: 0,
    height: 0,
    marginTop: -1,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFFFFF",
  },
});
