/** @format */
import Button from "@/components/Button";
import { ConversationResponse } from "@/utils/type";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Gradient } from "../gradient";

export default function SummaryScreen() {
  const { conversationId } = useLocalSearchParams();
  const [conversation, setConversation] = useState<ConversationResponse | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (conversationId) {
      getSummary();
    }
  }, [conversationId]);

  const getSummary = async () => {
    const response = await fetch(
      `https://gurudev--cw3spafxsb.expo.app/api/conversations?conversationId=${conversationId}`
    );

    if (response) {
      const data: { conversation: ConversationResponse } =
        await response.json();

      setConversation(data.conversation);
      console.log("Fetched conversation data:", data.conversation);
    } else {
      console.error("Failed to fetch conversation data");
    }
  };

  return (
    <>
      <Gradient position="bottom" isSpeaking={false} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginTop: 32,
            marginBottom: 16,
          }}
        >
          Session Summary
        </Text>
        {conversationId ? (
          <View>
            <Text style={styles.subtitle}>
              {conversation?.metadata?.cost} tokens
            </Text>

            <Text style={styles.subtitle}>
              {new Date(
                conversation?.metadata.start_time_unix_secs! * 1000
              ).toLocaleString()}
            </Text>

            <Text style={styles.title}>Transcript</Text>

            <Text style={styles.subtitle}>
              {conversation?.transcript.map((t) => t.message).join("\n")}
            </Text>

            <View style={{ alignItems: "center" }}>
              <Button onPress={() => router.dismissAll()}>Go Back</Button>
            </View>
          </View>
        ) : (
          <Text>Loading summary...</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 16,
  },
});
