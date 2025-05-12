"use client";

import { useEffect, useRef } from "react";
import { Flow } from "vexflow";

interface SheetMusicRendererProps {
  musicXml?: string;
  midiData?: string;
  width?: number;
  height?: number;
}

export default function SheetMusicRenderer({
  musicXml,
  midiData,
  width = 500,
  height = 150,
}: SheetMusicRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    try {
      // Create a simple score with static notes for demonstration
      // In a real app, this would parse the MusicXML data

      // Initialize VexFlow renderer
      const renderer = new Flow.Renderer(
        containerRef.current,
        Flow.Renderer.Backends.SVG
      );

      renderer.resize(width, height);
      const context = renderer.getContext();

      // Create a stave
      const stave = new Flow.Stave(10, 40, width - 20);
      stave.addClef("treble").addTimeSignature("4/4");
      stave.setContext(context).draw();

      // Create some notes
      const notes = [
        new Flow.StaveNote({ keys: ["c/4"], duration: "q" }),
        new Flow.StaveNote({ keys: ["d/4"], duration: "q" }),
        new Flow.StaveNote({ keys: ["e/4"], duration: "q" }),
        new Flow.StaveNote({ keys: ["f/4"], duration: "q" })
      ];

      // Create a voice
      const voice = new Flow.Voice({
        num_beats: 4,
        beat_value: 4
      });

      voice.addTickables(notes);

      // Format and draw the notes
      new Flow.Formatter()
        .joinVoices([voice])
        .format([voice], width - 50);

      voice.draw(context, stave);
    } catch (error) {
      console.error("Error rendering sheet music:", error);
    }
  }, [width, height, musicXml, midiData]);

  return (
    <div className="vexflow-container" ref={containerRef} style={{ width, height }} />
  );
}
