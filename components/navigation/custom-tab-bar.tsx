import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  TAB_ACTIVE_CIRCLE_COLOR,
  TAB_ICON_SIZE,
  TAB_INACTIVE_COLOR,
  TAB_INDICATOR_SIZE,
  TAB_ITEMS,
  TAB_LABEL_SIZE,
} from "@/constants/tabs";

const SPRING_CONFIG = {
  damping: 18,
  stiffness: 220,
  mass: 0.6,
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const indicatorX = useSharedValue(0);
  const tabWidth = useSharedValue(0);

  const visibleRoutes = state.routes.filter((route) =>
    TAB_ITEMS.some((tab) => tab.route === route.name),
  );
  const tabCount = Math.max(visibleRoutes.length, 1);
  const visibleActiveIndex = visibleRoutes.findIndex(
    (route) => route.key === state.routes[state.index]?.key,
  );
  const activeIndex = visibleActiveIndex >= 0 ? visibleActiveIndex : 0;

  useEffect(() => {
    if (tabWidth.value <= 0) return;

    const offset =
      activeIndex * tabWidth.value + (tabWidth.value - TAB_INDICATOR_SIZE) / 2;
    indicatorX.value = withSpring(offset, SPRING_CONFIG);
  }, [activeIndex, indicatorX, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const handleTabPress = (
    routeKey: string,
    routeName: string,
    isFocused: boolean,
  ) => {
    const event = navigation.emit({
      type: "tabPress",
      target: routeKey,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      if (process.env.EXPO_OS === "ios") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      navigation.navigate(routeName);
    }
  };

  return (
    <View
      className="border-t border-border bg-white"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      onLayout={(event) => {
        const width = event.nativeEvent.layout.width;
        const nextTabWidth = width / tabCount;
        tabWidth.value = nextTabWidth;

        const offset =
          activeIndex * nextTabWidth + (nextTabWidth - TAB_INDICATOR_SIZE) / 2;
        indicatorX.value = withSpring(offset, SPRING_CONFIG);
      }}
    >
      <View className="relative h-[68px] flex-row">
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            { width: TAB_INDICATOR_SIZE, height: TAB_INDICATOR_SIZE },
            indicatorStyle,
          ]}
        />

        {state.routes.map((route, index) => {
          const tab = TAB_ITEMS.find((item) => item.route === route.name);
          if (!tab) return null;

          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label = options.title ?? tab.label;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={label}
              onPress={() => handleTabPress(route.key, route.name, isFocused)}
              style={({ pressed }) => [
                styles.tab,
                pressed && !isFocused ? styles.tabPressed : null,
              ]}
            >
              {isFocused ? (
                <View style={styles.activeSlot}>
                  <Ionicons
                    name={tab.activeIcon}
                    size={TAB_ICON_SIZE}
                    color="#FFFFFF"
                  />
                </View>
              ) : (
                <View style={styles.inactiveSlot}>
                  <Ionicons
                    name={tab.icon}
                    size={TAB_ICON_SIZE}
                    color={TAB_INACTIVE_COLOR}
                  />
                  <Text
                    style={[styles.label, { color: TAB_INACTIVE_COLOR }]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    top: 8,
    left: 0,
    borderRadius: TAB_INDICATOR_SIZE / 2,
    backgroundColor: TAB_ACTIVE_CIRCLE_COLOR,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPressed: {
    opacity: 0.7,
  },
  activeSlot: {
    width: TAB_INDICATOR_SIZE,
    height: TAB_INDICATOR_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveSlot: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 6,
  },
  label: {
    fontFamily: "Poppins-Medium",
    fontSize: TAB_LABEL_SIZE,
    lineHeight: 14,
  },
});
