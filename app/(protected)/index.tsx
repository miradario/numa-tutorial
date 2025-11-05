import { sessions } from "@/utils/sessions";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ padding: 16 }}>
      {sessions.map((session) => (
        <Pressable key={session.id} onPress={() => {
          router.navigate({
            pathname: '/(protected)/session',
            params: { sessionId: session.id.toString() },
        }) }}
        style={{borderWidth:1,  marginBottom: 20, padding: 16, marginVertical:16, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
          <Text>{session.title}</Text>
        </Pressable>
      ))}
    </ScrollView>  
  );
}
