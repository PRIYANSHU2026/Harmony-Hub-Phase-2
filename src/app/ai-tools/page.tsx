"use client";

import { useState, useEffect } from "react";
import { getHuggingFaceToken, setHuggingFaceToken, validateHuggingFaceToken, isTokenValidated, markTokenValidated } from "~/utils/midi-gpt-integration";
import TrumpetChatbot from "~/components/trumpet-chatbot";
import TrumpetSoundPlayer from "~/components/trumpet-sound-player";
import AuthModal from "~/components/auth-modal";
import AdaptiveLearning from "~/components/adaptive-learning";

export default function AITools() {
  const [token, setToken] = useState<string>("");
  const [tokenStatus, setTokenStatus] = useState<"none" | "valid" | "invalid" | "validating">("none");
  const [selectedKey, setSelectedKey] = useState<string>("C");
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalType, setModalType] = useState<"success" | "error" | "info">("info");

  // Load token from localStorage on component mount
  useEffect(() => {
    const savedToken = getHuggingFaceToken();
    if (savedToken) {
      setToken(savedToken);

      // If token exists but hasn't been validated in this session
      if (!isTokenValidated()) {
        validateSavedToken(savedToken);
      } else {
        setTokenStatus("valid");
      }
    }
  }, []);

  // Validate a saved token silently in the background
  const validateSavedToken = async (savedToken: string) => {
    try {
      const result = await validateHuggingFaceToken(savedToken);
      if (result.valid) {
        setTokenStatus("valid");
      } else {
        // Don't show modal for silent validation of saved token
        setTokenStatus("invalid");
      }
    } catch (error) {
      console.error("Error validating saved token:", error);
      setTokenStatus("invalid");
    }
  };

  const handleSaveToken = async () => {
    if (!token.trim()) {
      setTokenStatus("invalid");
      showAuthModal("Please enter a valid token", "error");
      return;
    }

    setTokenStatus("validating");
    try {
      const result = await validateHuggingFaceToken(token.trim());

      if (result.valid) {
        setHuggingFaceToken(token.trim());
        setTokenStatus("valid");
        markTokenValidated(true);
        showAuthModal(result.message, "success");
      } else {
        setTokenStatus("invalid");
        showAuthModal(result.message, "error");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      setTokenStatus("invalid");
      showAuthModal("Error connecting to Hugging Face API", "error");
    }
  };

  // Show authentication modal with message
  const showAuthModal = (message: string, type: "success" | "error" | "info") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Trumpet Practice AI Tools</h1>
        <p className="text-gray-600">
          Advanced AI tools for trumpet practice with Mistral 7B integration
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* AI Settings Section */}
        <div className="lg:col-span-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">AI Settings</h2>

            <div className="mb-6">
              <label htmlFor="hf-token" className="mb-2 block text-sm font-medium">
                Hugging Face API Token
              </label>
              <div className="mb-2">
                <input
                  type="password"
                  id="hf-token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your Hugging Face API token"
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <button
                onClick={handleSaveToken}
                disabled={tokenStatus === "validating"}
                className="w-full rounded-md bg-primary py-2 text-white hover:bg-primary/90 disabled:bg-gray-400"
              >
                {tokenStatus === "validating" ? (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Validating...
                  </span>
                ) : (
                  "Save & Validate Token"
                )}
              </button>
              {tokenStatus === "valid" && (
                <p className="mt-2 text-sm text-green-600">
                  Token validated successfully. You can now use all Mistral 7B features.
                </p>
              )}
              {tokenStatus === "invalid" && (
                <p className="mt-2 text-sm text-red-600">
                  Please enter a valid token.
                </p>
              )}
              <p className="mt-4 text-xs text-gray-500">
                Your token is stored securely in your browser&apos;s local storage and is only used to
                access Hugging Face API services. Get your free token at{" "}
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  huggingface.co
                </a>
              </p>
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-lg font-medium">Trumpet Sound Library</h3>
              <p className="mb-4 text-sm text-gray-600">
                Practice with authentic trumpet sounds in different keys
              </p>

              <label htmlFor="key-selector" className="mb-2 block text-sm font-medium">
                Select Key
              </label>
              <select
                id="key-selector"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
                className="mb-4 w-full rounded-md border border-gray-300 p-2"
              >
                <option value="C">C Major</option>
                <option value="F">F Major</option>
                <option value="Bb">Bb Major</option>
                <option value="G">G Major</option>
                <option value="D">D Major</option>
                <option value="A">A Major/Minor</option>
                <option value="E">E Major/Minor</option>
              </select>

              <TrumpetSoundPlayer selectedKey={selectedKey} />
            </div>

            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full rounded-md border border-gray-300 bg-gray-50 py-2 text-gray-700 hover:bg-gray-100"
              >
                {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
              </button>

              {showAdvanced && (
                <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-2 text-lg font-medium">Advanced AI Options</h3>
                  <div className="mb-3">
                    <label className="mb-1 block text-sm font-medium">
                      Model Version
                    </label>
                    <select className="w-full rounded-md border border-gray-300 p-2" disabled>
                      <option>Mistral 7B Instruct v0.3 (Default)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Optimized for trumpet-specific guidance and feedback
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="mb-1 block text-sm font-medium">Temperature</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value="70"
                      disabled
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>More Focused</span>
                      <span>More Creative</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="lg:col-span-8">
          <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Trumpet Practice Assistant</h2>
            <p className="mb-4 text-gray-600">
              Get personalized trumpet practice advice from our Mistral 7B-powered assistant.
              Ask about technique, practice routines, troubleshooting, or music theory.
            </p>

            <TrumpetChatbot
              initialMessage="I'm your trumpet practice assistant powered by Mistral 7B AI. I can help you with trumpet technique, practice routines, music theory, and performance tips. What would you like help with today?"
              showTokenWarning={tokenStatus !== "valid"}
            />
          </div>

          <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Adaptive Learning System</h2>
            <p className="mb-4 text-gray-600">
              Our AI-powered adaptive learning system creates personalized practice sessions
              that adjust to your skill level and progress. Get real-time feedback and
              tailored exercises to accelerate your trumpet learning.
            </p>

            <AdaptiveLearning instrument="trumpet" sessionLength={15} />
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Practice Suggestions</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-md border border-green-100 bg-green-50 p-4">
                <h3 className="mb-2 font-medium text-green-800">Daily Warm-Up Routine</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-green-700">
                  <li>Long tones: 5 minutes, focus on tone quality</li>
                  <li>Lip slurs: 5 minutes, ascending and descending</li>
                  <li>Chromatic scales: 5 minutes, full range</li>
                  <li>Articulation exercises: 5 minutes, varying patterns</li>
                </ul>
              </div>

              <div className="rounded-md border border-blue-100 bg-blue-50 p-4">
                <h3 className="mb-2 font-medium text-blue-800">Range Extension</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-blue-700">
                  <li>Start with octave slurs in comfortable range</li>
                  <li>Gradually expand upward, one half-step at a time</li>
                  <li>Focus on air support and relaxed embouchure</li>
                  <li>End practice sessions with descending exercises</li>
                </ul>
              </div>

              <div className="rounded-md border border-purple-100 bg-purple-50 p-4">
                <h3 className="mb-2 font-medium text-purple-800">Tone Development</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-purple-700">
                  <li>Mouthpiece buzzing: 3-5 minutes daily</li>
                  <li>Listen to professional trumpet players daily</li>
                  <li>Record yourself and analyze your sound</li>
                  <li>Practice with a tuner for intonation awareness</li>
                </ul>
              </div>

              <div className="rounded-md border border-yellow-100 bg-yellow-50 p-4">
                <h3 className="mb-2 font-medium text-yellow-800">Technical Exercises</h3>
                <ul className="list-inside list-disc space-y-1 text-sm text-yellow-700">
                  <li>Scale patterns: all major and minor keys</li>
                  <li>Arpeggios: major, minor, dominant 7th</li>
                  <li>Double and triple tonguing exercises</li>
                  <li>Flexibility studies across all registers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showModal}
        message={modalMessage}
        type={modalType}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
