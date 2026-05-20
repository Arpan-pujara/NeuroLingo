import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

type FloatingLabelInputProps = TextInputProps & {
  label: string;
  secure?: boolean;
  error?: string;
};

export function FloatingLabelInput({
  label,
  secure = false,
  error,
  ...inputProps
}: FloatingLabelInputProps) {
  const [isSecure, setIsSecure] = useState(secure);
  const borderClassName = error ? "border-error" : "border-border";

  return (
    <View>
      <View className={`rounded-xl border bg-white px-4 py-3 ${borderClassName}`}>
        <Text className="typ-caption text-ink-secondary">{label}</Text>
        <View className="mt-1 flex-row items-center">
          <TextInput
            className="flex-1 font-poppins text-base text-ink"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={isSecure}
            autoCapitalize="none"
            autoCorrect={false}
            {...inputProps}
          />
          {secure ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isSecure ? "Show password" : "Hide password"}
              hitSlop={8}
              onPress={() => setIsSecure((current) => !current)}
            >
              <Ionicons
                name={isSecure ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#9CA3AF"
              />
            </Pressable>
          ) : null}
        </View>
      </View>
      {error ? (
        <Text className="typ-caption mt-1.5 text-error">{error}</Text>
      ) : null}
    </View>
  );
}
