import Constants from "expo-constants";

const streamApiKey =
  process.env.EXPO_PUBLIC_STREAM_API_KEY ??
  (Constants.expoConfig?.extra?.streamApiKey as string | undefined) ??
  process.env.STREAM_API_KEY;

if (!streamApiKey) {
  throw new Error(
    "Add EXPO_PUBLIC_STREAM_API_KEY (or STREAM_API_KEY) to your .env file.",
  );
}

/** Stream API keys are short; secrets are long hex strings — never use the secret here. */
if (streamApiKey.length > 24) {
  throw new Error(
    "EXPO_PUBLIC_STREAM_API_KEY looks like a Stream secret key. Use the API Key from the Stream dashboard (short value), not STREAM_SECRET_KEY.",
  );
}

export const streamPublicApiKey = streamApiKey;
