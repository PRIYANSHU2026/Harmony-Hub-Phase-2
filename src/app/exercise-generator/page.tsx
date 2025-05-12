"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import dynamic from "next/dynamic";
import { type ExerciseParameters, type GeneratedExercise, generateExercise } from "~/utils/midi-gpt-integration";

// Import the SheetMusicRenderer component dynamically to avoid server-side rendering issues
const SheetMusicRenderer = dynamic(
  () => import("~/components/sheet-music-renderer"),
  { ssr: false }
);

export default function ExerciseGenerator() {
  const [formData, setFormData] = useState<ExerciseParameters>({
    instrument: "trumpet",
    level: "beginner",
    key: "C",
    meterNumerator: "4",
    meterDenominator: "4",
    focusType: "intervals",
    focusValue: "thirds",
    bars: "16"
  });

  const [generationStatus, setGenerationStatus] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [generatedExercise, setGeneratedExercise] = useState<GeneratedExercise | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerationStatus("generating");

    try {
      // Call the generateExercise function from our mock MIDI-GPT integration
      const exercise = await generateExercise(formData);
      setGeneratedExercise(exercise);
      setGenerationStatus("success");
    } catch (error) {
      console.error("Error generating exercise:", error);
      setGenerationStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Exercise Generator</h1>
        <p className="text-gray-600">
          Generate customized music exercises using MIDI-GPT AI
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Form Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Exercise Parameters</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="instrument" className="mb-1 block text-sm font-medium">
                  Instrument
                </label>
                <select
                  id="instrument"
                  name="instrument"
                  value={formData.instrument}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="piano">Piano</option>
                  <option value="trumpet">Trumpet</option>
                  <option value="violin">Violin</option>
                  <option value="clarinet">Clarinet</option>
                  <option value="flute">Flute</option>
                </select>
              </div>

              <div>
                <label htmlFor="level" className="mb-1 block text-sm font-medium">
                  Difficulty Level
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label htmlFor="key" className="mb-1 block text-sm font-medium">
                  Key Signature
                </label>
                <select
                  id="key"
                  name="key"
                  value={formData.key}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="C">C Major</option>
                  <option value="G">G Major</option>
                  <option value="F">F Major</option>
                  <option value="D">D Major</option>
                  <option value="Bb">Bb Major</option>
                  <option value="A">A Minor</option>
                  <option value="E">E Minor</option>
                </select>
              </div>

              <div>
                <label htmlFor="meter" className="mb-1 block text-sm font-medium">
                  Time Signature
                </label>
                <div className="flex">
                  <select
                    id="meterNumerator"
                    name="meterNumerator"
                    value={formData.meterNumerator}
                    onChange={handleChange}
                    className="w-1/2 rounded-l-md border border-gray-300 p-2"
                  >
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>
                  <select
                    id="meterDenominator"
                    name="meterDenominator"
                    value={formData.meterDenominator}
                    onChange={handleChange}
                    className="w-1/2 rounded-r-md border border-gray-300 border-l-0 p-2"
                  >
                    <option value="4">4</option>
                    <option value="8">8</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="focusType" className="mb-1 block text-sm font-medium">
                  Exercise Focus
                </label>
                <select
                  id="focusType"
                  name="focusType"
                  value={formData.focusType}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="intervals">Intervals</option>
                  <option value="scales">Scales</option>
                  <option value="arpeggios">Arpeggios</option>
                  <option value="rhythm">Rhythm</option>
                </select>
              </div>

              <div>
                <label htmlFor="focusValue" className="mb-1 block text-sm font-medium">
                  Focus Details
                </label>
                <select
                  id="focusValue"
                  name="focusValue"
                  value={formData.focusValue}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  {formData.focusType === "intervals" && (
                    <>
                      <option value="seconds">Seconds</option>
                      <option value="thirds">Thirds</option>
                      <option value="fourths">Fourths</option>
                      <option value="fifths">Fifths</option>
                    </>
                  )}
                  {formData.focusType === "scales" && (
                    <>
                      <option value="major">Major</option>
                      <option value="minor">Minor</option>
                      <option value="chromatic">Chromatic</option>
                    </>
                  )}
                  {formData.focusType === "arpeggios" && (
                    <>
                      <option value="major">Major</option>
                      <option value="minor">Minor</option>
                      <option value="dominant7">Dominant 7th</option>
                    </>
                  )}
                  {formData.focusType === "rhythm" && (
                    <>
                      <option value="simple">Simple</option>
                      <option value="compound">Compound</option>
                      <option value="syncopated">Syncopated</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="bars" className="mb-1 block text-sm font-medium">
                  Number of Bars
                </label>
                <select
                  id="bars"
                  name="bars"
                  value={formData.bars}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="8">8 bars</option>
                  <option value="16">16 bars</option>
                  <option value="24">24 bars</option>
                  <option value="32">32 bars</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={generationStatus === "generating"}
                className="w-full rounded-md bg-primary py-2 text-white hover:bg-primary/90 disabled:bg-gray-400"
              >
                {generationStatus === "generating"
                  ? "Generating..."
                  : "Generate Exercise"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview/Results Section */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">Exercise Preview</h2>

          {generationStatus === "idle" && (
            <div className="flex h-64 flex-col items-center justify-center text-gray-500">
              <p className="mb-2 text-center">
                Fill out the form and click "Generate Exercise" to see a preview
              </p>
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19c-4.3 0-8-3.7-8-8s3.7-8 8-8 8 3.7 8 8-3.7 8-8 8zm0-2c3.3 0 6-2.7 6-6s-2.7-6-6-6-6 2.7-6 6 2.7 6 6 6zm8.5 2L23 23l-5.5-5.5z" fill="currentColor"/>
              </svg>
            </div>
          )}

          {generationStatus === "generating" && (
            <div className="flex h-64 flex-col items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Generating your exercise...</p>
            </div>
          )}

          {generationStatus === "success" && generatedExercise && (
            <div className="flex flex-col">
              <div className="mb-2 text-lg font-medium">
                {generatedExercise.metadata.title}
              </div>
              <div className="mb-4 text-sm text-gray-500">
                {generatedExercise.metadata.instrument} | {generatedExercise.metadata.key} | {generatedExercise.metadata.timeSignature} | {generatedExercise.metadata.bars} bars
              </div>
              <div className="mb-4 rounded border border-gray-200 bg-gray-50 p-4">
                <div id="sheet-music-container" className="h-64 w-full bg-white">
                  <SheetMusicRenderer
                    width={500}
                    height={250}
                    musicXml={generatedExercise.musicXML}
                  />
                </div>
              </div>
              <div className="flex justify-between">
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
              <div className="mt-4">
                <Link
                  href={`/exercise/${generatedExercise.exerciseId}`}
                  className="block w-full rounded-md border border-primary bg-white py-2 text-center text-primary hover:bg-primary/10"
                >
                  View Full Exercise
                </Link>
              </div>
            </div>
          )}

          {generationStatus === "error" && (
            <div className="flex h-64 flex-col items-center justify-center text-red-600">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
              </svg>
              <p className="mt-4 text-center">
                Something went wrong while generating your exercise. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
