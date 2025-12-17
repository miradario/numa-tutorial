import { ConversationResponse } from "@/utils/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");

  // Validate conversation ID
  if (!conversationId) {
    return new Response("Conversation ID is required", { status: 400 });
  }

  // Validate API key
  if (!process.env.ELEVENLABS_API_KEY) {
    return new Response("ELEVENLABS_API_KEY is not set", { status: 500 });
  }

  try {
    const response = await fetch(
      `${process.env.ELEVENLABS_BASE_URL}/v1/convai/conversations/${conversationId}`,
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return new Response(
        `Error from ElevenLabs: ${response.statusText}`,
        { status: response.status }
      );
    }

    const conversation: ConversationResponse = await response.json();

    console.log("[SERVER] Conversation:", conversation);

    return new Response(JSON.stringify(conversation), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("[SERVER ERROR]", error);
    return new Response("Internal server error", { status: 500 });
  }
}