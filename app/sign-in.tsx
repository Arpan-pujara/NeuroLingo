import { AuthScreen } from "@/components/auth/auth-screen";

export default function SignInScreen() {
  return (
    <AuthScreen
      mode="sign-in"
      title="Welcome back"
      subtitle="Sign in to continue your language journey ✨"
      primaryButtonLabel="Sign In"
      footerText="Don't have an account?"
      footerLinkText="Sign up"
      footerLinkHref="/sign-up"
    />
  );
}
