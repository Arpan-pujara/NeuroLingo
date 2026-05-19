/**
 * Lingua design system — typography scale (Poppins).
 * @see prompt_material/01-design-system.png
 */
export const typography = {
  h1: {
    fontSize: 32,
    lineHeight: 1.2,
    fontFamily: "bold" as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 1.3,
    fontFamily: "semibold" as const,
  },
  h3: {
    fontSize: 20,
    lineHeight: 1.3,
    fontFamily: "semibold" as const,
  },
  h4: {
    fontSize: 16,
    lineHeight: 1.4,
    fontFamily: "medium" as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 1.6,
    fontFamily: "regular" as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: "regular" as const,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 1.6,
    fontFamily: "regular" as const,
  },
  caption: {
    fontSize: 11,
    lineHeight: 1.4,
    fontFamily: "regular" as const,
  },
} as const;

export type Typography = typeof typography;
