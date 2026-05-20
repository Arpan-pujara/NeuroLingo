const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!key) {
  throw new Error(
    "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file. Get it from the Clerk Dashboard API keys page.",
  );
}

export const publishableKey: string = key;
