/**
 * XML Generator Utilities
 *
 * This file contains functions to generate and format XML data for exercises
 */

import { type GeneratedExercise } from "./midi-gpt-integration";

/**
 * Generates a MusicXML representation of an exercise
 * @param exercise The generated exercise data
 * @returns XML string
 */
export function generateMusicXML(exercise: GeneratedExercise): string {
  // If the exercise already has MusicXML, just return it
  if (exercise.musicXML) {
    return exercise.musicXML;
  }

  // Otherwise generate a simple MusicXML representation
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <work>
    <work-title>${exercise.metadata.title}</work-title>
  </work>
  <identification>
    <creator type="composer">HarmonyHub AI</creator>
    <encoding>
      <software>HarmonyHub</software>
      <encoding-date>${new Date().toISOString().slice(0, 10)}</encoding-date>
    </encoding>
  </identification>
  <part-list>
    <score-part id="P1">
      <part-name>${exercise.metadata.instrument}</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>${exercise.metadata.timeSignature.split('/')[0]}</beats>
          <beat-type>${exercise.metadata.timeSignature.split('/')[1]}</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
      <!-- Placeholder for more notes -->
    </measure>
    <!-- Placeholder for more measures -->
  </part>
</score-partwise>`;
}

/**
 * Generates an XML representation of exercise metadata
 * @param exercise The generated exercise data
 * @returns XML string
 */
export function generateExerciseMetadataXML(exercise: GeneratedExercise): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<harmonyHubExercise>
  <exercise id="${exercise.exerciseId}">
    <metadata>
      <title>${exercise.metadata.title}</title>
      <instrument>${exercise.metadata.instrument}</instrument>
      <key>${exercise.metadata.key}</key>
      <timeSignature>${exercise.metadata.timeSignature}</timeSignature>
      <difficulty>${exercise.metadata.difficulty}</difficulty>
      <focus>${exercise.metadata.focus}</focus>
      <bars>${exercise.metadata.bars}</bars>
      <generatedAt>${exercise.metadata.generatedAt.toISOString()}</generatedAt>
    </metadata>
  </exercise>
</harmonyHubExercise>`;
}

/**
 * Download the generated XML as a file
 * @param xmlContent The XML content to download
 * @param filename The name of the file to download
 */
export function downloadXML(xmlContent: string, filename: string): void {
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
