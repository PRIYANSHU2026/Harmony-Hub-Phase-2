"use client";

import { useEffect, useRef } from "react";
import { Factory, Formatter, Renderer, Stave, StaveNote, Voice, Accidental } from "vexflow";
import { DOMParser } from "xmldom";

interface SheetMusicRendererProps {
  musicXml?: string;
  midiData?: string;
  width?: number;
  height?: number;
}

interface Note {
  keys: string[];
  duration: string;
  dots?: number;
  accidental?: string;
}

export default function SheetMusicRenderer({
  musicXml,
  midiData,
  width = 500,
  height = 250,
}: SheetMusicRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    try {
      // Initialize VexFlow factory
      const vf = new Factory({
        renderer: {
          elementId: containerRef.current,
          width,
          height,
        },
      });

      const context = vf.getContext();

      if (musicXml) {
        renderMusicXML(musicXml, vf, context, width, height);
      } else {
        // Fallback to simple staff if no MusicXML is provided
        renderDefaultStaff(vf, context, width, height);
      }
    } catch (error) {
      console.error("Error rendering sheet music:", error);
    }
  }, [width, height, musicXml, midiData]);

  // Function to parse MusicXML and render it
  const renderMusicXML = (xml: string, vf: any, context: any, width: number, height: number) => {
    try {
      // Parse the XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");

      // Extract key information
      const fifths = getNodeValue(xmlDoc, "//key/fifths") || "0";

      // Extract time signature
      const beats = getNodeValue(xmlDoc, "//time/beats") || "4";
      const beatType = getNodeValue(xmlDoc, "//time/beat-type") || "4";

      // Extract clef
      const clefSign = getNodeValue(xmlDoc, "//clef/sign") || "G";
      const clefLine = getNodeValue(xmlDoc, "//clef/line") || "2";

      // Create a stave
      const stave = new Stave(10, 40, width - 20);

      // Add clef and time signature
      stave.addClef(clefSign === "G" ? "treble" : "bass");
      stave.addTimeSignature(`${beats}/${beatType}`);

      // Add key signature
      if (parseInt(fifths) !== 0) {
        // Convert fifths to key signature
        const keySignature = convertFifthsToKey(parseInt(fifths));
        stave.addKeySignature(keySignature);
      }

      stave.setContext(context).draw();

      // Parse notes from MusicXML
      const notes = parseNotesFromMusicXML(xmlDoc);

      if (notes.length === 0) {
        // If no notes were parsed, create some default notes
        renderDefaultNotes(vf, context, stave, width);
        return;
      }

      // Create a voice with the extracted time signature
      const voice = new Voice({
        num_beats: parseInt(beats),
        beat_value: parseInt(beatType)
      });

      // Convert parsed notes to VexFlow notes
      const vexflowNotes = notes.map((noteData: Note) => {
        const note = new StaveNote({
          keys: noteData.keys,
          duration: noteData.duration
        });

        // Add dots if needed
        if (noteData.dots) {
          for (let i = 0; i < noteData.dots; i++) {
            note.addDot(0);
          }
        }

        // Add accidental if needed
        if (noteData.accidental) {
          note.addModifier(new Accidental(noteData.accidental), 0);
        }

        return note;
      });

      voice.addTickables(vexflowNotes);

      // Format and draw the notes
      new Formatter()
        .joinVoices([voice])
        .format([voice], width - 50);

      voice.draw(context, stave);
    } catch (error) {
      console.error("Error parsing MusicXML:", error);
      // Fallback to simple staff if parsing fails
      renderDefaultStaff(vf, context, width, height);
    }
  };

  // Helper function to render a default staff with notes
  const renderDefaultStaff = (vf: any, context: any, width: number, height: number) => {
    // Create a stave
    const stave = new Stave(10, 40, width - 20);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    renderDefaultNotes(vf, context, stave, width);
  };

  // Helper function to render default notes
  const renderDefaultNotes = (vf: any, context: any, stave: any, width: number) => {
    // Create some default notes
    const notes = [
      new StaveNote({ keys: ["c/4"], duration: "q" }),
      new StaveNote({ keys: ["d/4"], duration: "q" }),
      new StaveNote({ keys: ["e/4"], duration: "q" }),
      new StaveNote({ keys: ["f/4"], duration: "q" })
    ];

    // Create a default voice
    const voice = new Voice({
      num_beats: 4,
      beat_value: 4
    });

    voice.addTickables(notes);

    // Format and draw the notes
    new Formatter()
      .joinVoices([voice])
      .format([voice], width - 50);

    voice.draw(context, stave);
  };

  // Helper function to extract node value from XML
  const getNodeValue = (doc: Document, xpath: string): string | null => {
    try {
      // Simple XPath-like functionality
      const path = xpath.replace(/\/\//g, '').split('/');
      let currentNode: any = doc;

      for (const segment of path) {
        if (!currentNode.getElementsByTagName) return null;
        const elements = currentNode.getElementsByTagName(segment);
        if (elements.length === 0) return null;
        currentNode = elements[0];
      }

      return currentNode.textContent || null;
    } catch (e) {
      console.error("XPath error:", e);
      return null;
    }
  };

  // Helper function to parse notes from MusicXML
  const parseNotesFromMusicXML = (doc: Document): Note[] => {
    const result: Note[] = [];

    try {
      const noteElements = doc.getElementsByTagName('note');

      for (let i = 0; i < noteElements.length; i++) {
        const noteElement = noteElements[i];

        // Check if it's a rest
        const restElements = noteElement.getElementsByTagName('rest');
        const isRest = restElements.length > 0;

        // Get pitch information (if not a rest)
        let step = "C";
        let octave = "4";
        let alter = 0;

        if (!isRest) {
          const pitchElement = noteElement.getElementsByTagName('pitch')[0];
          if (pitchElement) {
            const stepElement = pitchElement.getElementsByTagName('step')[0];
            const octaveElement = pitchElement.getElementsByTagName('octave')[0];
            const alterElement = pitchElement.getElementsByTagName('alter')[0];

            if (stepElement) step = stepElement.textContent || "C";
            if (octaveElement) octave = octaveElement.textContent || "4";
            if (alterElement) alter = parseInt(alterElement.textContent || "0");
          }
        }

        // Get duration information
        const typeElement = noteElement.getElementsByTagName('type')[0];
        let durationType = "q"; // Default to quarter note

        if (typeElement) {
          const type = typeElement.textContent;
          switch (type) {
            case 'whole': durationType = 'w'; break;
            case 'half': durationType = 'h'; break;
            case 'quarter': durationType = 'q'; break;
            case 'eighth': durationType = '8'; break;
            case 'sixteenth': durationType = '16'; break;
            default: durationType = 'q';
          }
        }

        // Check for dots
        const dotElements = noteElement.getElementsByTagName('dot');
        const dots = dotElements.length;

        // Create the key string
        let key = isRest ? "b/4" : `${step.toLowerCase()}/${octave}`;

        // Handle accidentals based on alter value
        let accidental = null;
        if (alter === 1) accidental = "#";
        else if (alter === -1) accidental = "b";
        else if (alter === 2) accidental = "##";
        else if (alter === -2) accidental = "bb";

        // Create the note object
        const note: Note = {
          keys: [key],
          duration: isRest ? durationType + 'r' : durationType,
          dots: dots > 0 ? dots : undefined,
          accidental: accidental || undefined
        };

        result.push(note);
      }
    } catch (error) {
      console.error("Error parsing notes:", error);
    }

    return result;
  };

  // Helper function to convert fifths value to key signature
  const convertFifthsToKey = (fifths: number): string => {
    // Positive fifths are sharps, negative are flats
    if (fifths > 0) {
      const sharpKeys = ["C", "G", "D", "A", "E", "B", "F#", "C#"];
      return sharpKeys[Math.min(fifths, 7)];
    } else if (fifths < 0) {
      const flatKeys = ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
      return flatKeys[Math.min(Math.abs(fifths), 7)];
    }
    return "C"; // Default to C major / A minor
  };

  return (
    <div className="vexflow-container" ref={containerRef} style={{ width, height }} />
  );
}
