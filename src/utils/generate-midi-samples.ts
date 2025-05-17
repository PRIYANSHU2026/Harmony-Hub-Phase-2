/**
 * MIDI Sample Generator
 *
 * This utility script generates sample MIDI files for different instruments
 * using the Web MIDI API. This would typically be run once to generate the
 * initial MIDI samples, which would then be stored in the public/midi directory.
 */

import { INSTRUMENT_PROGRAM_MAP } from './instrument-midi';
import fs from 'fs';
import path from 'path';

interface MidiNote {
  note: number;      // MIDI note number (0-127)
  velocity: number;  // Note velocity (0-127)
  start: number;     // Start time in milliseconds from the beginning
  duration: number;  // Duration in milliseconds
}

interface MidiTrack {
  instrument: number;  // MIDI program number
  notes: MidiNote[];   // Notes in the track
}

interface MidiFile {
  tempo: number;     // Tempo in BPM
  tracks: MidiTrack[];  // List of tracks
}

/**
 * Convert a C major scale to MIDI notes for a given instrument
 */
function createCMajorScale(instrument: number): MidiFile {
  const baseNote = instrument === INSTRUMENT_PROGRAM_MAP.violin ||
                   instrument === INSTRUMENT_PROGRAM_MAP.viola ||
                   instrument === INSTRUMENT_PROGRAM_MAP.cello ?
                   60 : // Middle C for string instruments
                   48;  // C3 for others

  const notes: MidiNote[] = [];
  const noteInterval = 500; // 500ms between notes

  // C major scale: C, D, E, F, G, A, B, C
  const scaleSteps = [0, 2, 4, 5, 7, 9, 11, 12];

  scaleSteps.forEach((step, index) => {
    notes.push({
      note: baseNote + step,
      velocity: 80,
      start: index * noteInterval,
      duration: noteInterval - 50 // Small gap between notes
    });
  });

  // Add descending notes
  scaleSteps.slice().reverse().slice(1).forEach((step, index) => {
    notes.push({
      note: baseNote + step,
      velocity: 80,
      start: (scaleSteps.length + index) * noteInterval,
      duration: noteInterval - 50
    });
  });

  return {
    tempo: 120,
    tracks: [{
      instrument,
      notes
    }]
  };
}

/**
 * Create a MIDI file for a G major scale
 */
function createGMajorScale(instrument: number): MidiFile {
  const baseNote = instrument === INSTRUMENT_PROGRAM_MAP.violin ||
                   instrument === INSTRUMENT_PROGRAM_MAP.viola ||
                   instrument === INSTRUMENT_PROGRAM_MAP.cello ?
                   67 : // G above middle C for string instruments
                   55;  // G3 for others

  // G major scale: G, A, B, C, D, E, F#, G
  const scaleSteps = [0, 2, 4, 5, 7, 9, 11, 12];
  const notes: MidiNote[] = [];
  const noteInterval = 500; // 500ms between notes

  scaleSteps.forEach((step, index) => {
    notes.push({
      note: baseNote + step,
      velocity: 80,
      start: index * noteInterval,
      duration: noteInterval - 50
    });
  });

  // Add descending notes
  scaleSteps.slice().reverse().slice(1).forEach((step, index) => {
    notes.push({
      note: baseNote + step,
      velocity: 80,
      start: (scaleSteps.length + index) * noteInterval,
      duration: noteInterval - 50
    });
  });

  return {
    tempo: 120,
    tracks: [{
      instrument,
      notes
    }]
  };
}

/**
 * Create a MIDI file for an F major scale
 */
function createFMajorScale(instrument: number): MidiFile {
  const baseNote = instrument === INSTRUMENT_PROGRAM_MAP.violin ||
                   instrument === INSTRUMENT_PROGRAM_MAP.viola ||
                   instrument === INSTRUMENT_PROGRAM_MAP.cello ?
                   65 : // F above middle C for string instruments
                   53;  // F3 for others

  // F major scale: F, G, A, Bb, C, D, E, F
  const scaleSteps = [0, 2, 4, 5, 7, 9, 11, 12];
  const notes: MidiNote[] = [];
  const noteInterval = 500; // 500ms between notes

  scaleSteps.forEach((step, index) => {
    notes.push({
      note: baseNote + step,
      velocity: 80,
      start: index * noteInterval,
      duration: noteInterval - 50
    });
  });

  // Add descending notes
  scaleSteps.slice().reverse().slice(1).forEach((step, index) => {
    notes.push({
      note: baseNote + step,
      velocity: 80,
      start: (scaleSteps.length + index) * noteInterval,
      duration: noteInterval - 50
    });
  });

  return {
    tempo: 120,
    tracks: [{
      instrument,
      notes
    }]
  };
}

