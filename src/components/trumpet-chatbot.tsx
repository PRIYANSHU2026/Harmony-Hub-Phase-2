"use client";

import { useState, useRef, useEffect } from "react";
import { getHuggingFaceToken } from "~/utils/midi-gpt-integration";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface TrumpetChatbotProps {
  initialMessage?: string;
  showTokenWarning?: boolean;
}

export default function TrumpetChatbot({
  initialMessage = "Hello! I'm your trumpet practice assistant. I'm here to help you with your trumpet practice using Mistral 7B AI. What would you like help with today?",
  showTokenWarning = true,
}: TrumpetChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "system-welcome",
      role: "assistant",
      content: initialMessage,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [needsToken, setNeedsToken] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if the user has a Hugging Face API token
  useEffect(() => {
    const token = getHuggingFaceToken();
    setNeedsToken(!token);
  }, []);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Check if user has a Hugging Face API token if needed
    const token = getHuggingFaceToken();
    if (!token && showTokenWarning) {
      setNeedsToken(true);
      return;
    }

    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the Mistral 7B API for a response
      const response = await fetch('/api/ai/mistral-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          apiToken: token,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get a response from Mistral 7B');
      }

      const data = await response.json();

      // Add assistant message to chat
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't generate a response at this time.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error in chatbot:", error);

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="trumpet-chatbot flex h-[500px] flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center border-b border-gray-200 bg-primary p-3 text-white">
        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary">
          🎺
        </div>
        <h3 className="text-lg font-semibold">Trumpet Practice Assistant</h3>
      </div>

      {needsToken && showTokenWarning && (
        <div className="m-3 rounded-md bg-yellow-50 p-3 text-yellow-800">
          <p className="text-sm">
            You need to set your Hugging Face API token in the AI Tools page to use the chatbot's full capabilities.
            Without a token, the chatbot will operate with limited functionality.
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 max-w-3/4 rounded-lg p-3 ${
              message.role === "user"
                ? "ml-auto bg-primary text-white"
                : "mr-auto bg-gray-100 text-gray-800"
            }`}
          >
            <div className="mb-1 text-xs opacity-70">
              {message.role === "user" ? "You" : "Trumpet Assistant"} • {formatTimestamp(message.timestamp)}
            </div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about trumpet technique, practice tips, or exercises..."
            className="flex-1 rounded-l-md border border-gray-300 p-2 focus:border-primary focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-r-md bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:bg-gray-400"
          >
            {isLoading ? (
              <span className="flex items-center">
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
                Thinking...
              </span>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
