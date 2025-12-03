/** @format */

import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import { Gradient } from "../gradient";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function SummaryScreen() {
    const { conversationId } = useLocalSearchParams();
    const [conversation, setConversation] = useState<ConversationResponse | null>(null);
    return <>
        <Gradient position="bottom" isSpeaking={false} />
        <ScrollView 
            contentInsetAdjustmentBehavior={"automatic"}
            contentContainerStyle={{ paddingHorizontal: 16 }}
    </>;
}
