import {
  isClerkAPIResponseError,
  useAuth,
  useClerk,
  useSignIn,
  useSignUp,
  useSSO,
} from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useRef } from "react";

import { getClerkErrorMessage } from "@/lib/clerk-errors";
import "@/lib/oauth";

export type AuthMode = "sign-in" | "sign-up";

type OAuthProvider = "google" | "facebook" | "apple";

const OAUTH_STRATEGIES = {
  google: "oauth_google",
  facebook: "oauth_facebook",
  apple: "oauth_apple",
} as const satisfies Record<OAuthProvider, `oauth_${string}`>;

type FieldErrorLike = { message?: string; longMessage?: string } | null | undefined;

function getClerkFieldMessage(fieldError: FieldErrorLike): string {
  if (!fieldError) {
    return "";
  }

  return fieldError.longMessage ?? fieldError.message ?? "";
}

export function useAuthFlow(mode: AuthMode) {
  const router = useRouter();
  const { setActive } = useClerk();
  const { isSignedIn, isLoaded } = useAuth();
  const { signIn, errors: signInErrors, fetchStatus: signInStatus } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const verifyWithSignInRef = useRef(false);

  const isLoading = signInStatus === "fetching" || signUpStatus === "fetching";

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/" as Href);
    }
  }, [isLoaded, isSignedIn, router]);

  const activateSession = useCallback(
    async (sessionId: string | null | undefined) => {
      if (!sessionId) {
        return false;
      }

      await setActive({ session: sessionId });
      router.replace("/" as Href);
      return true;
    },
    [router, setActive],
  );

  const startEmailVerification = useCallback(
    async (email: string, password?: string) => {
      try {
        if (mode === "sign-in") {
          verifyWithSignInRef.current = true;
          const { error } = await signIn.emailCode.sendCode({ emailAddress: email });
          if (error) {
            return {
              ok: false as const,
              emailError: error.message ?? "Could not send verification code",
            };
          }

          return { ok: true as const };
        }

        const { error: passwordError } = await signUp.password({
          emailAddress: email,
          password: password ?? "",
        });

        if (passwordError) {
          return {
            ok: false as const,
            emailError: getClerkFieldMessage(signUpErrors.fields.emailAddress),
            passwordError: getClerkFieldMessage(signUpErrors.fields.password),
          };
        }

        if (signUp.isTransferable) {
          await signUp.reset();
          verifyWithSignInRef.current = true;
          const { error: sendError } = await signIn.emailCode.sendCode({
            emailAddress: email,
          });
          if (sendError) {
            return {
              ok: false as const,
              emailError:
                sendError.message ?? "Account exists. Could not send sign-in code.",
            };
          }
          return { ok: true as const };
        }

        verifyWithSignInRef.current = false;

        const needsEmailVerification =
          signUp.status === "missing_requirements" &&
          signUp.unverifiedFields.includes("email_address");

        if (needsEmailVerification) {
          const { error: sendError } = await signUp.verifications.sendEmailCode();
          if (sendError) {
            return {
              ok: false as const,
              emailError: sendError.message ?? "Could not send verification code",
            };
          }
        }

        if (signUp.status === "complete" && signUp.createdSessionId) {
          await activateSession(signUp.createdSessionId);
          return { ok: true as const, completed: true };
        }

        return { ok: true as const };
      } catch (error) {
        return {
          ok: false as const,
          emailError: getClerkErrorMessage(error, "Could not send verification code"),
        };
      }
    },
    [
      activateSession,
      mode,
      signIn,
      signUp,
      signUpErrors.fields.emailAddress,
      signUpErrors.fields.password,
    ],
  );

  const verifyEmailCode = useCallback(
    async (code: string) => {
      try {
        if (mode === "sign-in" || verifyWithSignInRef.current) {
          const { error } = await signIn.emailCode.verifyCode({ code });
          if (error) {
            return {
              ok: false as const,
              codeError:
                getClerkFieldMessage(signInErrors.fields.code) ||
                error.message ||
                "Invalid verification code",
            };
          }

          if (signIn.status === "needs_client_trust") {
            const emailCodeFactor = signIn.supportedSecondFactors?.find(
              (factor) => factor.strategy === "email_code",
            );
            if (emailCodeFactor) {
              await signIn.mfa.sendEmailCode();
            }
            return {
              ok: false as const,
              codeError: "Additional verification is required.",
            };
          }

          if (signIn.status === "complete") {
            const activated = await activateSession(signIn.createdSessionId);
            if (activated) {
              return { ok: true as const };
            }

            return {
              ok: false as const,
              codeError: "Sign-in could not be completed. Try again.",
            };
          }

          return {
            ok: false as const,
            codeError: "Sign-in could not be completed. Try again.",
          };
        }

        const { error } = await signUp.verifications.verifyEmailCode({ code });
        if (error) {
          return {
            ok: false as const,
            codeError:
              getClerkFieldMessage(signUpErrors.fields.code) ||
              error.message ||
              "Invalid verification code",
          };
        }

        if (signUp.status === "complete") {
          const activated = await activateSession(signUp.createdSessionId);
          if (activated) {
            return { ok: true as const };
          }

          return {
            ok: false as const,
            codeError: "Sign-up could not be completed. Try again.",
          };
        }

        return {
          ok: false as const,
          codeError: "Sign-up could not be completed. Try again.",
        };
      } catch (error) {
        if (isClerkAPIResponseError(error)) {
          const codeIssue = error.errors.find((entry) => entry.meta?.paramName === "code");
          return {
            ok: false as const,
            codeError:
              codeIssue?.longMessage ??
              codeIssue?.message ??
              getClerkErrorMessage(error, "Invalid verification code"),
          };
        }

        return {
          ok: false as const,
          codeError: getClerkErrorMessage(error, "Invalid verification code"),
        };
      }
    },
    [
      activateSession,
      mode,
      signIn,
      signInErrors.fields.code,
      signUp,
      signUpErrors.fields.code,
    ],
  );

  const signInWithSocial = useCallback(
    async (provider: OAuthProvider) => {
      try {
        const redirectUrl = Linking.createURL("oauth-callback");
        const { createdSessionId, setActive: setActiveFromSSO } = await startSSOFlow({
          strategy: OAUTH_STRATEGIES[provider],
          redirectUrl,
        });

        if (createdSessionId && setActiveFromSSO) {
          await setActiveFromSSO({ session: createdSessionId });
          router.replace("/" as Href);
        }
      } catch (error) {
        console.error("Social sign-in failed:", getClerkErrorMessage(error, "Sign-in failed"));
      }
    },
    [router, startSSOFlow],
  );

  return {
    isLoading,
    isLoaded,
    isSignedIn,
    startEmailVerification,
    verifyEmailCode,
    signInWithSocial,
    getEmailError: () =>
      mode === "sign-in"
        ? getClerkFieldMessage(signInErrors.fields.identifier)
        : getClerkFieldMessage(signUpErrors.fields.emailAddress),
    getPasswordError: () => getClerkFieldMessage(signUpErrors.fields.password),
  };
}
