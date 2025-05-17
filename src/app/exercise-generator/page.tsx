"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import dynamic from "next/dynamic";
import {
  type ExerciseParameters,
  type GeneratedExercise,
  generateExercise,
  getHuggingFaceToken,
  analyzeMidiPerformance
} from "~/utils/midi-gpt-integration";
import { generateExerciseMetadataXML, downloadXML } from "~/utils/xml-generator";
import { convertMusicXMLToMIDI, downloadMIDI, generateSimpleMIDI } from "~/utils/midi-export";
import { COMMON_INSTRUMENTS, getInstrumentDisplayName, getInstrumentSampleMidi } from "~/utils/instrument-midi";

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
  const [needsToken, setNeedsToken] = useState<boolean>(false);
  const [sampleMidiPath, setSampleMidiPath] = useState<string | null>(null);

  // Check if the user has a Hugging Face API token
  useEffect(() => {
    const token = getHuggingFaceToken();
    setNeedsToken(!token);

    // Set a sample MIDI path based on the selected instrument
    if (formData.instrument) {
      setSampleMidiPath(getInstrumentSampleMidi(formData.instrument));
    }
  }, [formData.instrument]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Update sample MIDI path when instrument changes
    if (name === 'instrument') {
      setSampleMidiPath(getInstrumentSampleMidi(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerationStatus("generating");

    try {
      // Check if user has a Hugging Face API token
      const token = getHuggingFaceToken();
      if (!token) {
        setNeedsToken(true);
        throw new Error("Hugging Face API token is required");
      }

      // Call the generateExercise function from our Mistral 7B integration
      const exercise = await generateExercise(formData);
      setGeneratedExercise(exercise);
      setGenerationStatus("success");
    } catch (error) {
      console.error("Error generating exercise:", error);
      setGenerationStatus("error");
    }
  };

  const analyzeMidiFile = async () => {
    if (!generatedExercise) return;

    try {
      const results = await analyzeMidiPerformance(generatedExercise.midiData, generatedExercise);

      // Display results in an alert for now
      // In a real implementation, this would be a proper UI component
      alert(`
Analysis Results:
- Overall Accuracy: ${results.accuracy.toFixed(1)}%
- Tempo: ${results.tempo.toFixed(1)} BPM
- Rhythm Accuracy: ${results.rhythmAccuracy.toFixed(1)}%
- Pitch Accuracy: ${results.pitchAccuracy.toFixed(1)}%

Suggestions:
${results.suggestions.map((s: string) => `- ${s}`).join('\n')}
      `);
    } catch (error) {
      console.error("Error analyzing MIDI:", error);
      alert("Error analyzing MIDI performance");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Exercise Generator</h1>
        <p className="text-gray-600">
          Generate customized music exercises using Mistral 7B AI
        </p>
        {needsToken && (
          <div className="mt-2 rounded-md bg-yellow-50 p-3 text-yellow-800">
            <p className="text-sm">
              You need to set your Hugging Face API token in the{" "}
              <Link href="/ai-tools" className="font-medium text-yellow-900 underline">
                AI Tools
              </Link>{" "}
              page to use Mistral 7B features.
            </p>
          </div>
        )}
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
                  {COMMON_INSTRUMENTS.map(instrument => (
                    <option key={instrument} value={instrument}>
                      {getInstrumentDisplayName(instrument)}
                    </option>
                  ))}
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
                disabled={generationStatus === "generating" || needsToken}
                className="w-full rounded-md bg-primary py-2 text-white hover:bg-primary/90 disabled:bg-gray-400"
              >
                {generationStatus === "generating"
                  ? "Generating..."
                  : "Generate Exercise"}
              </button>
            </div>

            {sampleMidiPath && (
              <div className="mt-4 text-center">
                <p className="mb-1 text-sm text-gray-500">
                  Try a sample MIDI file for {getInstrumentDisplayName(formData.instrument)}:
                </p>
                <audio controls className="mt-2 w-full">
                  <source src={sampleMidiPath} type="audio/midi" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
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
              <p className="mt-4 text-gray-600">Generating your exercise with Mistral 7B...</p>
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

              {generatedExercise.suggestedImprovements && generatedExercise.suggestedImprovements.length > 0 && (
                <div className="mb-4 rounded-md border border-green-100 bg-green-50 p-3">
                  <h3 className="mb-2 text-sm font-medium text-green-800">Suggestions for Practice:</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-green-700">
                    {generatedExercise.suggestedImprovements.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    // Generate some simple notes for playback
                    const oscillator = audioContext.createOscillator();
                    oscillator.type = 'sine';
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4

                    const gainNode = audioContext.createGain();
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    // Play a simple sequence
                    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
                    oscillator.start();

                    // Play a simple melody
                    const notes = [440, 494, 523, 587, 659, 698, 784];
                    let time = audioContext.currentTime;

                    notes.forEach((freq, i) => {
                      oscillator.frequency.setValueAtTime(freq, time + i * 0.5);
                      gainNode.gain.setValueAtTime(0.5, time + i * 0.5);
                      gainNode.gain.setValueAtTime(0, time + i * 0.5 + 0.4);
                    });

                    // Stop after the sequence
                    oscillator.stop(time + notes.length * 0.5 + 0.5);
                  }}
                  className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                >
                  Play
                </button>
                <button
                  onClick={analyzeMidiFile}
                  className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
                >
                  Analyze
                </button>
                <button
                  onClick={() => {
                    try {
                      // Try to convert the musicXML to MIDI
                      const midiData = generatedExercise.musicXML
                        ? convertMusicXMLToMIDI(generatedExercise.musicXML)
                        : generateSimpleMIDI(
                            generatedExercise.metadata.key,
                            generatedExercise.metadata.timeSignature,
                            ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]
                          );

                      downloadMIDI(midiData, `exercise-${generatedExercise.exerciseId}.mid`);
                    } catch (error) {
                      console.error("Error generating MIDI:", error);
                      alert("There was an error generating the MIDI file. Please try again.");
                    }
                  }}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Download MIDI
                </button>
                <button
                  onClick={() => downloadXML(generateExerciseMetadataXML(generatedExercise), `exercise-${generatedExercise.exerciseId}.xml`)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Download XML
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
              {needsToken && (
                <p className="mt-2 text-center text-sm">
                  Make sure you've set your Hugging Face API token in the AI Tools page.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
