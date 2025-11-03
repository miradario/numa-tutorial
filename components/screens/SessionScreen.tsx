import { useConversation } from "@elevenlabs/react-native";
import { Button, Text, View } from "react-native";
export default function SessionScreen() {
    const conversation = useConversation({
            onConnect: () => console.log('Connected to conversation'),
            onDisconnect: () => console.log('Disconnected from conversation'),
            onMessage: (message) => console.log('Received message:', message),
            onError: (error) => console.error('Conversation error:', error),
            onModeChange: (mode) => console.log('Conversation mode changed:', mode),
            onStatusChange: (prop) => console.log('Conversation status changed:', prop.status),
            onCanSendFeedbackChange: (prop) =>
                console.log('Can send feedback changed:', prop.canSendFeedback),
            onUnhandledClientToolCall: (params) => console.log('Unhandled client tool call:', params),
    });

    const startConversation = async () => {
        try {

            await conversation.startSession({
                agentId: process.env.EXPO_PUBLIC_AGENT_ID,
                dynamicVariables: {
                    "user_name": "Daro",
                    "session_title": "Test Session",
                    "session_description": "This is a test session",
                },
            });
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    }

    const endConversation = async () => {
        try {
            await conversation.endSession();
        } catch (error) {
            console.error('Error ending conversation:', error);
        }
    }


    return (
        <View
            
        >
            <Text>Session Screen</Text>
            <Button title="Start Conversation" onPress={startConversation} />
            <Button title="End Conversation" onPress={endConversation} color={'red'} />
        </View>
    );
}

