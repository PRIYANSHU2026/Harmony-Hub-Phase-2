/**
 * MIDI Export Utilities
 *
 * This file contains functions to generate and export MIDI files from music data
 */

// import * as MidiWriter from 'midi-writer-js';
// Using a more browser-friendly approach since we need to run in the browser

// Note mapping from letter notation to MIDI values
const NOTE_MAP: Record<string, number> = {
  'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63,
  'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68,
  'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71
};

/**
 * Converts a MusicXML string to a binary MIDI file
 * @param musicXml The MusicXML string to convert
 * @returns Binary MIDI data
 */
export function convertMusicXMLToMIDI(musicXml: string): ArrayBuffer {
  // Parse the MusicXML
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(musicXml, "text/xml");

  // Extract basic information
  const divisions = getElementTextContentOrDefault(xmlDoc, "divisions", "1");
  const beatsPerMeasure = getElementTextContentOrDefault(xmlDoc, "beats", "4");
  const beatType = getElementTextContentOrDefault(xmlDoc, "beat-type", "4");

  // Create a simple MIDI file header
  // Format: MThd + <length> + <format> + <tracks> + <division>
  const headerBuffer = new ArrayBuffer(14);
  const headerView = new DataView(headerBuffer);

  // "MThd" marker
  headerView.setUint8(0, 77); // M
  headerView.setUint8(1, 84); // T
  headerView.setUint8(2, 104); // h
  headerView.setUint8(3, 100); // d

  // Header length (always 6)
  headerView.setUint32(4, 6);

  // Format (0 = single track)
  headerView.setUint16(8, 0);

  // Number of tracks (1 for format 0)
  headerView.setUint16(10, 1);

  // Division (ticks per quarter note, standard = 480)
  headerView.setUint16(12, 480);

  // Create track data with notes from MusicXML
  const { trackBuffer, trackLength } = createTrackFromMusicXML(xmlDoc, parseInt(divisions), parseInt(beatsPerMeasure), parseInt(beatType));

  // Combine header and track
  const midiBuffer = new ArrayBuffer(headerBuffer.byteLength + trackBuffer.byteLength);
  const midiBufferView = new Uint8Array(midiBuffer);

  midiBufferView.set(new Uint8Array(headerBuffer), 0);
  midiBufferView.set(new Uint8Array(trackBuffer), headerBuffer.byteLength);

  return midiBuffer;
}

/**
 * Create a MIDI track from MusicXML data
 */
function createTrackFromMusicXML(
  xmlDoc: Document,
  divisions: number,
  beatsPerMeasure: number,
  beatType: number
): { trackBuffer: ArrayBuffer, trackLength: number } {
  // Start with track header
  const events: number[][] = [];

  // Add track header "MTrk"
  events.push([77, 84, 114, 107]);

  // Placeholder for track length (to be filled later)
  events.push([0, 0, 0, 0]);

  // Set tempo (default: 120 BPM = 500,000 microseconds per quarter note)
  events.push([0, 255, 81, 3, 7, 161, 32]); // Meta event for tempo

  // Set time signature
  events.push([0, 255, 88, 4, beatsPerMeasure, Math.log2(beatType), 24, 8]); // Meta event for time signature

  // Process notes from MusicXML
  const noteElements = xmlDoc.getElementsByTagName('note');
  let currentTime = 0;

  for (let i = 0; i < noteElements.length; i++) {
    const note = noteElements[i];

    // Get duration in MIDI ticks
    const durationElement = note.getElementsByTagName('duration')[0];
    if (!durationElement) continue;

    const duration = parseInt(durationElement.textContent || "0");
    const durationInTicks = Math.round((duration / divisions) * 480); // Convert to MIDI ticks

    // Check if it's a rest
    const isRest = note.getElementsByTagName('rest').length > 0;

    if (!isRest) {
      // Get pitch information
      const pitchElement = note.getElementsByTagName('pitch')[0];
      if (!pitchElement) continue;

      const stepElement = pitchElement.getElementsByTagName('step')[0];
      const octaveElement = pitchElement.getElementsByTagName('octave')[0];
      const alterElement = pitchElement.getElementsByTagName('alter')[0];

      if (!stepElement || !octaveElement) continue;

      const step = stepElement.textContent || "C";
      const octave = parseInt(octaveElement.textContent || "4");
      const alter = alterElement ? parseInt(alterElement.textContent || "0") : 0;

      // Calculate MIDI note number
      let noteNumber = NOTE_MAP[step] + (octave - 4) * 12;

      // Apply accidental
      noteNumber += alter;

      // Note on event (delta time, status byte, note number, velocity)
      events.push([currentTime, 0x90, noteNumber, 100]); // Channel 1, velocity 100

      // Note off event (after duration)
      events.push([durationInTicks, 0x80, noteNumber, 0]); // Channel 1, velocity 0
    } else {
      // Just advance time for rests
      events.push([durationInTicks, 0x90, 60, 0]); // Silent note
      events.push([0, 0x80, 60, 0]);
    }

    // Update current time
    currentTime = 0; // Reset delta time for the next event
  }

  // End of track marker
  events.push([0, 255, 47, 0]);

  // Calculate total track length
  let trackLength = 0;
  for (const event of events) {
    trackLength += event.length;
  }

  // Allocate buffer for track data
  const trackBuffer = new ArrayBuffer(trackLength);
  const trackView = new Uint8Array(trackBuffer);

  // Fill buffer with track data
  let offset = 0;
  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    // First 4 bytes of second event is track length (need to set this later)
    if (i === 1) {
      offset += event.length;
      continue;
    }

    // Copy event data to buffer
    for (let j = 0; j < event.length; j++) {
      trackView[offset++] = event[j];
    }
  }

  // Calculate and set track length (total length - 8 bytes for header)
  const actualTrackLength = trackLength - 8;
  trackView[4] = (actualTrackLength >> 24) & 0xFF;
  trackView[5] = (actualTrackLength >> 16) & 0xFF;
  trackView[6] = (actualTrackLength >> 8) & 0xFF;
  trackView[7] = actualTrackLength & 0xFF;

  return { trackBuffer, trackLength };
}

