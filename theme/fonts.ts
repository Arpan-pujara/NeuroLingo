/**
 * PostScript / fontFamily names used after loading Poppins via expo-font.
 * Names match the TTF filenames (required on React Native).
 */
export const fontFamily = {
  regular: "Poppins-Regular",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export const fontAssets = {
  [fontFamily.regular]: require("@/assets/fonts/Poppins-Regular.ttf"),
  [fontFamily.medium]: require("@/assets/fonts/Poppins-Medium.ttf"),
  [fontFamily.semibold]: require("@/assets/fonts/Poppins-SemiBold.ttf"),
  [fontFamily.bold]: require("@/assets/fonts/Poppins-Bold.ttf"),
} as const;

export type FontFamily = typeof fontFamily;
