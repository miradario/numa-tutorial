/** @format */

import { sessions } from "@/utils/sessions";
import { useUser } from "@clerk/clerk-expo";
import { ElevenLabsProvider, useConversation } from "@elevenlabs/react-native";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import Button from "../Button";
import { Gradient } from "../gradient";

export default function SessionScreen() {
  return (
    <>
      <ElevenLabsProvider>
        <SessionScreenContent />
      </ElevenLabsProvider>
    </>
  );
}

function SessionScreenContent() {
  const { user } = useUser();

  // ✅ Client is stable - doesn't change

  const { sessionId } = useLocalSearchParams();
  const session =
    sessions.find((s) => s.id.toString() === sessionId) ?? sessions[0];

  const [isStarting, setIsStarting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to conversation");
    },
    onDisconnect: () => console.log("Disconnected from conversation"),
    onMessage: (message) => console.log("Received message:", message),
    onError: (error) => console.error("Conversation error:", error),
    onModeChange: (mode) => console.log("Conversation mode changed:", mode),
    onStatusChange: (prop) =>
      console.log("Conversation status changed:", prop.status),
    onCanSendFeedbackChange: (prop) =>
      console.log("Can send feedback changed:", prop.canSendFeedback),
    onUnhandledClientToolCall: (params) =>
      console.log("Unhandled client tool call:", params),
  });

  const isSpeaking = useMemo(
    () => conversation.status === "connected",
    [conversation.status]
  );

  const startConversation = async () => {
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        dynamicVariables: {
          user_name: user?.username || "Daro",
          session_tittle: session.title,
        },
      });
      console.log("Conversation started");
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Error ending conversation:", error);
    }
  };
  const status =
    conversation.status === "connected" || conversation.status === "connecting";
  console.log("Conversation status:", status);

  return (
    <>
      <Gradient position="top" isSpeaking={isSpeaking} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          gap: 20,
        }}
      >
        <Text>Session Screen</Text>
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>
          {session.title}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "500", opacity: 0.5 }}>
          {session.title}
        </Text>
        <Button onPress={startConversation}>Start Conversation</Button>
        <Button onPress={endConversation}>End Conversation</Button>
      </View>
    </>
  );
}