/**
 * Create a MIDI file for an A minor scale
 */
function createAMinorScale(instrument: number): MidiFile {
  const baseNote = instrument === INSTRUMENT_PROGRAM_MAP.violin ||
                   instrument === INSTRUMENT_PROGRAM_MAP.viola ||
                   instrument === INSTRUMENT_PROGRAM_MAP.cello ?
                   69 : // A above middle C for string instruments
                   57;  // A3 for others

  // A minor scale: A, B, C, D, E, F, G, A
  const scaleSteps = [0, 2, 3, 5, 7, 8, 10, 12];
  const notes: MidiNote[] = [];
  const noteInterval = 500; // 500ms between notes

  scaleSteps.forEach((step, index) => {
    notes.push({
      note: baseNote + step,
      velocity: 80,
      start: index * noteInterval,
      duration: noteInterval - 50
    });
  });

  // Add descending notes
  scaleSteps.slice().reverse().slice(1).forEach((step, index) => {
    notes.push({
      note: baseNote + step,
      velocity: 80,
      start: (scaleSteps.length + index) * noteInterval,
      duration: noteInterval - 50
    });
  });

  return {
    tempo: 120,
    tracks: [{
      instrument,
      notes
    }]
  };
}

/**
 * Convert a MidiFile object to a MidiData buffer
 * This is a simple implementation and would need to be expanded
 * for a full MIDI file generator
 */
function midiFileToBuffer(midiFile: MidiFile): Buffer {
  // In a real implementation, this would create a proper MIDI file
  // For now, we'll create a placeholder buffer with some metadata
  const buffer = Buffer.from(JSON.stringify(midiFile));
  return buffer;
}

/**
 * Generate MIDI files for the given instrument
 *
 * @param instrument The MIDI program number of the instrument
 * @param instrumentName The name of the instrument (for folder structure)
 */
function generateInstrumentScales(instrument: number, instrumentName: string): void {
  const scales = [
    { name: 'c-major', generator: createCMajorScale },
    { name: 'g-major', generator: createGMajorScale },
    { name: 'f-major', generator: createFMajorScale },
    { name: 'a-minor', generator: createAMinorScale }
  ];

  // Create directory if it doesn't exist
  const directory = path.join('public', 'midi', instrumentName);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  scales.forEach(scale => {
    const midiFile = scale.generator(instrument);
    const buffer = midiFileToBuffer(midiFile);
    const filePath = path.join(directory, `${instrumentName}-scale-${scale.name}.mid`);

    // Write the file
    fs.writeFileSync(filePath, buffer);
    console.log(`Generated ${filePath}`);
  });
}

/**
 * Main function to generate all MIDI samples
 */
export function generateAllMidiSamples(): void {
  // Generate piano scales
  generateInstrumentScales(INSTRUMENT_PROGRAM_MAP.piano, 'piano');

  // Generate trumpet scales
  generateInstrumentScales(INSTRUMENT_PROGRAM_MAP.trumpet, 'trumpet');

  // Generate violin scales
  generateInstrumentScales(INSTRUMENT_PROGRAM_MAP.violin, 'violin');

  // Generate clarinet scales
  generateInstrumentScales(INSTRUMENT_PROGRAM_MAP.clarinet, 'clarinet');

  // Generate flute scales
  generateInstrumentScales(INSTRUMENT_PROGRAM_MAP.flute, 'flute');

  // Generate guitar scales
  generateInstrumentScales(INSTRUMENT_PROGRAM_MAP.acoustic_guitar_nylon, 'guitar');

  // Generate alto sax scales
  generateInstrumentScales(INSTRUMENT_PROGRAM_MAP.alto_sax, 'sax');
}

// If this file is run directly, generate all samples
if (require.main === module) {
  generateAllMidiSamples();
}
