import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { type Href, Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FloatingLabelInput } from "@/components/auth/floating-label-input";
import { SocialAuthButton } from "@/components/auth/social-auth-button";
import { VerificationModal } from "@/components/auth/verification-modal";
import { images } from "@/constants/images";
import { type AuthMode, useAuthFlow } from "@/hooks/use-auth-flow";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

type AuthScreenProps = {
  mode: AuthMode;
  title: string;
  subtitle: string;
  primaryButtonLabel: string;
  showPasswordField?: boolean;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: Href;
};

export function AuthScreen({
  mode,
  title,
  subtitle,
  primaryButtonLabel,
  showPasswordField = false,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthScreenProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const {
    isLoading,
    isAuthLoaded,
    isResourcesLoaded,
    isSignedIn,
    startEmailVerification,
    verifyEmailCode,
    signInWithSocial,
    getEmailError,
    getPasswordError,
  } = useAuthFlow(mode);

  const contentWidth = width - 48;
  const mascotSize = Math.min(contentWidth * 0.64, 220);
  const mascotCropHeight = mascotSize * 0.8;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verificationVisible, setVerificationVisible] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isAuthLoaded || !isResourcesLoaded || isSignedIn) {
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

  const handlePrimaryPress = async () => {
    const trimmedEmail = email.trim();
    let nextEmailError = "";
    let nextPasswordError = "";

    if (!trimmedEmail) {
      nextEmailError = "Email is required";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextEmailError = "Enter a valid email address";
    }

    if (showPasswordField) {
      if (!password) {
        nextPasswordError = "Password is required";
      } else if (password.length < MIN_PASSWORD_LENGTH) {
        nextPasswordError = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
      }
    }

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    const result = await startEmailVerification(
      trimmedEmail,
      showPasswordField ? password : undefined,
    );

    if (!result.ok) {
      setEmailError(result.emailError ?? getEmailError());
      if (result.passwordError) {
        setPasswordError(result.passwordError ?? getPasswordError());
      }
      return;
    }

    if ("completed" in result && result.completed) {
      return;
    }

    setVerificationVisible(true);
  };

  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    try {
      return await verifyEmailCode(code);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-background px-6 pb-6 pt-1">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="-ml-1.5 h-10 w-10 items-center justify-center active:opacity-70"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#0D132B" />
            </Pressable>

            <View className="mt-3">
              <Text className="typ-h2 text-ink">{title}</Text>
              <Text className="typ-body-md mt-1.5 text-ink-secondary">
                {subtitle}
              </Text>
            </View>

            <View
              className="mt-2 items-center overflow-hidden"
              style={{ height: mascotCropHeight, marginBottom: -10 }}
            >
              <Image
                source={images.mascotAuth}
                style={{
                  width: mascotSize,
                  height: mascotSize,
                  marginTop: -mascotSize * 0.05,
                }}
                contentFit="contain"
              />
            </View>

            <View className="gap-3">
              <FloatingLabelInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) {
                    setEmailError("");
                  }
                }}
                error={emailError}
                placeholder="you@example.com"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
              />

              {showPasswordField ? (
                <FloatingLabelInput
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) {
                      setPasswordError("");
                    }
                  }}
                  error={passwordError}
                  placeholder="At least 8 characters"
                  secure
                  textContentType="password"
                  autoComplete="password"
                />
              ) : null}
            </View>

            <Pressable
              accessibilityRole="button"
              className="mt-4 active:opacity-90"
              disabled={isLoading || !isResourcesLoaded}
              onPress={handlePrimaryPress}
            >
              <View
                className="items-center justify-center rounded-xl py-4"
                style={{
                  experimental_backgroundImage:
                    "linear-gradient(to right, #7C5CFF 0%, #6338FF 100%)",
                  opacity: isLoading || !isResourcesLoaded ? 0.7 : 1,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="font-poppins-bold text-base text-white">
                    {primaryButtonLabel}
                  </Text>
                )}
              </View>
            </Pressable>

            <View className="my-5 flex-row items-center">
              <View className="h-px flex-1 bg-border" />
              <Text className="typ-body-sm mx-4 text-ink-secondary">
                or continue with
              </Text>
              <View className="h-px flex-1 bg-border" />
            </View>

            <View className="gap-3">
              <SocialAuthButton
                provider="google"
                onPress={
                  isResourcesLoaded ? () => signInWithSocial("google") : undefined
                }
              />
              <SocialAuthButton
                provider="facebook"
                onPress={
                  isResourcesLoaded ? () => signInWithSocial("facebook") : undefined
                }
              />
              <SocialAuthButton
                provider="apple"
                onPress={
                  isResourcesLoaded ? () => signInWithSocial("apple") : undefined
                }
              />
            </View>

            <View className="mt-6">
              <View className="flex-row flex-wrap items-center justify-center">
                <Text className="typ-body-md text-ink-secondary">
                  {footerText}{" "}
                </Text>
                <Link href={footerLinkHref} asChild>
                  <Pressable accessibilityRole="link">
                    <Text className="font-poppins-semibold text-base text-lingua-purple">
                      {footerLinkText}
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>

            {mode === "sign-up" ? (
              <View nativeID="clerk-captcha" style={{ height: 0, overflow: "hidden" }} />
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={verificationVisible}
        email={email.trim()}
        onClose={() => setVerificationVisible(false)}
        onVerify={handleVerify}
        isVerifying={isVerifying}
      />
    </SafeAreaView>
  );
}
