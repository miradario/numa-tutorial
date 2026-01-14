/** @format */

import { sessions } from "@/utils/sessions";
import { PropsWithChildren } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
} from "react-native-reanimated";
import Button from "./Button";

export default function ParallaxScrollView({ children }: PropsWithChildren) {
  const todaySession = sessions[Math.floor(Math.random() * sessions.length)];
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={todaySession.image}
          style={{ width: "100%", height: 400 }}
        />

        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={{ flex: 2 }}></View>
            <Text style={styles.subtitle}>Featured Session</Text>
            <Text style={styles.title}>{todaySession.title}</Text>
            <Text style={styles.description}>{todaySession.description}</Text>

            <Button>Start Session</Button>
            <View style={{ flex: 1 }}></View>
          </View>
        </View>
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    width: "100%",
    height: 400,
    experimental_backgroundImage:
      "linear-gradient(to bottom,rgba(0,0,0,0), rgba(0,0,0,1))",
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    color: "white",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    color: "white",
  },
  description: {
    fontSize: 16,
    marginTop: 8,
    color: "white",
    marginBottom: 16,
  },
});
