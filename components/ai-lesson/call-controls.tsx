import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type ControlConfig = {
  id: string;
  label: string;
  icon: IoniconName;
  variant?: "default" | "danger";
  active?: boolean;
  onPress: () => void;
};

type CallControlsProps = {
  micEnabled: boolean;
  subtitlesEnabled: boolean;
  overlay?: boolean;
  onToggleMic: () => void;
  onToggleSubtitles: () => void;
  onToggleCamera: () => void;
  onEndCall: () => void;
};

function ControlButton({
  label,
  icon,
  variant = "default",
  active,
  overlay,
  onPress,
}: ControlConfig & { overlay?: boolean }) {
  const isDanger = variant === "danger";

  return (
    <View className="items-center">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        className={`h-[60px] w-[60px] items-center justify-center rounded-full active:opacity-85 ${
          isDanger
            ? "bg-error"
            : active
              ? "bg-[#EEF2FF]"
              : overlay
                ? "border border-white/80 bg-white/95"
                : "border border-border bg-white"
        }`}
      >
        <Ionicons
          name={icon}
          size={26}
          color={isDanger ? "#FFFFFF" : active ? "#6C4EF5" : "#4D8BFF"}
        />
      </Pressable>
      <Text
        className={`mt-2 font-poppins-medium text-xs ${
          overlay ? "text-white" : "text-ink-secondary"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

export function CallControls({
  micEnabled,
  subtitlesEnabled,
  overlay = false,
  onToggleMic,
  onToggleSubtitles,
  onToggleCamera,
  onEndCall,
}: CallControlsProps) {
  return (
    <View
      className={`flex-row items-center justify-between px-6 ${overlay ? "" : "mt-5 px-8"}`}
    >
      <ControlButton
        id="camera"
        label="Camera"
        icon="videocam-outline"
        overlay={overlay}
        onPress={onToggleCamera}
      />
      <ControlButton
        id="mic"
        label="Mic"
        icon={micEnabled ? "mic" : "mic-off"}
        active={micEnabled}
        overlay={overlay}
        onPress={onToggleMic}
      />
      <ControlButton
        id="subtitles"
        label="Subtitles"
        icon="language"
        active={subtitlesEnabled}
        overlay={overlay}
        onPress={onToggleSubtitles}
      />
      <ControlButton
        id="end"
        label="End Call"
        icon="call-outline"
        variant="danger"
        overlay={overlay}
        onPress={onEndCall}
      />
    </View>
  );
}
