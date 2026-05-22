// eslint-disable-next-line @typescript-eslint/no-require-imports
const baseConfig = require('./app.json')

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  ...baseConfig.expo,
  ios: {
    ...baseConfig.expo.ios,
    bundleIdentifier: 'com.anonymous.NeuroLingo',
  },
  web: {
    ...baseConfig.expo.web,
    output: 'server',
  },
  plugins: [
    ...(baseConfig.expo.plugins ?? []),
    '@stream-io/video-react-native-sdk',
    [
      '@config-plugins/react-native-webrtc',
      {
        cameraPermission:
          'NeuroLingo uses the camera only when video lessons are enabled.',
        microphonePermission:
          'NeuroLingo needs microphone access for live audio lessons with your AI tutor.',
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          minSdkVersion: 24,
        },
      },
    ],
  ],
  extra: {
    ...baseConfig.expo.extra,
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
    streamApiKey:
      process.env.EXPO_PUBLIC_STREAM_API_KEY ?? process.env.STREAM_API_KEY,
  },
}
