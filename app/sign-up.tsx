import { AuthScreen } from "@/components/auth/auth-screen";

export default function SignUpScreen() {
  return (
    <AuthScreen
      mode="sign-up"
      title="Create your account"
      subtitle="Start your language journey today ✨"
      primaryButtonLabel="Sign Up"
      showPasswordField
      footerText="Already have an account?"
      footerLinkText="Log in"
      footerLinkHref="/sign-in"
    />
  );
}
