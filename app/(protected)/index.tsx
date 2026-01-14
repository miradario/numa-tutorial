/** @format */

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { sessions } from "@/utils/sessions";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <ParallaxScrollView>
      <Text style={styles.title}>Choose your session</Text>
      <ScrollView
        contentContainerStyle={{ paddingLeft: 16, gap: 12 }}
        contentInsetAdjustmentBehavior="automatic"
        style={{ padding: 16 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {sessions.map((session) => (
          <Pressable
            key={session.id}
            onPress={() => {
              router.push({
                pathname: "/session",
                params: { sessionId: session.id.toString() },
              });
            }}
            style={styles.sessionContainer}
          >
            <Image
              source={session.image}
              style={styles.sessionImage}
              resizeMode="cover"
            />
            <Text style={styles.sessionTitle}>{session.title}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.title}>Recent</Text>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 27,
    fontWeight: "bold",
    padding: 12,
    color: "black",
  },
  sessionContainer: {
    marginBottom: 20,
    padding: 10,
    marginVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  sessionImage: {
    width: 250,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
  },
  sessionTitle: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
});
