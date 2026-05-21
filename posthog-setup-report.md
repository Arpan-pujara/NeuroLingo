<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into NeuroLingo. The following changes were made:

- **`app.config.js`** — Created to expose `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables to the app via `expo-constants`.
- **`lib/posthog.ts`** — Created the PostHog client singleton, configured with lifecycle event capture, batching, and feature flag preloading.
- **`app/_layout.tsx`** — Wrapped the app in `PostHogProvider` with autocapture enabled, and added a `ScreenTracker` component that manually fires `posthog.screen()` on every route change via Expo Router's `usePathname`.
- **`app/onboarding.tsx`** — Captures `onboarding_get_started_clicked` when the user taps Get Started.
- **`hooks/use-auth-flow.ts`** — Captures `sign_up_completed` or `sign_in_completed` (with email-based user identification via `posthog.identify`) on successful email auth, and `social_auth_completed` on successful OAuth.
- **`app/choose-language.tsx`** — Captures `language_selected` with `language_id` and `is_first_selection` properties when the user confirms their chosen language.
- **`app/(tabs)/index.tsx`** — Captures `continue_learning_pressed` with `language_id` when the user taps Continue on the home screen.
- **`app/(tabs)/profile.tsx`** — Captures `sign_out_completed` and calls `posthog.reset()` before signing the user out.

## Events

| Event | Description | File |
|---|---|---|
| `onboarding_get_started_clicked` | User taps Get Started on the onboarding screen — top of the acquisition funnel | `app/onboarding.tsx` |
| `sign_up_completed` | User successfully completes email sign-up (session activated) | `hooks/use-auth-flow.ts` |
| `sign_in_completed` | User successfully completes email sign-in (session activated) | `hooks/use-auth-flow.ts` |
| `social_auth_completed` | User successfully signs in or signs up via a social OAuth provider | `hooks/use-auth-flow.ts` |
| `language_selected` | User confirms their chosen learning language — key onboarding conversion step | `app/choose-language.tsx` |
| `continue_learning_pressed` | User taps Continue on the home screen to resume their current language course | `app/(tabs)/index.tsx` |
| `sign_out_completed` | User signs out of the app | `app/(tabs)/profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1612902)
- [Onboarding conversion funnel](/insights/BAu75x2C) — Drop-off between Get Started tap and sign-up completion
- [Language selection rate](/insights/e0o8Dcrf) — Daily unique users completing the key onboarding step
- [Daily active learners](/insights/ELF9gOhM) — Unique users pressing Continue Learning per day
- [Sign-out (churn signal)](/insights/EfyLO1wn) — Users signing out per day
- [Full acquisition funnel](/insights/wpIgMinc) — End-to-end funnel: onboarding → sign-up → language selected → learning started

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
