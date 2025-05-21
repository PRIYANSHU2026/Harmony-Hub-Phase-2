import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

interface ValidateTokenRequest {
  apiToken: string;
}

export async function POST(req: Request) {
  try {
    const { apiToken } = await req.json() as ValidateTokenRequest;

    if (!apiToken) {
      return NextResponse.json(
        { valid: false, message: "API token is required" },
        { status: 400 }
      );
    }

    // Initialize Hugging Face inference with the provided token
    const hf = new HfInference(apiToken);

    try {
      // Make a minimal test request to validate the token
      // Using a lightweight model call to check if the token is valid
      const response = await hf.chatCompletion({
        model: "mistralai/Mistral-7B-Instruct-v0.3",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: "Hello"
          }
        ],
        temperature: 0.7,
        max_tokens: 5 // Minimal tokens for quick validation
      });

      // If we get this far without an error, the token is valid
      return NextResponse.json({
        valid: true,
        message: "Hugging Face authentication successful! Mistral 7B is now connected."
      });
    } catch (modelError: any) {
      console.error("Error validating token with Mistral model:", modelError);

      // Check for specific error types
      if (modelError.message?.includes("Unauthorized") ||
          modelError.message?.includes("401") ||
          modelError.name === "UnauthorizedError") {
        return NextResponse.json({
          valid: false,
          message: "Invalid or unauthorized API token. Please check your Hugging Face token and try again."
        });
      }

      // Rate limit errors
      if (modelError.message?.includes("429") ||
          modelError.message?.includes("Rate limit") ||
          modelError.message?.includes("Too Many Requests")) {
        return NextResponse.json({
          valid: false,
          message: "Rate limit exceeded. Please try again in a few minutes."
        });
      }

      // For network errors
      if (modelError.message?.includes("network") ||
          modelError.message?.includes("timeout") ||
          modelError.message?.includes("ECONNREFUSED")) {
        return NextResponse.json({
          valid: false,
          message: "Network error connecting to Hugging Face API. Please check your internet connection."
        });
      }

      // Default error
      return NextResponse.json({
        valid: false,
        message: "Error connecting to Mistral 7B. Please try again later."
      });
    }
  } catch (error) {
    console.error("Error in validate token API:", error);
    return NextResponse.json(
      { valid: false, message: "Failed to process token validation" },
      { status: 500 }
    );
  }
}
