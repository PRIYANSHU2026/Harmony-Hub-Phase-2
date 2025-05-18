"use client";

import { useState, useEffect } from "react";
import { getHuggingFaceToken, isTokenValidated } from "~/utils/midi-gpt-integration";
import AuthModal from "./auth-modal";

interface AdaptiveLearningProps {
  instrument?: string;
  sessionLength?: number;
}

interface LearningSession {
  topic: string;
  instructions: string[];
  difficulty: number;
  adaptiveFeedback: string;
}

export default function AdaptiveLearning({
  instrument = "trumpet",
  sessionLength = 15,
}: AdaptiveLearningProps) {
  const [userSkillLevel, setUserSkillLevel] = useState<number>(3); // 1-5 scale
  const [selectedTopic, setSelectedTopic] = useState<string>("Tone Production");
  const [isGenerating, setIsGenerating] = useState(false);
  const [learningSession, setLearningSession] = useState<LearningSession | null>(null);
  const [userFeedback, setUserFeedback] = useState<string>("");
  const [adaptiveFeedbackOpen, setAdaptiveFeedbackOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Modal state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalType, setModalType] = useState<"success" | "error" | "info">("info");

  // Topics for adaptive learning
  const topics = [
    "Tone Production",
    "Articulation Technique",
    "Breath Control",
    "Range Extension",
    "Tonguing Speed",
    "Dynamic Control",
    "Intonation",
    "Reading Music"
  ];

  // Generate adaptive learning session
  const generateSession = async () => {
    // Check for token
    const token = getHuggingFaceToken();
    if (!token || !isTokenValidated()) {
      showAuthModal("Please add your Hugging Face API token in the AI Tools page to use adaptive learning.", "info");
      return;
    }

    setIsGenerating(true);
    setLearningSession(null);

    try {
      // Call Mistral 7B API to generate adaptive learning session
      const response = await fetch('/api/ai/mistral-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiToken: token,
          messages: [
            {
              role: "system",
              content: `You are an adaptive learning assistant for ${instrument} players. Generate a personalized practice session for a skill level ${userSkillLevel} player (scale of 1-5) focusing on ${selectedTopic}. The session should take about ${sessionLength} minutes to complete.`
            },
            {
              role: "user",
              content: `Create an adaptive learning session for ${instrument} focused on ${selectedTopic}. My skill level is ${userSkillLevel}/5, and I have ${sessionLength} minutes to practice.`
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate adaptive learning session: ${response.statusText}`);
      }

      const data = await response.json();

      // Parse the response from Mistral to extract structured data
      const sessionData = parseSessionFromResponse(data.response);
      setLearningSession(sessionData);

      // Show success message
      showAuthModal("Adaptive learning session created successfully!", "success");

    } catch (error) {
      console.error("Error generating adaptive session:", error);
      showAuthModal("Failed to generate adaptive learning session. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Parse the text response from Mistral into a structured session
  const parseSessionFromResponse = (response: string): LearningSession => {
    // Default structure if parsing fails
    const defaultSession: LearningSession = {
      topic: selectedTopic,
      instructions: ["Practice long tones", "Work on breath control", "Focus on consistent sound"],
      difficulty: userSkillLevel,
      adaptiveFeedback: "Keep practicing consistently and focus on gradual improvement."
    };

    try {
      // Attempt to find instruction steps in the response
      const instructionPattern = /(\d+\.\s.*?)(?=\d+\.\s|$)/gs;
      const instructions = [...response.matchAll(instructionPattern)]
        .map(match => match[0].trim())
        .filter(Boolean);

      // If no structured instructions found, split by newlines and clean up
      const fallbackInstructions = instructions.length > 0
        ? instructions
        : response.split(/\n+/)
            .map(line => line.trim())
            .filter(line => line.length > 10 && !line.startsWith("#") && !line.includes("session") && !line.includes("Session"));

      return {
        topic: selectedTopic,
        instructions: fallbackInstructions.slice(0, 5), // Limit to 5 instructions for clarity
        difficulty: userSkillLevel,
        adaptiveFeedback: "Complete these exercises and provide feedback for personalized adjustments."
      };
    } catch (error) {
      console.error("Error parsing session response:", error);
      return defaultSession;
    }
  };

  // Generate adaptive feedback based on user's experience
  const generateAdaptiveFeedback = async () => {
    if (!userFeedback.trim() || !learningSession) return;

    const token = getHuggingFaceToken();
    if (!token || !isTokenValidated()) {
      showAuthModal("Please add your Hugging Face API token to receive adaptive feedback.", "info");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/ai/mistral-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiToken: token,
          messages: [
            {
              role: "system",
              content: `You are an adaptive learning assistant for ${instrument} players. Analyze the user's feedback on their practice session and provide personalized recommendations to improve their learning experience.`
            },
            {
              role: "user",
              content: `I just completed a practice session focused on ${selectedTopic} at difficulty level ${userSkillLevel}/5. Here's my feedback: ${userFeedback}`
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate adaptive feedback: ${response.statusText}`);
      }

      const data = await response.json();

      // Update the session with adaptive feedback
      setLearningSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          adaptiveFeedback: data.response
        };
      });

      setAdaptiveFeedbackOpen(true);

    } catch (error) {
      console.error("Error generating adaptive feedback:", error);
      showAuthModal("Failed to generate adaptive feedback. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle step completion toggle
  const toggleStepCompletion = (index: number) => {
    setCompletedSteps(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Show authentication modal with message
  const showAuthModal = (message: string, type: "success" | "error" | "info") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">Adaptive Learning</h2>

      {!learningSession ? (
        <div className="mb-6">
          <p className="mb-4 text-gray-600">
            Create a personalized practice session tailored to your skill level and available time.
            Our AI will adapt exercises based on your feedback.
          </p>

          <div className="mb-4">
            <label htmlFor="skill-level" className="mb-2 block text-sm font-medium">
              Your Skill Level
            </label>
            <select
              id="skill-level"
              value={userSkillLevel}
              onChange={(e) => setUserSkillLevel(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value={1}>Beginner (1)</option>
              <option value={2}>Advanced Beginner (2)</option>
              <option value={3}>Intermediate (3)</option>
              <option value={4}>Advanced (4)</option>
              <option value={5}>Expert (5)</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="topic" className="mb-2 block text-sm font-medium">
              Practice Focus
            </label>
            <select
              id="topic"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="session-length" className="mb-2 block text-sm font-medium">
              Session Length (minutes)
            </label>
            <select
              id="session-length"
              value={sessionLength}
              onChange={(e) => setUserSkillLevel(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value={5}>5 minutes (quick)</option>
              <option value={15}>15 minutes (standard)</option>
              <option value={30}>30 minutes (extended)</option>
              <option value={45}>45 minutes (comprehensive)</option>
            </select>
          </div>

          <button
            onClick={generateSession}
            disabled={isGenerating}
            className="w-full rounded-md bg-primary py-2 text-white hover:bg-primary/90 disabled:bg-gray-400"
          >
            {isGenerating ? (
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
                Generating Session...
              </span>
            ) : (
              "Create Adaptive Learning Session"
            )}
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex justify-between">
            <h3 className="text-lg font-medium">{learningSession.topic} Practice</h3>
            <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              Level {learningSession.difficulty}/5
            </span>
          </div>

          <div className="mb-6 space-y-3">
            {learningSession.instructions.map((instruction, index) => (
              <div
                key={index}
                className={`flex items-start rounded-md border p-3 ${
                  completedSteps.includes(index) ? "border-green-200 bg-green-50" : "border-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={completedSteps.includes(index)}
                  onChange={() => toggleStepCompletion(index)}
                  className="mr-3 mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex-1">
                  <p className={completedSteps.includes(index) ? "text-gray-500 line-through" : ""}>
                    {instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label htmlFor="user-feedback" className="mb-2 block text-sm font-medium">
              How did this practice session go? (Provide feedback for adaptive adjustments)
            </label>
            <textarea
              id="user-feedback"
              value={userFeedback}
              onChange={(e) => setUserFeedback(e.target.value)}
              placeholder="Describe what was challenging, what was easy, and how you felt during practice..."
              className="w-full rounded-md border border-gray-300 p-2"
              rows={3}
            />
          </div>

          <div className="mb-6 flex gap-3">
            <button
              onClick={generateAdaptiveFeedback}
              disabled={isGenerating || !userFeedback.trim()}
              className="flex-1 rounded-md bg-primary py-2 text-white hover:bg-primary/90 disabled:bg-gray-400"
            >
              {isGenerating ? "Generating..." : "Get Adaptive Feedback"}
            </button>

            <button
              onClick={() => {
                setLearningSession(null);
                setUserFeedback("");
                setCompletedSteps([]);
                setAdaptiveFeedbackOpen(false);
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              New Session
            </button>
          </div>

          {adaptiveFeedbackOpen && learningSession.adaptiveFeedback && (
            <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
              <h4 className="mb-2 font-medium text-primary">Adaptive Feedback</h4>
              <p className="text-gray-700 whitespace-pre-line">{learningSession.adaptiveFeedback}</p>
            </div>
          )}
        </div>
      )}

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
