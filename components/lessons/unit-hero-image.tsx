import { Image } from "expo-image";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { images } from "@/constants/images";

const HERO_HEIGHT = 220;
/** Extra pixels rendered above/below, then clipped — zooms out while keeping full width. */
const ZOOM_OUT_CLIP = 48;

/**
 * Hero banner for the Learn screen.
 * Renders slightly taller than the visible area with `cover` + center crop so the
 * image fills edge-to-edge (no side gaps) but shows more of the scene than a tight crop.
 */
export function UnitHeroImage() {
  const { width } = useWindowDimensions();
  const renderHeight = HERO_HEIGHT + ZOOM_OUT_CLIP;
  const clipOffset = ZOOM_OUT_CLIP / 2;

  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={images.mascotHeroCafe}
        style={{
          position: "absolute",
          width,
          height: renderHeight,
          top: -clipOffset,
          left: 0,
        }}
        contentFit="cover"
        contentPosition="center"
        accessibilityLabel="Fox mascot at a café"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HERO_HEIGHT,
    overflow: "hidden",
    backgroundColor: "#E8F4FC",
  },
});
