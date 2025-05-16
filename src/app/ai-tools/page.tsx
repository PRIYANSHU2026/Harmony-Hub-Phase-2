"use client";

import { useState } from "react";
import Link from "next/link";

export default function AITools() {
  const [textInput, setTextInput] = useState("");
  const [speechInput, setSpeechInput] = useState("");
  const [textResponse, setTextResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState({ text: false, speech: false });

  // Function to call the text generation API
  const generateText = async () => {
    if (!textInput.trim()) return;

    setLoading((prev) => ({ ...prev, text: true }));
    try {
      const response = await fetch("/api/ai/text-generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: textInput }),
      });

      const data = await response.json();
      if (response.ok) {
        setTextResponse(data.text);
      } else {
        setTextResponse(`Error: ${data.error || "Failed to generate text"}`);
      }
    } catch (error) {
      console.error("Error generating text:", error);
      setTextResponse("Error: Failed to connect to the text generation service");
    } finally {
      setLoading((prev) => ({ ...prev, text: false }));
    }
  };

  // Function to call the text-to-speech API
  const generateSpeech = async () => {
    if (!speechInput.trim()) return;

    setLoading((prev) => ({ ...prev, speech: true }));
    try {
      const response = await fetch("/api/ai/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: speechInput }),
      });

      const data = await response.json();
      if (response.ok) {
        // In a real implementation, we would set the audio URL
        // For now, we'll just show the mock response
        setAudioUrl("mock-audio-url");
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setLoading((prev) => ({ ...prev, speech: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">AI Tools</h1>
        <p className="text-gray-600">
          Interact with our advanced AI models for text generation and speech synthesis
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Text Generation Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Text Generation (Shuka-1)</h2>
          <div className="mb-4">
            <label htmlFor="text-prompt" className="mb-1 block text-sm font-medium">
              Enter a prompt
            </label>
            <textarea
              id="text-prompt"
              rows={4}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Enter your prompt here..."
            />
          </div>
          <div className="mb-4">
            <button
              onClick={generateText}
              disabled={loading.text || !textInput.trim()}
              className="w-full rounded-md bg-primary py-2 text-white hover:bg-primary/90 disabled:bg-gray-400"
            >
              {loading.text ? "Generating..." : "Generate Text"}
            </button>
          </div>
          {textResponse && (
            <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Response:</h3>
              <p className="whitespace-pre-wrap text-gray-800">{textResponse}</p>
            </div>
          )}
        </div>

        {/* Text-to-Speech Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Text-to-Speech (Dia-1.6B)</h2>
          <div className="mb-4">
            <label htmlFor="speech-text" className="mb-1 block text-sm font-medium">
              Enter text to convert to speech
            </label>
            <textarea
              id="speech-text"
              rows={4}
              value={speechInput}
              onChange={(e) => setSpeechInput(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Enter text to convert to speech..."
            />
          </div>
          <div className="mb-4">
            <button
              onClick={generateSpeech}
              disabled={loading.speech || !speechInput.trim()}
              className="w-full rounded-md bg-primary py-2 text-white hover:bg-primary/90 disabled:bg-gray-400"
            >
              {loading.speech ? "Generating..." : "Generate Speech"}
            </button>
          </div>
          {audioUrl && (
            <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Audio:</h3>
              <p className="mb-2 text-sm text-gray-500">
                In a real implementation, an audio player would appear here.
                This is a mock implementation since we can't run the actual model in this environment.
              </p>
              <div className="flex justify-center">
                <button className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                  Play Mock Audio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">Music AI Integration</h2>
        <p className="mb-4 text-gray-600">
          Our system integrates with a Python-based Streamlit application that provides AI-generated
          music exercises using MIDI-GPT. This integration allows for:
        </p>
        <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600">
          <li>Generating complex music exercises with proper notation</li>
          <li>Creating educational content based on music theory concepts</li>
          <li>Exporting exercises as both MusicXML and MIDI formats</li>
          <li>Visualizing musical scores with proper sheet music notation</li>
        </ul>

        <div className="flex justify-center">
          <Link
            href="/exercise-generator"
            className="rounded-md bg-primary px-6 py-3 text-white hover:bg-primary/90"
          >
            Try Music Exercise Generator
          </Link>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="rounded-md border border-primary bg-white px-6 py-3 text-primary hover:bg-primary/10"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
