import { isClerkAPIResponseError } from "@clerk/expo";

export function getClerkErrorMessage(error: unknown, fallback: string): string {
  if (isClerkAPIResponseError(error)) {
    const first = error.errors[0];
    return first?.longMessage ?? first?.message ?? fallback;
  }

  if (error instanceof SyntaxError) {
    return "Authentication response was invalid. Please try again.";
  }

  if (error instanceof Error) {
    const message = error.message;
    if (message.includes("JSON Parse error") || message.includes("Unexpected character")) {
      return "Could not complete verification. Please try again.";
    }
    return message;
  }

  return fallback;
}
