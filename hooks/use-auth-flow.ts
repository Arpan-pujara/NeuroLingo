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

type ResourceGuardResult =
  | { ok: true }
  | { ok: false; message: string };

function getClerkFieldMessage(fieldError: FieldErrorLike): string {
  if (!fieldError) {
    return "";
  }

  return fieldError.longMessage ?? fieldError.message ?? "";
}

function getReturnedErrorMessage(
  error: { message?: string; longMessage?: string } | null,
  fallback: string,
): string {
  if (!error) {
    return fallback;
  }

  return error.longMessage ?? error.message ?? fallback;
}

function isHookResourceLoaded(
  hookResult: { isLoaded?: boolean; signIn?: unknown; signUp?: unknown },
  resourceKey: "signIn" | "signUp",
): boolean {
  if (typeof hookResult.isLoaded === "boolean") {
    return hookResult.isLoaded;
  }

  return hookResult[resourceKey] != null;
}

const RESOURCES_LOADING_MESSAGE =
  "Authentication is still loading. Please wait a moment.";

export function useAuthFlow(mode: AuthMode) {
  const router = useRouter();
  const { loaded: isClerkLoaded, setActive } = useClerk();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const signInState = useSignIn();
  const signUpState = useSignUp();
  const { startSSOFlow } = useSSO();
  const verifyWithSignInRef = useRef(false);
  const signInVerifyStepRef = useRef<"first_factor" | "mfa">("first_factor");

  const signIn = signInState.signIn;
  const signUp = signUpState.signUp;
  const signInErrors = signInState.errors;
  const signUpErrors = signUpState.errors;
  const signInStatus = signInState.fetchStatus;
  const signUpStatus = signUpState.fetchStatus;

  const isSignInResourceLoaded = isHookResourceLoaded(signInState, "signIn");
  const isSignUpResourceLoaded = isHookResourceLoaded(signUpState, "signUp");
  const isResourcesLoaded =
    isClerkLoaded &&
    (mode === "sign-in" ? isSignInResourceLoaded : isSignUpResourceLoaded);

  const isLoading = signInStatus === "fetching" || signUpStatus === "fetching";

  useEffect(() => {
    if (isAuthLoaded && isSignedIn) {
      router.replace("/" as Href);
    }
  }, [isAuthLoaded, isSignedIn, router]);

  const assertResourcesReady = useCallback(
    (needsSignIn: boolean, needsSignUp: boolean): ResourceGuardResult => {
      if (!isClerkLoaded) {
        return { ok: false, message: RESOURCES_LOADING_MESSAGE };
      }

      if (needsSignIn && !signIn) {
        return { ok: false, message: RESOURCES_LOADING_MESSAGE };
      }

      if (needsSignUp && !signUp) {
        return { ok: false, message: RESOURCES_LOADING_MESSAGE };
      }

      return { ok: true };
    },
    [isClerkLoaded, signIn, signUp],
  );

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
          const guard = assertResourcesReady(true, false);
          if (!guard.ok) {
            return { ok: false as const, emailError: guard.message };
          }

          verifyWithSignInRef.current = true;
          signInVerifyStepRef.current = "first_factor";
          const { error } = await signIn!.emailCode.sendCode({ emailAddress: email });
          if (error) {
            return {
              ok: false as const,
              emailError: error.message ?? "Could not send verification code",
            };
          }

          return { ok: true as const };
        }

        const signUpGuard = assertResourcesReady(false, true);
        if (!signUpGuard.ok) {
          return { ok: false as const, emailError: signUpGuard.message };
        }

        const { error: passwordError } = await signUp!.password({
          emailAddress: email,
          password: password ?? "",
        });

        if (passwordError) {
          const message = getReturnedErrorMessage(
            passwordError,
            "Could not create account",
          );
          return {
            ok: false as const,
            emailError: message,
            passwordError: message,
          };
        }

        if (signUp!.isTransferable) {
          const signInGuard = assertResourcesReady(true, false);
          if (!signInGuard.ok) {
            return { ok: false as const, emailError: signInGuard.message };
          }

          await signUp!.reset();
          verifyWithSignInRef.current = true;
          signInVerifyStepRef.current = "first_factor";
          const { error: sendError } = await signIn!.emailCode.sendCode({
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
          signUp!.status === "missing_requirements" &&
          signUp!.unverifiedFields.includes("email_address");

        if (needsEmailVerification) {
          const { error: sendError } = await signUp!.verifications.sendEmailCode();
          if (sendError) {
            return {
              ok: false as const,
              emailError: sendError.message ?? "Could not send verification code",
            };
          }
        }

        if (signUp!.status === "complete" && signUp!.createdSessionId) {
          await activateSession(signUp!.createdSessionId);
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
      assertResourcesReady,
      mode,
      signIn,
      signUp,
    ],
  );

  const verifyEmailCode = useCallback(
    async (code: string) => {
      const needsSignIn = mode === "sign-in" || verifyWithSignInRef.current;
      const needsSignUp = mode === "sign-up" && !verifyWithSignInRef.current;

      try {
        const guard = assertResourcesReady(needsSignIn, needsSignUp);
        if (!guard.ok) {
          return { ok: false as const, codeError: guard.message };
        }

        if (needsSignIn) {
          if (signInVerifyStepRef.current === "mfa") {
            const { error: mfaError } = await signIn!.mfa.verifyEmailCode({ code });
            if (mfaError) {
              return {
                ok: false as const,
                codeError: getReturnedErrorMessage(
                  mfaError,
                  "Invalid verification code",
                ),
              };
            }
          } else {
            const { error } = await signIn!.emailCode.verifyCode({ code });
            if (error) {
              return {
                ok: false as const,
                codeError: getReturnedErrorMessage(
                  error,
                  getClerkFieldMessage(signInErrors.fields.code) ||
                    "Invalid verification code",
                ),
              };
            }

            const needsMfa =
              signIn!.status === "needs_client_trust" ||
              signIn!.status === "needs_second_factor";
            const emailCodeFactor = signIn!.supportedSecondFactors?.find(
              (factor) => factor.strategy === "email_code",
            );

            if (needsMfa && emailCodeFactor) {
              const { error: sendMfaError } = await signIn!.mfa.sendEmailCode();
              if (sendMfaError) {
                return {
                  ok: false as const,
                  codeError: getReturnedErrorMessage(
                    sendMfaError,
                    "Could not send verification code",
                  ),
                };
              }

              signInVerifyStepRef.current = "mfa";
              return {
                ok: false as const,
                codeError:
                  "Enter the new verification code sent to your email to finish signing in.",
              };
            }
          }

          if (signIn!.status === "complete") {
            const activated = await activateSession(signIn!.createdSessionId);
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

        const { error } = await signUp!.verifications.verifyEmailCode({ code });
        if (error) {
          return {
            ok: false as const,
            codeError: getReturnedErrorMessage(
              error,
              getClerkFieldMessage(signUpErrors.fields.code) ||
                "Invalid verification code",
            ),
          };
        }

        if (signUp!.status === "complete") {
          const activated = await activateSession(signUp!.createdSessionId);
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
      assertResourcesReady,
      mode,
      signIn,
      signInErrors.fields.code,
      signUp,
      signUpErrors.fields.code,
    ],
  );

  const signInWithSocial = useCallback(
    async (provider: OAuthProvider) => {
      const guard = assertResourcesReady(true, false);
      if (!guard.ok) {
        console.error("Social sign-in blocked:", guard.message);
        return;
      }

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
    [assertResourcesReady, router, startSSOFlow],
  );

  return {
    isLoading,
    isAuthLoaded,
    isResourcesLoaded,
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
