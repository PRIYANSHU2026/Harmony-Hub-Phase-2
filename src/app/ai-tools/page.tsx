"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { setHuggingFaceToken, getHuggingFaceToken, recordUserMidi, analyzeMidiPerformance } from "~/utils/midi-gpt-integration";

export default function AITools() {
  const [apiToken, setApiToken] = useState("");
  const [tokenSaved, setTokenSaved] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordedMidi, setRecordedMidi] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(10);
  const [loading, setLoading] = useState({ token: false, recording: false, analysis: false });

  // Load existing token if available
  useEffect(() => {
    const token = getHuggingFaceToken();
    if (token) {
      setApiToken(token);
      setTokenSaved(true);
    }
  }, []);

  // Function to save Hugging Face API token
  const saveApiToken = async () => {
    if (!apiToken.trim()) return;

    setLoading((prev) => ({ ...prev, token: true }));
    try {
      const result = setHuggingFaceToken(apiToken);
      if (result.success) {
        setTokenSaved(true);
      }
    } catch (error) {
      console.error("Error saving API token:", error);
    } finally {
      setLoading((prev) => ({ ...prev, token: false }));
    }
  };

  // Function to start MIDI recording
  const startRecording = async () => {
    setLoading((prev) => ({ ...prev, recording: true }));
    setRecording(true);
    setRecordedMidi(null);
    setAnalysisResults(null);

    try {
      const duration = recordingDuration * 1000; // Convert to milliseconds
      const midiData = await recordUserMidi(duration);
      setRecordedMidi(midiData);
    } catch (error) {
      console.error("Error recording MIDI:", error);
    } finally {
      setLoading((prev) => ({ ...prev, recording: false }));
      setRecording(false);
    }
  };

  // Function to analyze recorded MIDI
  const analyzeMidi = async () => {
    if (!recordedMidi) return;

    setLoading((prev) => ({ ...prev, analysis: true }));
    try {
      const results = await analyzeMidiPerformance(recordedMidi);
      setAnalysisResults(results);
    } catch (error) {
      console.error("Error analyzing MIDI:", error);
    } finally {
      setLoading((prev) => ({ ...prev, analysis: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">AI Tools</h1>
        <p className="text-gray-600">
          Interact with our advanced AI models for music generation, analysis, and improvement
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Hugging Face API Token Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Hugging Face API Token</h2>
          <p className="mb-4 text-sm text-gray-600">
            To use our Mistral 7B-powered features, you need to provide your Hugging Face API token.
            You can get one for free at <a href="https://huggingface.co/settings/tokens" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">huggingface.co</a>
          </p>
          <div className="mb-4">
            <label htmlFor="api-token" className="mb-1 block text-sm font-medium">
              API Token
            </label>
            <input
              id="api-token"
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
              placeholder="Enter your Hugging Face API token"
            />
          </div>
          <div className="mb-4">
            <button
              onClick={saveApiToken}
              disabled={loading.token || !apiToken.trim()}
              className="w-full rounded-md bg-primary py-2 text-white hover:bg-primary/90 disabled:bg-gray-400"
            >
              {loading.token ? "Saving..." : "Save Token"}
            </button>
          </div>
          {tokenSaved && (
            <div className="mt-2 rounded-md bg-green-50 p-2 text-center text-sm text-green-700">
              API token saved successfully!
            </div>
          )}
        </div>

        {/* MIDI Recording Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">MIDI Recording & Analysis</h2>
          <p className="mb-4 text-sm text-gray-600">
            Record your MIDI performance and get AI-powered analysis and suggestions for improvement.
          </p>

          <div className="mb-4">
            <label htmlFor="duration" className="mb-1 block text-sm font-medium">
              Recording Duration (seconds)
            </label>
            <input
              id="duration"
              type="number"
              min="5"
              max="60"
              value={recordingDuration}
              onChange={(e) => setRecordingDuration(parseInt(e.target.value) || 10)}
              className="w-full rounded-md border border-gray-300 p-2"
            />
          </div>

          <div className="mb-4">
            <button
              onClick={startRecording}
              disabled={loading.recording}
              className="w-full rounded-md bg-red-600 py-2 text-white hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading.recording ? `Recording... (${recordingDuration}s)` : "Start Recording"}
            </button>
          </div>

          {recordedMidi && (
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between rounded-md bg-green-50 p-2">
                <span className="text-sm text-green-700">Recording completed!</span>
                <button
                  onClick={analyzeMidi}
                  disabled={loading.analysis}
                  className="rounded-md bg-primary px-3 py-1 text-sm text-white hover:bg-primary/90"
                >
                  {loading.analysis ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            </div>
          )}

          {analysisResults && (
            <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700">Analysis Results:</h3>

              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="rounded-md bg-white p-2 text-center">
                  <div className="text-xl font-semibold">{analysisResults.accuracy.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Overall Accuracy</div>
                </div>
                <div className="rounded-md bg-white p-2 text-center">
                  <div className="text-xl font-semibold">{analysisResults.tempo.toFixed(1)} BPM</div>
                  <div className="text-xs text-gray-500">Tempo</div>
                </div>
                <div className="rounded-md bg-white p-2 text-center">
                  <div className="text-xl font-semibold">{analysisResults.rhythmAccuracy.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Rhythm</div>
                </div>
                <div className="rounded-md bg-white p-2 text-center">
                  <div className="text-xl font-semibold">{analysisResults.pitchAccuracy.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Pitch</div>
                </div>
              </div>

              <h4 className="mb-1 text-xs font-medium uppercase text-gray-500">Improvement Suggestions:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
                {analysisResults.suggestions.map((suggestion: string, index: number) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 mb-8 rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">Mistral 7B Music AI Integration</h2>
        <p className="mb-4 text-gray-600">
          Our system now integrates with the powerful Mistral 7B AI model to provide enhanced music generation and analysis capabilities:
        </p>
        <ul className="mb-6 list-inside list-disc space-y-2 text-gray-600">
          <li>Generating complex music exercises with proper notation</li>
          <li>Understanding and analyzing your MIDI performances</li>
          <li>Providing personalized suggestions for improvement</li>
          <li>Creating educational content based on your skill level</li>
          <li>Exporting exercises as both MusicXML and MIDI formats</li>
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
