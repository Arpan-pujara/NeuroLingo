import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { AI_LESSON_ROOM_URI, AI_TEACHER_AVATAR_URI, images } from "@/constants/images";

import { TeacherSpeechBubble } from "./teacher-speech-bubble";

type TeacherStageProps = {
  bubblePrimary: string;
  bubbleSecondary: string;
  showSubtitles: boolean;
};

/** Space for call buttons + labels below the message bubble. */
export const CALL_CONTROLS_OVERLAY_HEIGHT = 108;

const MASCOT_WIDTH = 320;
const MASCOT_FRAME_HEIGHT = 340;

export function TeacherStage({
  bubblePrimary,
  bubbleSecondary,
  showSubtitles,
}: TeacherStageProps) {
  return (
    <View style={styles.stage}>
      <Image
        source={{ uri: AI_LESSON_ROOM_URI }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="top"
        blurRadius={22}
      />
      <View style={styles.warmOverlay} />

      <View style={styles.teacherBlock}>
        <View style={styles.mascotFrame}>
          <Image
            source={images.mascotTeacher}
            style={styles.mascot}
            contentFit="contain"
            contentPosition="bottom"
          />
        </View>
        <View style={styles.bubbleWrap}>
          <TeacherSpeechBubble
            primary={bubblePrimary}
            secondary={bubbleSecondary}
            showSubtitles={showSubtitles}
          />
        </View>
      </View>

      <View style={styles.userPreview}>
        <Image
          source={{ uri: AI_TEACHER_AVATAR_URI }}
          style={styles.userPreviewImage}
          contentFit="cover"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#E8E4DF",
  },
  warmOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(235, 230, 224, 0.4)",
  },
  teacherBlock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: CALL_CONTROLS_OVERLAY_HEIGHT,
    alignItems: "center",
    zIndex: 1,
  },
  mascotFrame: {
    width: "100%",
    height: MASCOT_FRAME_HEIGHT,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  mascot: {
    width: MASCOT_WIDTH,
    height: MASCOT_FRAME_HEIGHT,
  },
  bubbleWrap: {
    alignSelf: "stretch",
    marginTop: 0,
    marginBottom: 6,
  },
  userPreview: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 72,
    height: 96,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    backgroundColor: "#F3F4F6",
    zIndex: 2,
  },
  userPreviewImage: {
    width: "100%",
    height: "100%",
  },
});