/**
 * Helper function to get element text content with a default value
 */
function getElementTextContentOrDefault(doc: Document, tagName: string, defaultValue: string): string {
  const elements = doc.getElementsByTagName(tagName);
  if (elements.length === 0) return defaultValue;
  return elements[0].textContent || defaultValue;
}

/**
 * Download MIDI data as a file
 * @param midiData The MIDI data to download
 * @param filename The name of the file to download
 */
export function downloadMIDI(midiData: ArrayBuffer, filename: string): void {
  const blob = new Blob([midiData], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate a MIDI file from music parameters
 * @param parameters The music parameters
 * @returns Binary MIDI data
 */
export function generateSimpleMIDI(
  key: string = "C",
  timeSignature: string = "4/4",
  notePattern: string[] = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]
): ArrayBuffer {
  // Calculate time signature values
  const [beats, beatValue] = timeSignature.split('/').map(Number);

  // Create a simple MIDI file header
  const headerBuffer = new ArrayBuffer(14);
  const headerView = new DataView(headerBuffer);

  // "MThd" marker
  headerView.setUint8(0, 77); // M
  headerView.setUint8(1, 84); // T
  headerView.setUint8(2, 104); // h
  headerView.setUint8(3, 100); // d

  // Header length (always 6)
  headerView.setUint32(4, 6);

  // Format (0 = single track)
  headerView.setUint16(8, 0);

  // Number of tracks (1 for format 0)
  headerView.setUint16(10, 1);

  // Division (ticks per quarter note, standard = 480)
  headerView.setUint16(12, 480);

  // Generate simple track with note pattern
  const trackEvents: number[][] = [];

  // Track header "MTrk"
  trackEvents.push([77, 84, 114, 107]);

  // Placeholder for track length (to be filled later)
  trackEvents.push([0, 0, 0, 0]);

  // Set tempo (120 BPM)
  trackEvents.push([0, 255, 81, 3, 7, 161, 32]);

  // Set time signature
  trackEvents.push([0, 255, 88, 4, beats, Math.log2(beatValue), 24, 8]);

  // Add notes based on pattern
  let currentTime = 0;

  for (const noteStr of notePattern) {
    // Parse note string (e.g., "C4", "D#3")
    const noteParts = noteStr.match(/([A-G][#b]?)(\d+)/);
    if (!noteParts) continue;

    const [, noteName, octave] = noteParts;
    const baseNote = noteName.charAt(0);
    const accidental = noteName.length > 1 ? noteName.charAt(1) : '';

    // Calculate MIDI note number
    let midiNote = NOTE_MAP[baseNote] + (parseInt(octave) - 4) * 12;

    // Apply accidental
    if (accidental === '#') midiNote += 1;
    else if (accidental === 'b') midiNote -= 1;

    // Note on event
    trackEvents.push([currentTime, 0x90, midiNote, 100]);

    // Quarter note duration (480 ticks)
    const noteDuration = 480;

    // Note off event
    trackEvents.push([noteDuration, 0x80, midiNote, 0]);

    // Reset delta time
    currentTime = 0;
  }

  // End of track marker
  trackEvents.push([0, 255, 47, 0]);

  // Calculate track length
  let trackLength = 0;
  for (const event of trackEvents) {
    trackLength += event.length;
  }

  // Create track buffer
  const trackBuffer = new ArrayBuffer(trackLength);
  const trackView = new Uint8Array(trackBuffer);

  // Fill buffer with track data
  let offset = 0;
  for (let i = 0; i < trackEvents.length; i++) {
    const event = trackEvents[i];

    // Skip track length placeholder for now
    if (i === 1) {
      offset += event.length;
      continue;
    }

    // Copy event data to buffer
    for (let j = 0; j < event.length; j++) {
      trackView[offset++] = event[j];
    }
  }

  // Set track length
  const actualTrackLength = trackLength - 8;
  trackView[4] = (actualTrackLength >> 24) & 0xFF;
  trackView[5] = (actualTrackLength >> 16) & 0xFF;
  trackView[6] = (actualTrackLength >> 8) & 0xFF;
  trackView[7] = actualTrackLength & 0xFF;

  // Combine header and track
  const midiBuffer = new ArrayBuffer(headerBuffer.byteLength + trackBuffer.byteLength);
  const midiBufferView = new Uint8Array(midiBuffer);

  midiBufferView.set(new Uint8Array(headerBuffer), 0);
  midiBufferView.set(new Uint8Array(trackBuffer), headerBuffer.byteLength);

  return midiBuffer;
}
