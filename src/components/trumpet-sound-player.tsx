"use client";

import { useState, useEffect, useRef } from "react";
import { getTrumpetSoundFile, getAllTrumpetSounds } from "~/utils/instrument-midi";

interface TrumpetSoundPlayerProps {
  selectedKey?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  variation?: number;
  onPlayComplete?: () => void;
}

export default function TrumpetSoundPlayer({
  selectedKey = "C",
  autoPlay = false,
  showControls = true,
  variation,
  onPlayComplete,
}: TrumpetSoundPlayerProps) {
  const [soundFile, setSoundFile] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [allSounds, setAllSounds] = useState<Record<string, string[]>>({});
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load the sound file for the selected key
  useEffect(() => {
    const soundFilePath = getTrumpetSoundFile(selectedKey, variation);
    setSoundFile(soundFilePath);
    setAllSounds(getAllTrumpetSounds());
  }, [selectedKey, variation]);

  // Handle autoplay
  useEffect(() => {
    if (autoPlay && soundFile && audioRef.current) {
      void audioRef.current.play().catch(error => {
        console.error("Error playing trumpet sound:", error);
      });
    }
  }, [autoPlay, soundFile]);

  const handlePlay = () => {
    if (audioRef.current) {
      void audioRef.current.play().catch(error => {
        console.error("Error playing trumpet sound:", error);
      });
      setIsPlaying(true);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onPlayComplete) {
      onPlayComplete();
    }
  };

  const handleSelectSoundVariation = (index: number) => {
    const soundFilePath = getTrumpetSoundFile(selectedKey, index);
    setSoundFile(soundFilePath);
  };

  return (
    <div className="trumpet-sound-player rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-semibold">Trumpet Sound - Key of {selectedKey}</h3>

      <audio
        ref={audioRef}
        src={soundFile}
        onEnded={handleEnded}
        controls={showControls}
        className={showControls ? "w-full mb-3" : "hidden"}
      />

      {!showControls && (
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className="mb-3 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:bg-gray-400"
        >
          {isPlaying ? "Playing..." : "Play Trumpet Sound"}
        </button>
      )}

      {allSounds[selectedKey?.charAt(0).toUpperCase()] && (
        <div className="mt-2">
          <p className="mb-2 text-sm font-medium">Sound Variations:</p>
          <div className="flex flex-wrap gap-2">
            {allSounds[selectedKey?.charAt(0).toUpperCase()]?.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSelectSoundVariation(index)}
                className={`h-8 w-8 rounded-full ${
                  soundFile === getTrumpetSoundFile(selectedKey, index)
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Play this trumpet sound to understand the tone and timbre you should
          aim for in your practice.
        </p>
      </div>
    </div>
  );
}
