import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

// Define the types for our request payload
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface MistralChatRequest {
  messages: Message[];
  apiToken?: string;
}

// Define the response structure
interface MistralChatResponse {
  response: string;
  error?: string;
}

// Default system prompt specialized for trumpet
const DEFAULT_SYSTEM_PROMPT = `You are a trumpet practice assistant and expert musician specializing in trumpet technique, practice methods, and music theory related to trumpet performance.
Your role is to provide helpful, encouraging, and accurate advice to trumpet players of all levels.
Focus on trumpet-specific techniques, sound production, breathing methods, and practice routines.
When discussing music, preference should be given to trumpet-focused repertoire and techniques.
For beginners, emphasize proper embouchure, breathing, and basic technique.
For intermediate players, focus on tone development, range extension, and more complex articulations.
For advanced players, provide insights on interpretation, advanced techniques, and performance preparation.
Always be encouraging and positive, but also honest and constructive with your feedback.`;

export async function POST(req: Request) {
  try {
    const { messages, apiToken } = await req.json() as MistralChatRequest;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Valid messages are required" },
        { status: 400 }
      );
    }

    // Use user-provided token or fallback to environment variable
    const hfToken = apiToken || process.env.HUGGINGFACE_API_TOKEN;

    // Prepare the messages for the Mistral model
    // Add system prompt if it doesn't exist
    const hasSystemMessage = messages.some(msg => msg.role === "system");
    const formattedMessages = hasSystemMessage
      ? messages
      : [{ role: "system", content: DEFAULT_SYSTEM_PROMPT }, ...messages];

    if (!hfToken) {
      // If no token, provide a fallback response that's trumpet-specific
      const userMessage = messages[messages.length - 1].content.toLowerCase();

      let fallbackResponse = "I'd love to help with your trumpet practice, but I need a Hugging Face API token to access my full capabilities. Please add your token in the AI Tools page.";

      // Simple fallback logic for common trumpet questions
      if (userMessage.includes("embouchure")) {
        fallbackResponse = "Embouchure is the way you shape your lips to play the trumpet. A good embouchure involves firm corners with the lips centered and relaxed in the middle. Practice in front of a mirror to maintain proper form.";
      } else if (userMessage.includes("breathing") || userMessage.includes("breath control")) {
        fallbackResponse = "Breath control is essential for trumpet playing. Practice deep diaphragmatic breathing - fill your lungs from the bottom up, like filling a glass with water. Regular breathing exercises will significantly improve your tone and endurance.";
      } else if (userMessage.includes("high notes") || userMessage.includes("range")) {
        fallbackResponse = "To improve your high range on trumpet, work on lip slurs daily, gradually extending your range. Keep a relaxed throat, use good air support, and avoid excessive pressure. Be patient - range develops over time with consistent practice.";
      } else if (userMessage.includes("tonguing") || userMessage.includes("articulation")) {
        fallbackResponse = "For clean articulation on trumpet, practice with a metronome using different tonguing patterns (single, double, and triple tonguing). Start slowly and gradually increase speed while maintaining clarity. The tongue should strike as if saying 'tu' or 'du' rather than 'th'.";
      }

      return NextResponse.json({ response: fallbackResponse });
    }

    // Initialize Hugging Face inference
    const hf = new HfInference(hfToken);

    try {
      // Call the Mistral model via Hugging Face inference API
      const response = await hf.chatCompletion({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: formattedMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        top_k: 50,
        top_p: 0.95,
        max_tokens: 1024
      });

      return NextResponse.json({
        response: response.content || "I'm sorry, I couldn't generate a response at this time."
      });
    } catch (modelError) {
      console.error("Error calling Mistral model:", modelError);

      // Provide a helpful fallback response
      return NextResponse.json({
        response: "I apologize, but I'm having trouble connecting to my knowledge base right now. For trumpet practice, I recommend focusing on fundamentals: long tones for sound quality, lip slurs for flexibility, and scale patterns for technique. Please try asking me again later for more specific guidance."
      });
    }
  } catch (error) {
    console.error("Error in Mistral chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat with Mistral" },
      { status: 500 }
    );
  }
}
