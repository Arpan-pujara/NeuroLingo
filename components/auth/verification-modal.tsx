import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type VerificationModalProps = {
  visible: boolean;
  email: string;
  onClose: () => void;
  onVerify: (code: string) => Promise<{ ok: boolean; codeError?: string }>;
  isVerifying?: boolean;
};

const CODE_LENGTH = 6;

const sheetShadow = Platform.select({
  ios: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
  },
  android: {
    elevation: 24,
  },
  default: {},
});

export function VerificationModal({
  visible,
  email,
  onClose,
  onVerify,
  isVerifying = false,
}: VerificationModalProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const isSubmittingRef = useRef(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    if (!visible) {
      setCode("");
      setCodeError("");
      setKeyboardOffset(0);
      Keyboard.dismiss();
      return;
    }

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = Keyboard.addListener(showEvent, (event) => {
      const offset = event.endCoordinates.height - insets.bottom;
      setKeyboardOffset(Math.max(0, offset));
    });

    const onHide = Keyboard.addListener(hideEvent, () => {
      setKeyboardOffset(0);
    });

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);

    return () => {
      clearTimeout(timer);
      onShow.remove();
      onHide.remove();
    };
  }, [visible, insets.bottom]);

  const handleClose = () => {
    Keyboard.dismiss();
    setKeyboardOffset(0);
    onClose();
  };

  const handleCodeChange = async (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digits);
    if (codeError) {
      setCodeError("");
    }

    if (
      digits.length !== CODE_LENGTH ||
      isVerifying ||
      isSubmittingRef.current
    ) {
      return;
    }

    isSubmittingRef.current = true;
    Keyboard.dismiss();
    setKeyboardOffset(0);

    try {
      const result = await onVerify(digits);
      if (result.ok) {
        handleClose();
        return;
      }

      setCode("");
      setCodeError(result.codeError ?? "Invalid verification code");
      setTimeout(() => inputRef.current?.focus(), 150);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const sheetBottomPadding = Math.max(insets.bottom, 20);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close verification"
          onPress={handleClose}
          style={styles.backdrop}
        />

        <View
          pointerEvents="box-none"
          style={[styles.sheetContainer, { marginBottom: keyboardOffset }]}
        >
          <View
            className="overflow-hidden rounded-t-3xl bg-white"
            style={[sheetShadow, styles.sheet]}
          >
            <View className="items-center px-6 pb-2 pt-5">
              <View className="mb-5 h-1 w-10 rounded-full bg-border" />

              <Text className="typ-h3 text-center text-ink">Check your email</Text>
              <Text className="typ-body-md mt-2 text-center text-ink-secondary">
                We sent a 6-digit verification code to{" "}
                <Text className="font-poppins-semibold text-ink">{email}</Text>
                . Enter it below to continue.
              </Text>

              {codeError ? (
                <Text className="typ-body-sm mt-3 text-center text-error">
                  {codeError}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Enter verification code"
                className="mt-6 w-full"
                disabled={isVerifying}
                onPress={() => inputRef.current?.focus()}
              >
                <View
                  className="flex-row justify-center gap-2.5"
                  style={{ opacity: isVerifying ? 0.55 : 1 }}
                >
                  {Array.from({ length: CODE_LENGTH }, (_, index) => {
                    const digit = code[index] ?? "";
                    const isActive =
                      !isVerifying &&
                      index === code.length &&
                      code.length < CODE_LENGTH;
                    const isFilled = digit.length > 0;

                    return (
                      <View
                        key={index}
                        className={`h-14 w-11 items-center justify-center rounded-xl border bg-white ${
                          isActive
                            ? "border-lingua-purple"
                            : isFilled
                              ? "border-lingua-purple/40 bg-lingua-purple/5"
                              : "border-border"
                        }`}
                      >
                        <Text className="font-poppins-semibold text-xl text-ink">
                          {digit}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </Pressable>

              {isVerifying ? (
                <View className="mt-4 flex-row items-center justify-center gap-2">
                  <ActivityIndicator size="small" color="#6338FF" />
                  <Text className="typ-body-sm text-ink-secondary">
                    Verifying code…
                  </Text>
                </View>
              ) : null}

              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                maxLength={CODE_LENGTH}
                editable={!isVerifying}
                caretHidden
                style={styles.hiddenInput}
              />
            </View>

            <View
              style={{ height: sheetBottomPadding }}
              className="bg-white"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13, 19, 43, 0.58)",
  },
  sheetContainer: {
    width: "100%",
  },
  sheet: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(13, 19, 43, 0.08)",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 1,
    width: 1,
  },
});
