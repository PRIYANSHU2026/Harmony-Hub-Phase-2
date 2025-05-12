"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

// Import the SheetMusicRenderer component dynamically to avoid server-side rendering issues
const SheetMusicRenderer = dynamic(
  () => import("~/components/sheet-music-renderer"),
  { ssr: false }
);

export default function ExerciseDetail() {
  const params = useParams();
  const exerciseId = params.id as string;

  const [exercise, setExercise] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching exercise data from an API
    const fetchExercise = async () => {
      try {
        setLoading(true);

        // In a real app, we would fetch from an API
        // For now, we'll create mock data based on the ID
        setTimeout(() => {
          setExercise({
            exerciseId,
            title: `Exercise ${exerciseId}`,
            instrument: "Trumpet",
            key: "C Major",
            timeSignature: "4/4",
            difficulty: "Beginner",
            focus: "Intervals - Thirds",
            bars: 16,
            createdAt: new Date().toISOString(),
            musicXML: null, // In a real app, this would contain MusicXML data
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load exercise. Please try again.");
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  if (loading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading exercise...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
            </svg>
          </div>
          <p className="mb-6 text-xl font-semibold">{error}</p>
          <Link
            href="/exercise-generator"
            className="rounded-md bg-primary px-6 py-2 text-white hover:bg-primary/90"
          >
            Back to Generator
          </Link>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-6 text-xl font-semibold">Exercise not found</p>
          <Link
            href="/exercise-generator"
            className="rounded-md bg-primary px-6 py-2 text-white hover:bg-primary/90"
          >
            Back to Generator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{exercise.title}</h1>
        <Link
          href="/exercise-generator"
          className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
        >
          Back to Generator
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="col-span-2 space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Sheet Music</h2>
            <div className="rounded border border-gray-200 bg-gray-50 p-4">
              <div className="h-96 w-full bg-white">
                <SheetMusicRenderer width={800} height={350} />
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              >
                Play
              </button>
              <button
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Download MIDI
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Pedagogical Notes</h2>
            <div className="rounded bg-gray-50 p-4">
              <p className="mb-2">
                <strong>Learning Objectives:</strong> This exercise focuses on developing facility with intervals of a third in the key of C major.
              </p>
              <p className="mb-2">
                <strong>Practice Suggestions:</strong> Begin slowly, focusing on clean articulation and precise intonation. Gradually increase tempo as comfort and accuracy improve.
              </p>
              <p>
                <strong>Common Challenges:</strong> Pay particular attention to the larger interval jumps, ensuring that you maintain consistent tone quality across all registers.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Exercise Details</h2>
            <div className="space-y-3">
              <DetailItem label="Instrument" value={exercise.instrument} />
              <DetailItem label="Key" value={exercise.key} />
              <DetailItem label="Time Signature" value={exercise.timeSignature} />
              <DetailItem label="Difficulty" value={exercise.difficulty} />
              <DetailItem label="Focus" value={exercise.focus} />
              <DetailItem label="Bars" value={exercise.bars.toString()} />
              <DetailItem label="Created" value={new Date(exercise.createdAt).toLocaleDateString()} />
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Actions</h2>
            <div className="space-y-3">
              <button className="w-full rounded-md bg-primary py-2 text-white hover:bg-primary/90">
                Save to Collection
              </button>
              <button className="w-full rounded-md border border-primary bg-white py-2 text-primary hover:bg-primary/10">
                Print Exercise
              </button>
              <button className="w-full rounded-md border border-gray-300 bg-white py-2 text-gray-700 hover:bg-gray-50">
                Share Exercise
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-2">
      <span className="font-medium text-gray-600">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
