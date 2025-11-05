import { sessions } from "@/utils/sessions";
import { useUser } from "@clerk/clerk-expo";
import { useConversation } from "@elevenlabs/react-native";
import { useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";
import { Gradient } from "../gradient";
export default function SessionScreen() {
    const { user } = useUser();
    console.log ('user info:', user);
    const { sessionId } = useLocalSearchParams()
    const session = sessions.find(s => s.id.toString() === sessionId) ?? sessions[0];

    const conversation = useConversation({
            onConnect: () => {console.log('Connected to conversation')},
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
                    "user_name": user?.firstName ?? "Daro",
                    "session_tittle": session.title,
                    "session_description": session.description,
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
        <>
            <Gradient position="top"
                isSpeaking={ 
conversation.status === 'connected' || conversation.status === 'connecting'
                } />
            

            <View style={{flex:1, justifyContent:'center', alignItems:'center', padding:16, gap:20}}>
                
            <Text>Session Screen</Text>
                <Text style={{ fontSize: 32, fontWeight:'bold' }}>{session.title}</Text>
                <Text style={{fontSize:16, fontWeight: '500', opacity:0.5}}>{session.title}</Text>
            <Button title="Start Conversation" onPress={startConversation} color={'blue'} />
                <Button title="End Conversation" onPress={endConversation} color={'red'} />
                
           
            </View>
            
        </>
        
    );
}

